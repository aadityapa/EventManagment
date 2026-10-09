import { Router } from "express";
import prisma from "../lib/prisma";
import { sendServerError } from "../lib/http";

const router = Router();

/* Read-only content endpoints. None take input, so there is nothing to
   validate; every handler still hides the underlying error from clients. */

router.get("/company", async (_req, res) => {
  try {
    // No silent auto-create: the old fallback invented a founding year and
    // track record. An empty profile is an honest 404 until an admin writes one.
    const profile = await prisma.companyProfile.findFirst();
    if (!profile) return res.status(404).json({ error: "Company profile not set" });
    res.json(profile);
  } catch (err) {
    sendServerError(res, "cms.company", err, "Failed to fetch company profile");
  }
});

router.get("/team", async (_req, res) => {
  try {
    const team = await prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
    res.json(team);
  } catch (err) {
    sendServerError(res, "cms.team", err, "Failed to fetch team");
  }
});

router.get("/testimonials", async (_req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
    res.json(testimonials);
  } catch (err) {
    sendServerError(res, "cms.testimonials", err, "Failed to fetch testimonials");
  }
});

router.get("/services", async (_req, res) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
    res.json(services);
  } catch (err) {
    sendServerError(res, "cms.services", err, "Failed to fetch services");
  }
});

router.get("/portfolio", async (_req, res) => {
  try {
    const portfolio = await prisma.portfolioItem.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    res.json(portfolio);
  } catch (err) {
    sendServerError(res, "cms.portfolio", err, "Failed to fetch portfolio");
  }
});

router.get("/awards", async (_req, res) => {
  try {
    const awards = await prisma.award.findMany({ orderBy: { year: "desc" } });
    res.json(awards);
  } catch (err) {
    sendServerError(res, "cms.awards", err, "Failed to fetch awards");
  }
});

router.get("/partners", async (_req, res) => {
  try {
    const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
    res.json(partners);
  } catch (err) {
    sendServerError(res, "cms.partners", err, "Failed to fetch partners");
  }
});

router.get("/faqs", async (_req, res) => {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
    res.json(faqs);
  } catch (err) {
    sendServerError(res, "cms.faqs", err, "Failed to fetch FAQs");
  }
});

router.get("/blog", async (_req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 100 });
    res.json(posts);
  } catch (err) {
    sendServerError(res, "cms.blog", err, "Failed to fetch blog posts");
  }
});

export default router;
