import { BRAND_IMAGES } from "./imagery";

export const BRAND_STATS = [
  { value: 1000, suffix: "+", label: "Events Managed" },
  { value: 500, suffix: "+", label: "Happy Clients" },
  { value: 10, suffix: "+", label: "Years Experience" },
  { value: 50, suffix: "+", label: "Premium Venues" },
] as const;

export const BRAND_TRUST = [
  "Taj Hotels", "Marriott", "Oberoi", "ITC Hotels", "Hyatt",
  "Tata Group", "Reliance", "Sony Music", "Zee Entertainment", "Netflix India",
  "Four Seasons", "JW Marriott", "Aditya Birla Group", "Mahindra",
];

export const BRAND_SERVICES = [
  { slug: "wedding-planning", title: "Luxury Weddings", narrative: "Bespoke ceremonies where every floral arrangement, every candlelit moment, and every guest experience is orchestrated with obsessive precision.", image: BRAND_IMAGES.weddings[0] },
  { slug: "corporate-events", title: "Corporate Galas", narrative: "Black-tie excellence for brands that demand nothing less than flawless — from C-suite galas to product launches that generate global buzz.", image: BRAND_IMAGES.corporate[0] },
  { slug: "destination-weddings", title: "Destination Weddings", narrative: "From Udaipur palaces to Goa sunsets — we transport your dream across continents with seamless logistics and royal execution.", image: BRAND_IMAGES.destinations[0] },
  { slug: "concert-management", title: "Concerts & Festivals", narrative: "Stadium-scale production with artist hospitality, stage design, and crowd management that sets industry benchmarks.", image: BRAND_IMAGES.gallery[3] },
  { slug: "product-launches", title: "Product Launches", narrative: "Immersive brand experiences with holographic displays, influencer seeding, and media strategies that create viral moments.", image: BRAND_IMAGES.corporate[1] },
  { slug: "brand-promotions", title: "Brand Activations", narrative: "Experiential marketing that transforms audiences into loyal advocates through sensory-rich, memorable touchpoints.", image: BRAND_IMAGES.gallery[11] },
  { slug: "celebrity-management", title: "Celebrity Management", narrative: "Exclusive celebrity appearances, red carpet events, and VIP experiences curated for India's most discerning hosts.", image: BRAND_IMAGES.hero.palace },
  { slug: "birthday-events", title: "Luxury Celebrations", narrative: "Milestone moments designed with the same artistry we bring to royal weddings — intimate, personal, unforgettable.", image: BRAND_IMAGES.weddings[3] },
];

export const BRAND_CASE_STUDIES = [
  {
    id: "cs-1",
    title: "Royal Udaipur Wedding",
    category: "Wedding",
    venue: "Heritage Palace, Udaipur",
    guests: 800,
    budget: "₹2.5 – 4 Cr",
    timeline: "5 Days",
    story: "A five-day destination celebration spanning mehendi, sangeet, ceremony, and reception across three palace venues.",
    challenge: "Coordinating 800 international guests across multiple heritage venues with strict cultural protocols.",
    solution: "Dedicated cultural liaison, multi-venue command center, and 120-person on-ground team.",
    result: "Featured in Vogue India. Generated 3 destination wedding referrals.",
    image: BRAND_IMAGES.destinations[1],
    testimonial: "Nexyyra made our palace wedding absolutely magical. Every detail was perfect.",
    client: "Aisha & Rahul",
  },
  {
    id: "cs-2",
    title: "TechCorp Annual Gala",
    category: "Corporate",
    venue: "The Grand Ballroom, Mumbai",
    guests: 1500,
    budget: "₹1.2 – 2 Cr",
    timeline: "1 Evening",
    story: "Black-tie gala celebrating 25 years of innovation with holographic brand timeline and live orchestra.",
    challenge: "1,500 C-suite executives requiring zero-delay precision and broadcast-quality production.",
    solution: "Military-precision timeline, 200-person service team, and redundant AV systems.",
    result: "98% guest satisfaction. Featured in 12 media outlets.",
    image: BRAND_IMAGES.corporate[0],
    testimonial: "Flawlessly executed. Nexyyra's team handled everything with military precision.",
    client: "Vikram Malhotra, CEO",
  },
  {
    id: "cs-3",
    title: "Sunset Beach Wedding",
    category: "Destination",
    venue: "Beachfront Paradise, Goa",
    guests: 200,
    budget: "₹40 – 80 L",
    timeline: "3 Days",
    story: "Intimate beachfront ceremony at golden hour with live streaming for 2,000 virtual guests.",
    challenge: "Weather contingency and tide scheduling for perfect sunset timing.",
    solution: "Dual indoor backup, meteorological monitoring, and precision sunset choreography.",
    result: "8M social media impressions. Perfect golden-hour ceremony.",
    image: BRAND_IMAGES.destinations[2],
    testimonial: "The most beautiful day of our lives, executed flawlessly.",
    client: "The Kapoor Family",
  },
];

