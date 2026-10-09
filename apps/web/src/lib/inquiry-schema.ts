import { z } from "zod";
import { EVENT_TYPES } from "@/lib/constants";
import { INQUIRY_LIMITS, INQUIRY_SOURCES, PHONE_ERROR, isValidPhone } from "@/lib/inquiry";

/**
 * Server-side validation for /api/inquiry. Mirrors the Inquiry type in lib/inquiry.ts.
 *
 * Every check carries its own visitor-facing message: zod's defaults ("Invalid
 * input: expected string…") must never reach the form. The max lengths match
 * the `maxLength` attributes in InquiryForm, so a visitor is stopped while
 * typing rather than by a 400.
 */
const eventTypeIds = EVENT_TYPES.map((t) => t.id) as [string, ...string[]];

const CHECK = "Please check this field.";
const tooLong = (max: number) => `Please keep this under ${max.toLocaleString("en-IN")} characters.`;

const optionalText = (max: number) =>
  z
    .string({ error: CHECK })
    .trim()
    .max(max, tooLong(max))
    .optional()
    .transform((v) => (v ? v : undefined));

export const inquirySchema = z
  .object({
    name: z
      .string({ error: "Please enter your name." })
      .trim()
      .min(2, "Please enter your name.")
      .max(INQUIRY_LIMITS.name, tooLong(INQUIRY_LIMITS.name)),
    phone: z.string({ error: PHONE_ERROR }).trim().max(24, PHONE_ERROR).refine(isValidPhone, PHONE_ERROR),
    email: z
      .string({ error: "Please enter a valid email address." })
      .trim()
      .max(INQUIRY_LIMITS.email, tooLong(INQUIRY_LIMITS.email))
      .optional()
      .transform((v) => (v ? v : undefined))
      .pipe(z.email("Please enter a valid email address.").optional()),
    eventType: z.enum(eventTypeIds, { error: "Please choose an event type from the list." }).optional(),
    eventDate: optionalText(INQUIRY_LIMITS.eventDate),
    city: optionalText(INQUIRY_LIMITS.city),
    guests: optionalText(INQUIRY_LIMITS.guests),
    budget: optionalText(INQUIRY_LIMITS.budget),
    message: optionalText(INQUIRY_LIMITS.message),
    collection: optionalText(INQUIRY_LIMITS.collection),
    source: z.enum(INQUIRY_SOURCES, { error: "Unknown form." }).default("contact"),
    // Context only (the page path) — trimmed rather than rejected: the visitor cannot fix it.
    page: z
      .string({ error: CHECK })
      .optional()
      .transform((v) => v?.trim().slice(0, 200) || undefined),
    /** Honeypot — real visitors never see or fill this field. */
    company_website: z.string({ error: CHECK }).max(500).optional(),
  })
  .strict();
