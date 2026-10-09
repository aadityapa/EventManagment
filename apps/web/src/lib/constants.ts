import { SITE_URL } from "./site-url";

export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || "Nexyyra Events and Promotions Private Limited",
  legalName: process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME || "Nexyyra Events and Promotions Private Limited",
  cin: process.env.NEXT_PUBLIC_COMPANY_CIN || "U70200ME2026PTC476014",
  /** Short trade name — used where the full legal name would not fit (nav, chips). */
  shortName: "Nexyyra Events",
  tagline: "Creating Experiences That Last Forever",
  /** Default meta description and schema description — one full sentence, ≤ 160 characters. */
  description:
    "Nexyyra Events plans and produces weddings, corporate events, celebrations and destination events across India, with one event director from start to finish.",
  url: SITE_URL,
  // Hard-coded on purpose — env overrides (e.g. a stale Vercel dashboard var)
  // must never resurrect an old number. Update HERE to change it site-wide.
  phone: "+91 7020640157",
  whatsapp: "+917020640157",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "Info.Events@nexyyra.com",
  address:
    "Nexyyra Events and Promotions Private Limited, Aaditya Seva Sadan, Hiwarkhed–Telhara Rd, Gajanan Nagar, Telhara, Maharashtra 444108",
  streetAddress: "Aaditya Seva Sadan, Hiwarkhed–Telhara Rd, Gajanan Nagar",
  city: "Telhara",
  region: "Maharashtra",
  postalCode: "444108",
  /** Delivery & coordination office. */
  branchOffice: "Delivery & Coordination Office — Pune, Maharashtra, India",
  /* Only profiles verified to exist — they feed Organization `sameAs`.
     Add a network here only once its official page is live. */
  social: {
    instagram: "https://www.instagram.com/nexyyra/",
  },
};

/** Single source of truth for entity facts — SEO, GEO, AEO, llms.txt */
export const ENTITY_FACTS = {
  /* foundingYear / eventsManaged / happyClients / citiesCovered / teamSize
     removed (Phase-2): no verified source. Only the 2026 incorporation
     (CIN) is documented. Restore with audited figures only. */
  languages: ["English", "Hindi", "Marathi"],
  serviceAreas: ["Pune", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Jaipur", "Indore", "Nashik", "Nagpur", "Ahmedabad", "Surat", "Goa", "Udaipur", "Maharashtra", "India", "International destinations"],
  /* awards removed (Phase-2) — no public proof URLs; restore with citations.
     knowsAbout and the meta keywords are built in lib/seo.ts from the twelve
     `services` in data/cms.ts, so they never drift from the services shown. */
  priceRange: "₹2 Lakhs (single services) to ₹1 Crore+ (collections)",
  consultation: "Complimentary, no obligation — in person, video, or at venue",
  bookingAdvance: "30% advance secures your date",
  responseTime: "Tailored proposal within 48 hours of consultation",
  lastUpdated: "2026-08-06",
} as const;

/**
 * Inquiry / calculator event types: one per service in src/data/cms.ts (labels
 * are the service titles) plus a catch-all. Ids are Prisma `EventType` values
 * so leads reach the Express API unchanged — except EVENT_PRODUCTION, which has
 * no enum value and is sent to the API as OTHER (see /api/inquiry).
 */
export const EVENT_TYPES = [
  { id: "WEDDING", label: "Wedding Planning", icon: "Heart" },
  { id: "DESTINATION_WEDDING", label: "Destination Weddings", icon: "Plane" },
  { id: "CORPORATE", label: "Corporate Events", icon: "Building2" },
  { id: "CELEBRITY", label: "Celebrity Management", icon: "Star" },
  { id: "BIRTHDAY", label: "Birthday Events", icon: "Cake" },
  { id: "CONFERENCE", label: "Conferences", icon: "Presentation" },
  { id: "FASHION_SHOW", label: "Fashion Shows", icon: "Shirt" },
  { id: "CONCERT", label: "Concert Management", icon: "Music" },
  { id: "EXHIBITION", label: "Exhibitions", icon: "LayoutGrid" },
  { id: "BRAND_PROMOTION", label: "Brand Promotions", icon: "Megaphone" },
  { id: "PRODUCT_LAUNCH", label: "Product Launches", icon: "Rocket" },
  { id: "EVENT_PRODUCTION", label: "Event Production", icon: "Clapperboard" },
  { id: "OTHER", label: "Something else", icon: "Sparkles" },
] as const;

export const ADDITIONAL_SERVICES = [
  { id: "photography", label: "Photography", price: 50000 },
  { id: "videography", label: "Videography", price: 75000 },
  { id: "decoration", label: "Decoration", price: 100000 },
  { id: "catering", label: "Catering", pricePerGuest: 800 },
  { id: "dj", label: "DJ & Entertainment", price: 30000 },
  { id: "live_band", label: "Live Band", price: 150000 },
  { id: "makeup", label: "Makeup & Styling", price: 25000 },
  { id: "transport", label: "Transportation", price: 20000 },
  { id: "security", label: "Security Team", price: 15000 },
];

/* One price story site-wide (see brand/data/content.ts BRAND_INVESTMENTS):
   Boutique from ₹10L · Signature from ₹35L · Grand Masterpiece from ₹1Cr.
   Single-service production (décor only, AV only, …) is quoted from the
   service "basePrice" in data/cms.ts and sits below the Boutique band. */
export const BUDGET_RANGES = [
  { id: "budget-1", label: "Under ₹10 Lakhs", min: 0, max: 1000000 },
  { id: "budget-2", label: "₹10 – 35 Lakhs", min: 1000000, max: 3500000 },
  { id: "budget-3", label: "₹35 Lakhs – 1 Crore", min: 3500000, max: 10000000 },
  { id: "budget-4", label: "₹1 Crore+", min: 10000000, max: 50000000 },
];

export const VENDOR_CATEGORIES = [
  "Photographers", "Decorators", "Caterers", "DJs", "Bands",
  "Anchors", "Makeup Artists", "Security Teams", "Transportation",
];

/** Primary nav — ≤7 items per V4 sitemap; secondary routes live in mega-menu + footer. */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

/** Secondary routes surfaced in Experiences mega-menu + footer (not primary nav). */
export const MEGA_EXPLORE_LINKS = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/gallery", label: "Gallery" },
  { href: "/pricing", label: "Pricing" },
  { href: "/why-nexyyra", label: "Why Nexyyra" },
  { href: "/faqs", label: "FAQs" },
] as const;

export const FOOTER_LEGAL = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund", label: "Refund Policy" },
];
