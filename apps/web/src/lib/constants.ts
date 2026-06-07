export const SITE_CONFIG = {
  name: "JIJU Events",
  tagline: "Crafting Extraordinary Experiences",
  description:
    "Premier international event management company specializing in luxury weddings, corporate events, concerts, and destination celebrations. 15+ years of excellence.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://jijuevents.com",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "+91 98765 43210",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "hello@jijuevents.com",
  address: "Luxury Events Tower, Bandra Kurla Complex, Mumbai, India 400051",
  social: {
    instagram: "https://instagram.com/jijuevents",
    facebook: "https://facebook.com/jijuevents",
    youtube: "https://youtube.com/jijuevents",
    linkedin: "https://linkedin.com/company/jijuevents",
  },
};

export const SEO_KEYWORDS = [
  "Event Management Company",
  "Wedding Planner",
  "Corporate Event Organizer",
  "Event Planning Services",
  "Destination Wedding Planner",
  "Event Management Agency",
  "Luxury Event Planning",
  "Premium Wedding Planner India",
];

export const EVENT_TYPES = [
  { id: "CORPORATE", label: "Corporate Events", icon: "Building2" },
  { id: "WEDDING", label: "Wedding Planning", icon: "Heart" },
  { id: "DESTINATION_WEDDING", label: "Destination Weddings", icon: "Plane" },
  { id: "BIRTHDAY", label: "Birthday Events", icon: "Cake" },
  { id: "PRODUCT_LAUNCH", label: "Product Launches", icon: "Rocket" },
  { id: "CONFERENCE", label: "Conferences", icon: "Users" },
  { id: "EXHIBITION", label: "Exhibitions", icon: "LayoutGrid" },
  { id: "CONCERT", label: "Concert Management", icon: "Music" },
  { id: "CELEBRITY", label: "Celebrity Management", icon: "Star" },
  { id: "BRAND_PROMOTION", label: "Brand Promotions", icon: "Megaphone" },
  { id: "FASHION_SHOW", label: "Fashion Shows", icon: "Shirt" },
  { id: "MUSIC_FESTIVAL", label: "Music Festivals", icon: "Radio" },
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

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/venues", label: "Venues" },
  { href: "/vendors", label: "Vendors" },
  { href: "/gallery", label: "Gallery" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
