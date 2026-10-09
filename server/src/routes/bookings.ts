import { Router } from "express";
import { z } from "zod";
import { EventType, Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { dateStringSchema, idSchema, longText, parseBody, parseQuery, sendServerError } from "../lib/http";
import { calculateLimiter } from "../lib/rate-limit";
import { authenticate, AuthRequest, calculateGST, generateBookingNumber } from "../middleware/auth";

const router = Router();

/* ---- Pricing ------------------------------------------------------------ */

const SERVICE_PRICES: Record<string, number | ((guests: number) => number)> = {
  photography: 50000,
  videography: 75000,
  decoration: 100000,
  catering: (guests) => guests * 800,
  dj: 30000,
  live_band: 150000,
  makeup: 25000,
  transport: 20000,
  security: 15000,
};
const SERVICE_KEYS = Object.keys(SERVICE_PRICES) as [string, ...string[]];

const additionalServicesSchema = z.array(z.enum(SERVICE_KEYS)).max(SERVICE_KEYS.length).default([]);
const couponCodeSchema = z.string().trim().toUpperCase().min(2).max(32).optional();
const guestCountSchema = z.number().int().min(1).max(100000);

function servicesTotal(services: string[], guests: number): number {
  return services.reduce((sum, key) => {
    const price = SERVICE_PRICES[key];
    return sum + (typeof price === "function" ? price(guests) : price);
  }, 0);
}

type CouponCheck =
  | { ok: true; coupon: { id: string; discountType: string; discountValue: number }; discount: number }
  | { ok: false; reason: string };

/**
 * A coupon counts only when it is active, unexpired, under its usage cap and
 * the subtotal meets its minimum. The discount is clamped to [0, subtotal] so a
 * misconfigured flat value can never push a total below zero.
 */
async function checkCoupon(code: string, subtotal: number): Promise<CouponCheck> {
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.isActive) return { ok: false, reason: "Coupon not found" };
  if (coupon.expiresAt && coupon.expiresAt.getTime() <= Date.now()) return { ok: false, reason: "Coupon has expired" };
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) return { ok: false, reason: "Coupon usage limit reached" };
  if (coupon.minAmount != null && subtotal < coupon.minAmount) {
    return { ok: false, reason: `Coupon needs a subtotal of at least ₹${coupon.minAmount.toLocaleString("en-IN")}` };
  }

  const raw = coupon.discountType === "percentage" ? subtotal * (coupon.discountValue / 100) : coupon.discountValue;
  const discount = Math.min(Math.max(0, Math.round(raw * 100) / 100), subtotal);
  return { ok: true, coupon, discount };
}

async function venueCostFor(venueId: string | undefined): Promise<number | null> {
  if (!venueId) return 0;
  const venue = await prisma.venue.findUnique({ where: { id: venueId, isActive: true }, select: { pricePerDay: true } });
  return venue ? venue.pricePerDay : null;
}

/* ---- Routes ------------------------------------------------------------- */

const availabilityQuery = z.object({
  date: dateStringSchema,
  venueId: idSchema.optional(),
});

