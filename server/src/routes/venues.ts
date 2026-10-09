import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { idSchema, parseBody, parseQuery, queryNumber, sendServerError, shortText } from "../lib/http";

const router = Router();

const listQuery = z.object({
  city: shortText(60).optional(),
  minCapacity: queryNumber(1, 1_000_000).optional(),
  maxPrice: queryNumber(0, 1_000_000_000).optional(),
  search: shortText(100).optional(),
});

router.get("/", async (req, res) => {
  const q = parseQuery(listQuery, req, res);
  if (!q) return;
  try {
    const venues = await prisma.venue.findMany({
      where: {
        isActive: true,
        ...(q.city && { city: { contains: q.city, mode: "insensitive" } }),
        ...(q.minCapacity !== undefined && { capacity: { gte: q.minCapacity } }),
        ...(q.maxPrice !== undefined && { pricePerDay: { lte: q.maxPrice } }),
        ...(q.search && {
          OR: [
            { name: { contains: q.search, mode: "insensitive" } },
            { city: { contains: q.search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: [{ featured: "desc" }, { rating: "desc" }],
      take: 200,
    });
    res.json(venues);
  } catch (err) {
    sendServerError(res, "venues.list", err, "Failed to fetch venues");
  }
});

const compareSchema = z.object({ ids: z.array(idSchema).min(1).max(10) });

// Declared before "/:slug" so the literal path wins.
router.post("/compare", async (req, res) => {
  const data = parseBody(compareSchema, req, res);
  if (!data) return;
  try {
    const venues = await prisma.venue.findMany({ where: { id: { in: data.ids }, isActive: true } });
    res.json(venues);
  } catch (err) {
    sendServerError(res, "venues.compare", err, "Comparison failed");
  }
});

const slugParams = z.object({ slug: z.string().trim().min(1).max(120) });

router.get("/:slug", async (req, res) => {
  const params = slugParams.safeParse(req.params);
  if (!params.success) return res.status(404).json({ error: "Venue not found" });
  try {
    const venue = await prisma.venue.findUnique({
      where: { slug: params.data.slug, isActive: true },
      include: {
        reviews: {
          select: { id: true, rating: true, comment: true, createdAt: true, user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
    if (!venue) return res.status(404).json({ error: "Venue not found" });
    res.json(venue);
  } catch (err) {
    sendServerError(res, "venues.get", err, "Failed to fetch venue");
  }
});

export default router;
