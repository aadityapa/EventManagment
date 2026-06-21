import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/company", async (_req, res) => {
  try {
    let profile = await prisma.companyProfile.findFirst();
    if (!profile) {
      profile = await prisma.companyProfile.create({
        data: {
          introduction: "Nexyyra Events is a premier international event management company.",
          vision: "To redefine luxury event experiences worldwide.",
          mission: "Creating unforgettable moments through exceptional planning and execution.",
          story: "Founded in 2010, Nexyyra Events has grown to become a trusted name in premium event management.",
        },
      });
    }
    res.json(profile);
  } catch {
    res.status(500).json({ error: "Failed to fetch company profile" });
  }
});

router.get("/team", async (_req, res) => {
  try {
    const team = await prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
    res.json(team);
  } catch {
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

router.get("/testimonials", async (_req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
    res.json(testimonials);
  } catch {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

router.get("/services", async (_req, res) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
    res.json(services);
  } catch {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

router.get("/portfolio", async (_req, res) => {
  try {
    const portfolio = await prisma.portfolioItem.findMany({ orderBy: { createdAt: "desc" } });
    res.json(portfolio);
  } catch {
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});

router.get("/awards", async (_req, res) => {
  try {
    const awards = await prisma.award.findMany({ orderBy: { year: "desc" } });
    res.json(awards);
  } catch {
    res.status(500).json({ error: "Failed to fetch awards" });
  }
});

router.get("/partners", async (_req, res) => {
  try {
    const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
    res.json(partners);
  } catch {
    res.status(500).json({ error: "Failed to fetch partners" });
  }
});

router.get("/faqs", async (_req, res) => {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
    res.json(faqs);
  } catch {
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

router.get("/blog", async (_req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
    res.json(posts);
  } catch {
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

export default router;
