import { Router } from "express";
import { z } from "zod";
import { BookingStatus, LeadStatus, PaymentStatus, Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { idSchema, parseBody, parseQuery, sendServerError } from "../lib/http";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.use(requireRole("ADMIN", "STAFF"));

const pageQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

const idParams = z.object({ id: idSchema });

router.get("/dashboard", async (_req, res) => {
  try {
    const [totalBookings, totalRevenue, totalLeads, totalClients, recentBookings, recentLeads] = await Promise.all([
      prisma.booking.count(),
      prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.booking.findMany({ take: 10, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } } } }),
      prisma.lead.findMany({ take: 10, orderBy: { createdAt: "desc" } }),
    ]);

    res.json({
      stats: {
        totalBookings,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalLeads,
        totalClients,
      },
      recentBookings,
      recentLeads,
    });
  } catch (err) {
    sendServerError(res, "admin.dashboard", err, "Dashboard fetch failed");
  }
});

router.get("/bookings", async (req, res) => {
  const q = parseQuery(pageQuery, req, res);
  if (!q) return;
  try {
    const bookings = await prisma.booking.findMany({
      include: { user: { select: { name: true, email: true } }, venue: true, payments: true },
      orderBy: { createdAt: "desc" },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    });
    res.json(bookings);
  } catch (err) {
    sendServerError(res, "admin.bookings", err, "Failed to fetch bookings");
  }
});

/* Status writes are checked against the Prisma enums so a typo or a crafted
   value can never reach the database (Prisma would throw a 500 otherwise). */
const bookingPatchSchema = z
  .object({
    status: z.nativeEnum(BookingStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  })
  .refine((v) => v.status || v.paymentStatus, { message: "Nothing to update", path: ["status"] });

router.patch("/bookings/:id", async (req, res) => {
  const params = idParams.safeParse(req.params);
  if (!params.success) return res.status(404).json({ error: "Booking not found" });
  const data = parseBody(bookingPatchSchema, req, res);
  if (!data) return;
  try {
    const booking = await prisma.booking.update({
      where: { id: params.data.id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.paymentStatus && { paymentStatus: data.paymentStatus }),
      },
    });
    res.json(booking);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ error: "Booking not found" });
    }
    sendServerError(res, "admin.bookings.patch", err, "Failed to update booking");
  }
});

router.get("/leads", async (req, res) => {
  const q = parseQuery(pageQuery, req, res);
  if (!q) return;
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    });
    res.json(leads);
  } catch (err) {
    sendServerError(res, "admin.leads", err, "Failed to fetch leads");
  }
});

const leadPatchSchema = z.object({ status: z.nativeEnum(LeadStatus) });

router.patch("/leads/:id", async (req, res) => {
  const params = idParams.safeParse(req.params);
  if (!params.success) return res.status(404).json({ error: "Lead not found" });
  const data = parseBody(leadPatchSchema, req, res);
  if (!data) return;
  try {
    const lead = await prisma.lead.update({
      where: { id: params.data.id },
      data: { status: data.status },
    });
    res.json(lead);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ error: "Lead not found" });
    }
    sendServerError(res, "admin.leads.patch", err, "Failed to update lead");
  }
});

router.get("/customers", async (req, res) => {
  const q = parseQuery(pageQuery, req, res);
  if (!q) return;
  try {
    const customers = await prisma.user.findMany({
      where: { role: "CLIENT" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        loyaltyPoints: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    });
    res.json(customers);
  } catch (err) {
    sendServerError(res, "admin.customers", err, "Failed to fetch customers");
  }
});

export default router;
