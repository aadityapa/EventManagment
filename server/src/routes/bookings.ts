import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest, calculateGST, generateBookingNumber } from "../middleware/auth";

const router = Router();

const bookingSchema = z.object({
  eventType: z.string(),
  eventDate: z.string(),
  venueId: z.string().optional(),
  guestCount: z.number().min(1),
  budget: z.number().min(0),
  additionalServices: z.array(z.string()).default([]),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

router.get("/availability", async (req, res) => {
  try {
    const { date, venueId } = req.query;
    if (!date) return res.status(400).json({ error: "Date required" });

    const eventDate = new Date(date as string);
    const where: Record<string, unknown> = {
      eventDate: { gte: new Date(eventDate.setHours(0, 0, 0, 0)), lte: new Date(eventDate.setHours(23, 59, 59, 999)) },
      status: { in: ["CONFIRMED", "IN_PROGRESS", "PENDING"] },
    };
    if (venueId) where.venueId = venueId;

    const bookings = await prisma.booking.count({ where });
    res.json({ available: bookings === 0, bookedCount: bookings });
  } catch {
    res.status(500).json({ error: "Availability check failed" });
  }
});

router.post("/calculate", async (req, res) => {
  try {
    const { budget, guestCount, additionalServices = [], couponCode } = req.body;
    let subtotal = budget || guestCount * 500;
    additionalServices.forEach((service: string) => {
      const prices: Record<string, number> = {
        photography: 50000, videography: 75000, decoration: 100000,
        catering: guestCount * 800, dj: 30000, live_band: 150000,
        makeup: 25000, transport: 20000, security: 15000,
      };
      subtotal += prices[service] || 10000;
    });

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode, isActive: true } });
      if (coupon) {
        discount = coupon.discountType === "percentage"
          ? subtotal * (coupon.discountValue / 100)
          : coupon.discountValue;
      }
    }

    const afterDiscount = subtotal - discount;
    const { gst, total } = calculateGST(afterDiscount);
    res.json({ subtotal, discount, gstAmount: gst, totalAmount: total });
  } catch {
    res.status(500).json({ error: "Price calculation failed" });
  }
});

router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const data = bookingSchema.parse(req.body);
    let subtotal = data.budget;
    data.additionalServices.forEach((service: string) => {
      const prices: Record<string, number> = {
        photography: 50000, videography: 75000, decoration: 100000,
        catering: data.guestCount * 800, dj: 30000, live_band: 150000,
        makeup: 25000, transport: 20000, security: 15000,
      };
      subtotal += prices[service] || 10000;
    });

    let discount = 0;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode, isActive: true } });
      if (coupon) {
        discount = coupon.discountType === "percentage"
          ? subtotal * (coupon.discountValue / 100)
          : coupon.discountValue;
      }
    }

    const afterDiscount = subtotal - discount;
    const { gst: gstAmount, total: totalAmount } = calculateGST(afterDiscount);

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        userId: req.user!.id,
        eventType: data.eventType as never,
        eventDate: new Date(data.eventDate),
        venueId: data.venueId,
        guestCount: data.guestCount,
        budget: data.budget,
        additionalServices: data.additionalServices,
        subtotal,
        gstAmount,
        discount,
        couponCode: data.couponCode,
        totalAmount,
        notes: data.notes,
        timeline: { steps: ["Booking Confirmed", "Planning", "Setup", "Event Day", "Wrap Up"] },
      },
      include: { venue: true },
    });

    res.status(201).json(booking);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Booking creation failed" });
  }
});

router.get("/my", authenticate, async (req: AuthRequest, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user!.id },
      include: { venue: true, payments: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(bookings);
  } catch {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: String(req.params.id), userId: req.user!.id },
      include: { venue: true, payments: true, documents: true, messages: true, vendorBookings: { include: { vendor: true } } },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch {
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

export default router;
