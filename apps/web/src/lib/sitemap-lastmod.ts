import { ENTITY_FACTS } from "./constants";

/** Per-URL lastmod from content updatedAt — not build clock */
const CONTENT_DATE = ENTITY_FACTS.lastUpdated;
const LEGAL_DATE = "2025-06-01";

const STATIC_LASTMOD: Record<string, string> = {
  "/": CONTENT_DATE,
  "/about": "2026-03-01",
  "/services": CONTENT_DATE,
  "/portfolio": CONTENT_DATE,
  "/venues": "2026-02-15",
  "/vendors": "2026-02-15",
  "/gallery": CONTENT_DATE,
  "/testimonials": "2026-01-20",
  "/pricing": "2026-04-01",
  "/blog": CONTENT_DATE,
  "/faqs": "2026-05-01",
  "/contact": CONTENT_DATE,
  "/book-event": CONTENT_DATE,
  "/ai": CONTENT_DATE,
  "/privacy": LEGAL_DATE,
  "/terms": LEGAL_DATE,
  "/refund": LEGAL_DATE,
};

const LOCAL_LASTMOD: Record<string, string> = {
  "event-management-company-pune": CONTENT_DATE,
  "wedding-planner-pune": CONTENT_DATE,
  "corporate-event-management-pune": "2026-04-15",
  "luxury-wedding-planner-maharashtra": CONTENT_DATE,
  "exhibition-management-pune": "2026-03-20",
  "destination-wedding-planner-pune": CONTENT_DATE,
};

const SERVICE_LASTMOD: Record<string, string> = {
  "wedding-planning": CONTENT_DATE,
  "destination-weddings": CONTENT_DATE,
  "corporate-events": "2026-04-15",
  "birthday-events": "2026-02-01",
  "product-launches": "2026-03-01",
  "conferences": "2026-03-01",
  "exhibitions": "2026-03-20",
  "concert-management": "2026-02-01",
  "celebrity-management": "2026-01-15",
  "brand-promotions": "2026-02-15",
  "fashion-shows": "2026-01-25",
  "event-production": "2026-02-01",
};

export type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

function toDate(iso: string): Date {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date(CONTENT_DATE) : d;
}

export function staticPageLastMod(pathname: string): Date {
  const key = pathname || "/";
  return toDate(STATIC_LASTMOD[key] ?? CONTENT_DATE);
}

export function localPageLastMod(slug: string): Date {
  return toDate(LOCAL_LASTMOD[slug] ?? CONTENT_DATE);
}

export function servicePageLastMod(slug: string): Date {
  return toDate(SERVICE_LASTMOD[slug] ?? CONTENT_DATE);
}

export function portfolioCaseLastMod(_id: string): Date {
  return toDate("2026-01-10");
}

export function blogPostLastMod(publishedAt: string): Date {
  return toDate(publishedAt);
}

export function staticPageChangeFreq(pathname: string): ChangeFrequency {
  if (["/privacy", "/terms", "/refund"].includes(pathname)) return "yearly";
  if (pathname === "" || pathname === "/") return "weekly";
  if (["/blog", "/gallery", "/portfolio"].includes(pathname)) return "weekly";
  return "monthly";
}
