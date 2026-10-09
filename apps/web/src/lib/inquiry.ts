import { EVENT_TYPES, SITE_CONFIG } from "@/lib/constants";

/**
 * Event inquiry — shared between the client forms and /api/inquiry.
 *
 * Client-safe (no zod) — the validation schema lives in lib/inquiry-schema.ts
 * so it stays out of the browser bundle.
 *
 * Every lead form on the site (homepage, contact, book-event, callback,
 * footer) posts this shape. The server never pretends a lead was saved: if no
 * delivery channel accepted it, the client offers a prefilled WhatsApp
 * hand-off instead of a fake "message sent" toast.
 */

export const INQUIRY_SOURCES = ["home", "contact", "book_event", "callback", "service", "footer"] as const;

export const BUDGET_RANGES = [
  "Under ₹10 Lakhs",
  "₹10 – 35 Lakhs",
  "₹35 Lakhs – 1 Crore",
  "₹1 Crore+",
  "Not sure yet",
] as const;

/**
 * Guest bands line up with the collections (BRAND_INVESTMENTS: 50–150,
 * 150–500, 500+) so a visitor arriving from a collection finds its band, and
 * the strings match `collectionGuests()` exactly so /book-event can preselect
 * it. Kept literal here because content.ts must stay out of the client bundle.
 */
export const GUEST_RANGES = ["Under 50", "50–150", "150–500", "500+"] as const;

/** Shape posted by the forms — validated server-side in lib/inquiry-schema.ts. */
export type Inquiry = {
  name: string;
  phone: string;
  email?: string;
  eventType?: string;
  eventDate?: string;
  city?: string;
  guests?: string;
  budget?: string;
  message?: string;
  /** The collection chosen on /pricing (`/book-event?collection=`), by name. */
  collection?: string;
  source: (typeof INQUIRY_SOURCES)[number];
  page?: string;
  company_website?: string;
};

export type InquiryInput = Omit<Inquiry, "source"> & { source?: Inquiry["source"] };

export type InquiryFieldErrors = Partial<Record<keyof Inquiry, string>>;

/** Text-field caps — shared by the schema and the inputs' `maxLength`. */
export const INQUIRY_LIMITS = {
  name: 80,
  email: 120,
  eventDate: 80,
  city: 80,
  guests: 30,
  budget: 40,
  message: 2000,
  collection: 80,
} as const;

export const PHONE_ERROR = "Please enter a 10-digit mobile number, or an international number starting with +.";

/**
 * Shared by the form and /api/inquiry. Accepts an Indian number — 10 digits,
 * optionally prefixed +91, 91 or 0 — or an international number written with
 * a leading + (8–15 digits, E.164). Spaces, dashes, dots and brackets are
 * ignored. Obvious placeholders (one digit repeated, 1234567890) fail.
 */
export function isValidPhone(raw: string): boolean {
  const value = raw.trim();
  if (!/^\+?[\d\s().-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  const international = value.startsWith("+");
  let national: string;
  if (international && !digits.startsWith("91")) {
    if (digits.length < 8 || digits.length > 15) return false;
    national = digits;
  } else {
    const match = digits.match(/^(?:91|0)?(\d{10})$/);
    if (!match) return false;
    national = match[1];
  }
  if (/^(\d)\1+$/.test(national)) return false;
  return !["1234567890", "0123456789", "9876543210"].includes(national);
}

/** Service page slug → inquiry event type, so forms arrive pre-selected. */
export const SERVICE_EVENT_TYPE: Record<string, string> = {
  "wedding-planning": "WEDDING",
  "destination-weddings": "DESTINATION_WEDDING",
  "corporate-events": "CORPORATE",
  "celebrity-management": "CELEBRITY",
  "birthday-events": "BIRTHDAY",
  "product-launches": "PRODUCT_LAUNCH",
  conferences: "CONFERENCE",
  exhibitions: "EXHIBITION",
  "brand-promotions": "BRAND_PROMOTION",
  "concert-management": "CONCERT",
  "fashion-shows": "FASHION_SHOW",
  "event-production": "EVENT_PRODUCTION",
};

export function eventTypeLabel(id?: string) {
  return EVENT_TYPES.find((t) => t.id === id)?.label ?? id;
}

/** Human-readable summary — used for the email body and the WhatsApp hand-off. */
export function inquirySummary(inquiry: Partial<Inquiry>): string {
  const lines = [
    ["Name", inquiry.name],
    ["Phone", inquiry.phone],
    ["Email", inquiry.email],
    ["Event", eventTypeLabel(inquiry.eventType)],
    ["Collection", inquiry.collection],
    ["Date", inquiry.eventDate],
    ["City / venue", inquiry.city],
    ["Guests", inquiry.guests],
    ["Budget", inquiry.budget],
    ["Details", inquiry.message],
  ] as const;
  return lines
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

export function inquiryWhatsAppUrl(inquiry: Partial<Inquiry>): string {
  const text = `Hello ${SITE_CONFIG.shortName}, I'd like to plan an event.\n\n${inquirySummary(inquiry)}`;
  return `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export type InquiryResponse =
  | { ok: true; reference: string }
  | { ok: false; error: string; fieldErrors?: InquiryFieldErrors; fallback?: "whatsapp" };
