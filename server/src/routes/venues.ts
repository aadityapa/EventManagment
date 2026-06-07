import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { city, minCapacity, maxPrice, search } = req.query;
    const venues = await prisma.venue.findMany({
      where: {
        isActive: true,
        ...(city && { city: { contains: city as string, mode: "insensitive" } }),
        ...(minCapacity && { capacity: { gte: Number(minCapacity) } }),
        ...(maxPrice && { pricePerDay: { lte: Number(maxPrice) } }),
        ...(search && {
          OR: [
            { name: { contains: search as string, mode: "insensitive" } },
            { city: { contains: search as string, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: [{ featured: "desc" }, { rating: "desc" }],
    });
    res.json(venues);
  } catch {
    res.status(500).json({ error: "Failed to fetch venues" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const venue = await prisma.venue.findUnique({
      where: { slug: req.params.slug },
      include: { reviews: { include: { user: { select: { name: true, avatar: true } } }, take: 10 } },
    });
    if (!venue) return res.status(404).json({ error: "Venue not found" });
    res.json(venue);
  } catch {
    res.status(500).json({ error: "Failed to fetch venue" });
  }
});

router.post("/compare", async (req, res) => {
  try {
    const { ids } = req.body;
    const venues = await prisma.venue.findMany({ where: { id: { in: ids } } });
    res.json(venues);
  } catch {
    res.status(500).json({ error: "Comparison failed" });
  }
});

export default router;