export const BRAND_INVESTMENTS = [
  {
    name: "The Boutique Experience",
    tagline: "Intimate gatherings, impeccable taste",
    from: "₹10 Lakhs",
    narrative: "For celebrations of 50–150 guests where every detail whispers luxury.",
    includes: ["Private consultation", "Curated vendor network", "Bespoke design concept", "Day-of coordination"],
  },
  {
    name: "The Signature Gala",
    tagline: "Where brands and celebrations converge",
    from: "₹35 Lakhs",
    featured: true,
    narrative: "Full planning for 150–500 guests with immersive design and premium production.",
    includes: ["Dedicated event director", "Full vendor management", "Technical production", "VIP guest handling", "Rehearsal management"],
  },
  {
    name: "The Grand Masterpiece",
    tagline: "The pinnacle of event artistry",
    from: "₹1 Crore+",
    narrative: "Destination weddings, corporate galas, and landmark celebrations of 500+ guests.",
    includes: ["Executive creative director", "International coordination", "Celebrity vendor access", "24/7 concierge", "Multi-day production"],
  },
];

export const BRAND_TIMELINE = [
  { year: "2012", event: "Founded in Pune as a boutique luxury wedding studio." },
  { year: "2015", event: "First major corporate gala — 800 guests, zero delays." },
  { year: "2018", event: "Destination wedding division launched across Rajasthan and Goa." },
  { year: "2020", event: "Hybrid and virtual event production studio — broadcast-quality live streams." },
  { year: "2023", event: "Expanded to 35 cities — celebrity partnerships and broadcast division." },
  { year: "2025", event: "1,800+ events delivered across 35 cities — India's premier luxury event house." },
];

export const BRAND_PROCESS_STEPS = [
  { step: "01", title: "Discovery", desc: "Private consultation to understand your vision, culture, and guest experience goals." },
  { step: "02", title: "Design", desc: "Bespoke creative concept, mood boards, and venue curation aligned to your brand." },
  { step: "03", title: "Production", desc: "Vendor orchestration, timeline management, and technical rehearsals." },
  { step: "04", title: "Execution", desc: "On-ground command center delivering flawless celebration day-of." },
  { step: "05", title: "Legacy", desc: "Post-event analytics, media deliverables, and referral concierge." },
] as const;

export const BRAND_SERVICE_STATS = [
  { value: 1800, suffix: "+", label: "Events Delivered" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 35, suffix: "+", label: "Cities Served" },
  { value: 120, suffix: "+", label: "On-Ground Team" },
] as const;

/** Nine core service categories for the services page */
export const BRAND_SERVICE_CATEGORIES = [
  { slug: "wedding-planning", title: "Luxury Weddings", narrative: "Bespoke ceremonies where every floral arrangement and candlelit moment is orchestrated with obsessive precision.", image: BRAND_IMAGES.weddings[0], caseStudy: "Royal Udaipur Wedding — 800 guests, 5 days, Vogue India feature." },
  { slug: "destination-weddings", title: "Destination Weddings", narrative: "From Udaipur palaces to Goa sunsets — seamless logistics and royal execution.", image: BRAND_IMAGES.destinations[0], caseStudy: "Sunset Beach Wedding — 8M social impressions, perfect golden hour." },
  { slug: "corporate-events", title: "Corporate Experiences", narrative: "Black-tie excellence for brands that demand flawless C-suite galas and product launches.", image: BRAND_IMAGES.corporate[0], caseStudy: "TechCorp Annual Gala — 1,500 executives, broadcast-quality production." },
  { slug: "celebrity-management", title: "Celebrity Events", narrative: "Exclusive celebrity appearances, red carpet events, and VIP experiences.", image: BRAND_IMAGES.hero.palace, caseStudy: "Brand ambassador launch — 12 media outlets, 50M impressions." },
  { slug: "award-functions", title: "Award Ceremonies", narrative: "Red-carpet galas with broadcast-quality production and celebrity coordination.", image: BRAND_IMAGES.awards, caseStudy: "Industry awards night — 600 VIP guests, live broadcast." },
  { slug: "fashion-shows", title: "Fashion Shows", narrative: "Runway productions with lighting design, styling, and front-row experiences.", image: BRAND_IMAGES.gallery[7], caseStudy: "Fashion Week finale — 500 front-row guests, global press." },
  { slug: "concert-management", title: "Concerts", narrative: "Stadium-scale production with artist hospitality, stage design, and crowd management.", image: BRAND_IMAGES.gallery[3], caseStudy: "Music Fest 2025 — 10,000 attendees, 50+ artists, zero incidents." },
  { slug: "exhibitions", title: "Exhibitions", narrative: "Trade shows and brand exhibitions with immersive booth design and guest flow.", image: BRAND_IMAGES.gallery[11], caseStudy: "Auto expo pavilion — 40% lead capture increase." },
  { slug: "brand-promotions", title: "Brand Activations", narrative: "Experiential marketing that transforms audiences into loyal advocates.", image: BRAND_IMAGES.gallery[11], caseStudy: "Product activation — 3x footfall vs. previous year." },
] as const;

export const BRAND_AWARDS = [
  { title: "Best Event Management Company", org: "Event Industry Awards India", year: 2025 },
  { title: "Luxury Wedding Planner of the Year", org: "Wedding Sutra", year: 2024 },
  { title: "Excellence in Corporate Events", org: "MICE India", year: 2024 },
  { title: "Innovation in Event Technology", org: "Event Tech Summit", year: 2023 },
];

export const BRAND_MEDIA = ["Forbes India", "Economic Times", "Vogue India", "Wedding Sutra", "Event Industry Awards"];
