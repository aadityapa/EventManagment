import { Router } from "express";
import { z } from "zod";
import { EventType, type Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { emailSchema, longText, parseBody, phoneSchema, sendServerError, shortText } from "../lib/http";

const router = Router();

/* Extra keys (utm tags, page, guest count…) are kept in `metadata`, but each
   must be a small scalar so a form cannot stuff megabytes into the JSON column. */
const metadataValue = z.union([z.string().max(500), z.number(), z.boolean()]);

const leadSchema = z
  .object({
    name: shortText(120).min(2),
    email: emailSchema,
    phone: phoneSchema.optional(),
    eventType: z.string().trim().max(60).optional(),
    budget: z.number().min(0).max(1_000_000_000).optional(),
    message: longText(5000).optional(),
    source: z.string().trim().max(60).optional(),
  })
  .catchall(metadataValue)
  .refine((v) => Object.keys(v).length <= 30, { message: "Too many fields" });

const EVENT_TYPE_ENUM = new Set<string>(Object.values(EventType));

function normalizeEventType(input?: string): EventType | undefined {
  if (!input) return undefined;
  const raw = input.trim();
  if (!raw) return undefined;

  const upper = raw.toUpperCase().replace(/[\s-]+/g, "_");
  if (EVENT_TYPE_ENUM.has(upper)) return upper as EventType;

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

async function createLead(data: z.infer<typeof leadSchema>, fallbackSource: string) {
  const { name, email, phone, eventType, budget, message, source, ...rest } = data;
  return prisma.lead.create({
    data: {
      name,
      email,
      phone,
      eventType: normalizeEventType(eventType),
      budget,
      message,
      source: source || fallbackSource,
      status: "NEW",
      metadata: Object.keys(rest).length ? (rest as Prisma.InputJsonValue) : undefined,
    },
    select: { id: true },
  });
}

router.post("/", async (req, res) => {
  const data = parseBody(leadSchema, req, res);
  if (!data) return;
  try {
    const lead = await createLead(data, "website");
    res.status(201).json({ message: "Thank you! A planner will reply within the same day (9am–9pm IST).", leadId: lead.id });
  } catch (err) {
    sendServerError(res, "leads.create", err, "Failed to submit your enquiry");
  }
});

const newsletterSchema = z.object({ email: emailSchema });

router.post("/newsletter", async (req, res) => {
  const data = parseBody(newsletterSchema, req, res);
  if (!data) return;
  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: data.email },
      create: { email: data.email },
      update: { active: true },
    });
    res.json({ message: "Successfully subscribed!" });
  } catch (err) {
    sendServerError(res, "leads.newsletter", err, "Subscription failed");
  }
});

router.post("/consultation", async (req, res) => {
  const data = parseBody(leadSchema, req, res);
  if (!data) return;
  try {
    const lead = await createLead({ ...data, source: "consultation_form" }, "consultation_form");
    res.status(201).json({ message: "Consultation request received!", leadId: lead.id });
  } catch (err) {
    sendServerError(res, "leads.consultation", err, "Failed to submit consultation request");
  }
});

export default router;
