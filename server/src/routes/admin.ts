import { Router } from "express";
import prisma from "../lib/prisma";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.use(requireRole("ADMIN", "STAFF"));

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
  } catch {
    res.status(500).json({ error: "Dashboard fetch failed" });
  }
});

router.get("/bookings", async (_req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { user: { select: { name: true, email: true } }, venue: true, payments: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(bookings);
  } catch {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.get("/leads", async (_req, res) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    res.json(leads);
  } catch {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

router.patch("/leads/:id", async (req: AuthRequest, res) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json(lead);
  } catch {
    res.status(500).json({ error: "Failed to update lead" });
  }
});

router.get("/customers", async (_req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "CLIENT" },
      include: { _count: { select: { bookings: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(customers);
  } catch {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

export default router;
