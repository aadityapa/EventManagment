import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { parseQuery, queryNumber, sendServerError, shortText } from "../lib/http";

const router = Router();

/* Vendors are real people with accounts. Their contact details stay private;
   enquiries go through Nexyyra, never direct from the public listing. */
const PUBLIC_VENDOR_SELECT = {
  id: true,
  businessName: true,
  slug: true,
  category: true,
  description: true,
  city: true,
  images: true,
  priceRange: true,
  rating: true,
  reviewCount: true,
  verified: true,
  createdAt: true,
} as const;

const listQuery = z.object({
  category: shortText(60).optional(),
  city: shortText(60).optional(),
  search: shortText(100).optional(),
  minRating: queryNumber(0, 5).optional(),
});

router.get("/", async (req, res) => {
  const q = parseQuery(listQuery, req, res);
  if (!q) return;
  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        isActive: true,
        ...(q.category && { category: q.category }),
        ...(q.city && { city: { contains: q.city, mode: "insensitive" } }),
        ...(q.minRating !== undefined && { rating: { gte: q.minRating } }),
        ...(q.search && {
          OR: [
            { businessName: { contains: q.search, mode: "insensitive" } },
            { description: { contains: q.search, mode: "insensitive" } },
          ],
        }),
      },
      select: PUBLIC_VENDOR_SELECT,
      orderBy: [{ verified: "desc" }, { rating: "desc" }],
      take: 200,
    });
    res.json(vendors);
  } catch (err) {
    sendServerError(res, "vendors.list", err, "Failed to fetch vendors");
  }
});

const slugParams = z.object({ slug: z.string().trim().min(1).max(120) });

router.get("/:slug", async (req, res) => {
  const params = slugParams.safeParse(req.params);
  if (!params.success) return res.status(404).json({ error: "Vendor not found" });
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { slug: params.data.slug, isActive: true },
      select: {
        ...PUBLIC_VENDOR_SELECT,
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: { select: { name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    sendServerError(res, "vendors.get", err, "Failed to fetch vendor");
  }
});

export default router;