router.get("/availability", async (req, res) => {
  const q = parseQuery(availabilityQuery, req, res);
  if (!q) return;
  try {
    const start = new Date(q.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.count({
      where: {
        eventDate: { gte: start, lte: end },
        status: { in: ["CONFIRMED", "IN_PROGRESS", "PENDING"] },
        ...(q.venueId && { venueId: q.venueId }),
      },
    });
    res.json({ available: bookings === 0, bookedCount: bookings });
  } catch (err) {
    sendServerError(res, "bookings.availability", err, "Availability check failed");
  }
});

const calculateSchema = z.object({
  venueId: idSchema.optional(),
  guestCount: guestCountSchema.default(100),
  additionalServices: additionalServicesSchema,
  couponCode: couponCodeSchema,
});

router.post("/calculate", calculateLimiter, async (req, res) => {
  const data = parseBody(calculateSchema, req, res);
  if (!data) return;
  try {
    const venueCost = (await venueCostFor(data.venueId)) ?? 0;
    const services = servicesTotal(data.additionalServices, data.guestCount);
    const subtotal = venueCost + services;

    let discount = 0;
    let couponMessage: string | undefined;
    if (data.couponCode) {
      const check = await checkCoupon(data.couponCode, subtotal);
      if (check.ok) discount = check.discount;
      else couponMessage = check.reason;
    }

    const { gst, total } = calculateGST(subtotal - discount);
    res.json({
      venueCost,
      servicesTotal: services,
      subtotal,
      discount,
      couponApplied: discount > 0,
      ...(couponMessage && { couponMessage }),
      gstAmount: gst,
      totalAmount: total,
    });
  } catch (err) {
    sendServerError(res, "bookings.calculate", err, "Price calculation failed");
  }
});

const bookingSchema = z.object({
  eventType: z.nativeEnum(EventType),
  eventDate: dateStringSchema.refine((v) => new Date(v).getTime() > Date.now(), "Event date must be in the future"),
  venueId: idSchema.optional(),
  guestCount: guestCountSchema,
  budget: z.number().min(0).max(1_000_000_000),
  additionalServices: additionalServicesSchema,
  couponCode: couponCodeSchema,
  notes: longText(2000).optional(),
});

class CouponExhaustedError extends Error {}

router.post("/", authenticate, async (req: AuthRequest, res) => {
  const data = parseBody(bookingSchema, req, res);
  if (!data) return;
  try {
    const venueCost = await venueCostFor(data.venueId);
    if (venueCost === null) return res.status(400).json({ error: "Invalid request", fields: { venueId: ["Venue not found"] } });

    const subtotal = venueCost + servicesTotal(data.additionalServices, data.guestCount);

    let discount = 0;
    let couponId: string | undefined;
    if (data.couponCode) {
      const check = await checkCoupon(data.couponCode, subtotal);
      if (!check.ok) return res.status(400).json({ error: "Invalid request", fields: { couponCode: [check.reason] } });
      discount = check.discount;
      couponId = check.coupon.id;
    }

    const { gst: gstAmount, total: totalAmount } = calculateGST(subtotal - discount);

    const booking = await prisma.$transaction(async (tx) => {
      if (couponId) {
        // Atomic claim: the row-level compare against maxUses means two
        // concurrent bookings cannot both take the last use.
        const claimed = await tx.coupon.updateMany({
          where: {
            id: couponId,
            isActive: true,
            OR: [{ maxUses: null }, { usedCount: { lt: tx.coupon.fields.maxUses } }],
          },
          data: { usedCount: { increment: 1 } },
        });
        if (claimed.count === 0) throw new CouponExhaustedError();
      }

      return tx.booking.create({
        data: {
          bookingNumber: generateBookingNumber(),
          userId: req.user!.id,
          eventType: data.eventType,
          eventDate: new Date(data.eventDate),
          venueId: data.venueId,
          guestCount: data.guestCount,
          budget: data.budget,
          additionalServices: data.additionalServices,
          subtotal,
          gstAmount,
          discount,
          couponCode: couponId ? data.couponCode : undefined,
          totalAmount,
          notes: data.notes,
          timeline: { steps: ["Booking Confirmed", "Planning", "Setup", "Event Day", "Wrap Up"] },
        },
        include: { venue: true },
      });
    });

    res.status(201).json(booking);
  } catch (err) {
    if (err instanceof CouponExhaustedError) {
      return res.status(409).json({ error: "That coupon is no longer available. Remove it and try again." });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      return res.status(400).json({ error: "Invalid request", fields: { venueId: ["Venue not found"] } });
    }
    sendServerError(res, "bookings.create", err, "Booking creation failed");
  }
});

router.get("/my", authenticate, async (req: AuthRequest, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user!.id },
      include: { venue: true, payments: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json(bookings);
  } catch (err) {
    sendServerError(res, "bookings.my", err, "Failed to fetch bookings");
  }
});

const idParams = z.object({ id: idSchema });

router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  const params = idParams.safeParse(req.params);
  if (!params.success) return res.status(404).json({ error: "Booking not found" });
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: params.data.id, userId: req.user!.id },
      include: { venue: true, payments: true, documents: true, messages: true, vendorBookings: { include: { vendor: true } } },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    sendServerError(res, "bookings.get", err, "Failed to fetch booking");
  }
});

export default router;
