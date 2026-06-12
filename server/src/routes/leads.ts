import { Router } from "express";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

const router = Router();

const leadSchema = z
  .object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  eventType: z.string().optional(),
  budget: z.number().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
})
  .passthrough();

const EVENT_TYPE_ENUM = new Set([
  "CORPORATE",
  "WEDDING",
  "DESTINATION_WEDDING",
  "BIRTHDAY",
  "PRODUCT_LAUNCH",
  "CONFERENCE",
  "EXHIBITION",
  "CONCERT",
  "CELEBRITY",
  "BRAND_PROMOTION",
  "FASHION_SHOW",
  "MUSIC_FESTIVAL",
  "AWARD_FUNCTION",
  "OTHER",
]);

function normalizeEventType(input?: string): string | undefined {
  if (!input) return undefined;
  const raw = input.trim();
  if (!raw) return undefined;

  const upper = raw.toUpperCase().replace(/[\s-]+/g, "_");
  if (EVENT_TYPE_ENUM.has(upper)) return upper;

  const lower = raw.toLowerCase();
  if (lower.includes("destination")) return "DESTINATION_WEDDING";
  if (lower.includes("wedding")) return "WEDDING";
  if (lower.includes("corporate")) return "CORPORATE";
  if (lower.includes("birthday")) return "BIRTHDAY";
  if (lower.includes("product")) return "PRODUCT_LAUNCH";
  if (lower.includes("conference")) return "CONFERENCE";
  if (lower.includes("exhibition")) return "EXHIBITION";
  if (lower.includes("concert")) return "CONCERT";
  if (lower.includes("celebrity")) return "CELEBRITY";
  if (lower.includes("brand")) return "BRAND_PROMOTION";
  if (lower.includes("fashion")) return "FASHION_SHOW";
  if (lower.includes("award")) return "AWARD_FUNCTION";

  return "OTHER";
}

router.post("/", async (req, res) => {
  try {
    const data = leadSchema.parse(req.body);
    const { name, email, phone, eventType, budget, message, source, ...rest } = data;
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        eventType: normalizeEventType(eventType) as never,
        budget,
        message,
        source,
        metadata: Object.keys(rest).length ? (rest as Prisma.InputJsonValue) : undefined,
      },
    });
    res.status(201).json({ message: "Thank you! We'll contact you within 24 hours.", leadId: lead.id });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Failed to submit lead" });
  }
});

router.post("/newsletter", async (req, res) => {
  try {
    const { email } = req.body;
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: { active: true },
    });
    res.json({ message: "Successfully subscribed!" });
  } catch {
    res.status(500).json({ error: "Subscription failed" });
  }
});

router.post("/consultation", async (req, res) => {
  try {
    const data = leadSchema.parse({ ...req.body, source: "consultation_form" });
    const { name, email, phone, eventType, budget, message, source, ...rest } = data;
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        eventType: normalizeEventType(eventType) as never,
        budget,
        message,
        source,
        status: "NEW",
        metadata: Object.keys(rest).length ? (rest as Prisma.InputJsonValue) : undefined,
      },
    });
    res.status(201).json({ message: "Consultation request received!", leadId: lead.id });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Failed to submit consultation request" });
  }
});

export default router;
