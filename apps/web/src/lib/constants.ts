export const SITE_CONFIG = {
  name: "Glitz Events & Promotions",
  shortName: "Glitz Events",
  tagline: "Creating Extraordinary Experiences",
  description:
    "Premier luxury event management company in Pune specializing in weddings, corporate events, celebrity management, concerts, exhibitions, product launches, and destination celebrations.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://event-managment-mocha.vercel.app",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+91 9730594753",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919730594753",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "hello@glitzevents.in",
  address: "Pune, Maharashtra, India",
  city: "Pune",
  region: "Maharashtra",
  social: {
    instagram: "https://instagram.com/glitzevents",
    facebook: "https://facebook.com/glitzevents",
    youtube: "https://youtube.com/glitzevents",
    linkedin: "https://linkedin.com/company/glitzevents",
  },
};

export const SEO_KEYWORDS = [
  "Event Management Company Pune",
  "Wedding Planner Pune",
  "Corporate Event Planner Pune",
  "Destination Wedding Planner India",
  "Luxury Wedding Planner India",
  "Corporate Event Organizer",
  "Luxury Event Planner",
  "Celebrity Event Management Pune",
  "Concert Management Pune",
  "Product Launch Events Pune",
  "Award Function Organizer",
];

export const EVENT_TYPES = [
  { id: "WEDDING", label: "Wedding Planning", icon: "Heart" },
  { id: "DESTINATION_WEDDING", label: "Destination Weddings", icon: "Plane" },
  { id: "CORPORATE", label: "Corporate Events", icon: "Building2" },
  { id: "CELEBRITY", label: "Celebrity Management", icon: "Star" },
  { id: "AWARD_FUNCTION", label: "Award Functions", icon: "Trophy" },
  { id: "BIRTHDAY", label: "Birthday Celebrations", icon: "Cake" },
  { id: "PRODUCT_LAUNCH", label: "Product Launches", icon: "Rocket" },
  { id: "EXHIBITION", label: "Exhibitions", icon: "LayoutGrid" },
  { id: "BRAND_PROMOTION", label: "Brand Promotions", icon: "Megaphone" },
  { id: "CONCERT", label: "Concert Management", icon: "Music" },
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
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/venues", label: "Venues" },
  { href: "/blog", label: "Stories" },
  { href: "/contact", label: "Contact" },
] as const;

/** Secondary routes surfaced in Services mega-menu + footer (not primary nav). */
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
