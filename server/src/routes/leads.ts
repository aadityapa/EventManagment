import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";

const router = Router();

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  eventType: z.string().optional(),
  budget: z.number().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
});

router.post("/", async (req, res) => {
  try {
    const data = leadSchema.parse(req.body);
    const lead = await prisma.lead.create({ data: { ...data, eventType: data.eventType as never } });
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
    const lead = await prisma.lead.create({ data: { ...data, eventType: data.eventType as never, status: "NEW" } });
    res.status(201).json({ message: "Consultation request received!", leadId: lead.id });
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: "Failed to submit consultation request" });
  }
});

export default router;
