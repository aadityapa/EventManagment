import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, city, search, minRating } = req.query;
    const vendors = await prisma.vendor.findMany({
      where: {
        isActive: true,
        ...(category && { category: category as string }),
        ...(city && { city: { contains: city as string, mode: "insensitive" } }),
        ...(minRating && { rating: { gte: Number(minRating) } }),
        ...(search && {
          OR: [
            { businessName: { contains: search as string, mode: "insensitive" } },
            { description: { contains: search as string, mode: "insensitive" } },
          ],
        }),
      },
      include: { user: { select: { name: true, email: true, phone: true } } },
      orderBy: [{ verified: "desc" }, { rating: "desc" }],
    });
    res.json(vendors);
  } catch {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { slug: String(req.params.slug) },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        reviews: { include: { user: { select: { name: true, avatar: true } } }, take: 10 },
      },
    });
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.json(vendor);
  } catch {
    res.status(500).json({ error: "Failed to fetch vendor" });
  }
});

export default router;
