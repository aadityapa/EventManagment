export const SITE_CONFIG = {
  name: "Nexyyra Events",
  legalName: "Nexyyra Events Private Limited",
  shortName: "Nexyyra Events",
  tagline: "The Next Era of Celebrations",
  description:
    "Experience architects, celebration designers, and memory creators — crafting extraordinary weddings, corporate experiences, celebrity events, and destination celebrations across India.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://www.nexyyra.com",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+91 9730594753",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919730594753",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "hello@nexyyra.com",
  address: "Pune, Maharashtra, India",
  city: "Pune",
  region: "Maharashtra",
  social: {
    instagram: "https://instagram.com/nexyyraevents",
    facebook: "https://facebook.com/nexyyraevents",
    youtube: "https://youtube.com/nexyyraevents",
    linkedin: "https://linkedin.com/company/nexyyraevents",
  },
};

/** Single source of truth for entity facts — SEO, GEO, AEO, llms.txt */
export const ENTITY_FACTS = {
  foundingYear: 2012,
  eventsManaged: 1800,
  happyClients: 1400,
  citiesCovered: 35,
  teamSize: 50,
  languages: ["English", "Hindi", "Marathi"],
  serviceAreas: ["Pune", "Mumbai", "Maharashtra", "India", "International destinations"],
  awards: [
    "Best Event Management Company — Event Industry Awards India 2025",
    "Luxury Wedding Planner of the Year — Wedding Sutra 2024",
    "Excellence in Corporate Events — MICE India 2024",
  ],
  knowsAbout: [
    "Luxury Wedding Planning",
    "Corporate Experience Design",
    "Destination Weddings",
    "Concert Production",
    "Exhibition Management",
    "Celebrity Event Management",
    "Brand Activations",
    "Fashion Show Production",
    "Product Launches",
    "Award Ceremonies",
  ],
  priceRange: "₹10 Lakhs to ₹4 Crore+",
  consultation: "Complimentary, no obligation — in person, video, or at venue",
  bookingAdvance: "30% advance secures your date",
  responseTime: "Tailored proposal within 48 hours of consultation",
  lastUpdated: "2026-06-21",
} as const;

export const SEO_KEYWORDS = [
  "Luxury Event Planner Pune",
  "Wedding Planner Pune",
  "Corporate Experience Designer Pune",
  "Destination Wedding Planner India",
  "Luxury Wedding Planner India",
  "Celebrity Event Management Pune",
  "Concert Production Pune",
  "Award Ceremony Organizer",
  "Fashion Show Production",
  "Brand Activation Agency",
  "Experience Architects India",
  "Celebration Designers Pune",
];

export const EVENT_TYPES = [
  { id: "WEDDING", label: "Luxury Weddings", icon: "Heart" },
  { id: "DESTINATION_WEDDING", label: "Destination Weddings", icon: "Plane" },
  { id: "CORPORATE", label: "Corporate Experiences", icon: "Building2" },
  { id: "CELEBRITY", label: "Celebrity Events", icon: "Star" },
  { id: "AWARD_FUNCTION", label: "Award Ceremonies", icon: "Trophy" },
  { id: "BIRTHDAY", label: "Birthday Celebrations", icon: "Cake" },
  { id: "PRODUCT_LAUNCH", label: "Product Launches", icon: "Rocket" },
  { id: "EXHIBITION", label: "Exhibitions", icon: "LayoutGrid" },
  { id: "BRAND_PROMOTION", label: "Brand Activations", icon: "Megaphone" },
  { id: "CONCERT", label: "Concerts", icon: "Music" },
  { id: "FASHION_SHOW", label: "Fashion Shows", icon: "Shirt" },
  { id: "OTHER", label: "Event Production", icon: "Clapperboard" },
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

export const BUDGET_RANGES = [
  { id: "budget-1", label: "Under ₹5 Lakhs", min: 0, max: 500000 },
  { id: "budget-2", label: "₹5 - 15 Lakhs", min: 500000, max: 1500000 },
  { id: "budget-3", label: "₹15 - 50 Lakhs", min: 1500000, max: 5000000 },
  { id: "budget-4", label: "₹50 Lakhs - 1 Crore", min: 5000000, max: 10000000 },
  { id: "budget-5", label: "Above ₹1 Crore", min: 10000000, max: 50000000 },
];

export const VENDOR_CATEGORIES = [
  "Photographers", "Decorators", "Caterers", "DJs", "Bands",
  "Anchors", "Makeup Artists", "Security Teams", "Transportation",
];

/** Primary nav — ≤7 items per V4 sitemap; secondary routes live in mega-menu + footer. */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Experiences" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/venues", label: "Venues" },
  { href: "/blog", label: "Stories" },
  { href: "/contact", label: "Contact" },
] as const;

/** Secondary routes surfaced in Experiences mega-menu + footer (not primary nav). */
export const MEGA_EXPLORE_LINKS = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/venues", label: "Venues" },
  { href: "/vendors", label: "Vendors" },
  { href: "/gallery", label: "Gallery" },
  { href: "/pricing", label: "Pricing" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faqs", label: "FAQs" },
] as const;

export const FOOTER_LEGAL = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund", label: "Refund Policy" },
];
