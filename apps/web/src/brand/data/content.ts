import { BRAND_IMAGES } from "./imagery";

/* BRAND_STATS and BRAND_TRUST removed (Phase-2 entity trust remediation):
   the statistics had no verified source and the "trusted by" brand names
   (Taj, Netflix, Reliance, …) were template data implying client
   relationships that are not evidenced. Restore only with verified facts
   and written authorization to display client logos/names. */

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
    result: "Representative showcase — multi-venue heritage production with full guest hospitality.",
    image: BRAND_IMAGES.destinations[1],
    testimonial: "",
    client: "Representative destination wedding concept",
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
    result: "Representative showcase — broadcast-quality gala production with zero-delay show calling.",
    image: BRAND_IMAGES.corporate[0],
    testimonial: "",
    client: "Representative corporate gala concept",
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
    result: "Representative showcase — golden-hour beachfront ceremony with hybrid live-stream production.",
    image: BRAND_IMAGES.destinations[2],
    testimonial: "",
    client: "Representative beach wedding concept",
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

/* BRAND_TIMELINE removed (Phase-2): every milestone before 2026 was
   unverified template data. The one verifiable fact — incorporation as
   Nexyyra Events and Promotions Private Limited in 2026 (CIN
   U70200ME2026PTC476014) — lives on the /company page. Restore a timeline
   only with verified dates. */

export const BRAND_PROCESS_STEPS = [
  { step: "01", title: "Discovery", desc: "Private consultation to understand your vision, culture, and guest experience goals." },
  { step: "02", title: "Design", desc: "Bespoke creative concept, mood boards, and venue curation aligned to your brand." },
  { step: "03", title: "Production", desc: "Vendor orchestration, timeline management, and technical rehearsals." },
  { step: "04", title: "Execution", desc: "On-ground command center delivering flawless celebration day-of." },
  { step: "05", title: "Legacy", desc: "Post-event analytics, media deliverables, and referral concierge." },
] as const;

/** Qualitative proof points — no unverified statistics (Phase-2 remediation). */
export const BRAND_SERVICE_STATS = [
  { value: "End-to-End", suffix: "", label: "Planning & Execution" },
  { value: "In-House", suffix: "", label: "Design & Production" },
  { value: "Pan-India", suffix: "", label: "Service Coverage" },
  { value: "Dedicated", suffix: "", label: "Event Directors" },
] as const;

/** Nine core service categories for the services page */
export const BRAND_SERVICE_CATEGORIES = [
  { slug: "wedding-planning", title: "Luxury Weddings", narrative: "Bespoke ceremonies where every floral arrangement and candlelit moment is orchestrated with obsessive precision.", image: BRAND_IMAGES.weddings[0], caseStudy: "Multi-day palace wedding productions with décor, hospitality and show flow." },
  { slug: "destination-weddings", title: "Destination Weddings", narrative: "From Udaipur palaces to Goa sunsets — seamless logistics and royal execution.", image: BRAND_IMAGES.destinations[0], caseStudy: "Beachfront and palace destination ceremonies with full guest logistics." },
  { slug: "corporate-events", title: "Corporate Experiences", narrative: "Black-tie excellence for brands that demand flawless C-suite galas and product launches.", image: BRAND_IMAGES.corporate[0], caseStudy: "Black-tie galas and executive events with broadcast-quality production." },
  { slug: "celebrity-management", title: "Celebrity Events", narrative: "Exclusive celebrity appearances, red carpet events, and VIP experiences.", image: BRAND_IMAGES.hero.palace, caseStudy: "Red-carpet appearances and VIP hospitality, managed end to end." },
  { slug: "birthday-events", title: "Birthday Events", narrative: "Milestone birthdays and private celebrations shaped with luxury styling, entertainment, and guest hospitality.", image: BRAND_IMAGES.weddings[3], caseStudy: "Luxury birthday soirée — themed production, celebrity entertainment, and concierge hospitality." },
  { slug: "conferences", title: "Conferences", narrative: "Conference planning with speaker logistics, registration, AV production, and executive guest flow.", image: BRAND_IMAGES.corporate[1], caseStudy: "Multi-track conference programming with speaker and delegate logistics." },
  { slug: "fashion-shows", title: "Fashion Shows", narrative: "Runway productions with lighting design, styling, and front-row experiences.", image: BRAND_IMAGES.gallery[7], caseStudy: "Runway productions with lighting design and front-row experiences." },
  { slug: "concert-management", title: "Concerts", narrative: "Stadium-scale production with artist hospitality, stage design, and crowd management.", image: BRAND_IMAGES.gallery[3], caseStudy: "Stage, sound and crowd-safety production for live music events." },
  { slug: "exhibitions", title: "Exhibitions", narrative: "Trade shows and brand exhibitions with immersive booth design and guest flow.", image: BRAND_IMAGES.gallery[11], caseStudy: "Exhibition pavilions engineered for footfall and lead capture." },
  { slug: "brand-promotions", title: "Brand Activations", narrative: "Experiential marketing that transforms audiences into loyal advocates.", image: BRAND_IMAGES.gallery[11], caseStudy: "Experiential activations designed for engagement and recall." },
  { slug: "product-launches", title: "Product Launches", narrative: "Launch experiences with media management, influencer outreach, immersive staging, and live streaming.", image: BRAND_IMAGES.corporate[1], caseStudy: "Launch reveals with immersive staging and live-stream production." },
  { slug: "event-production", title: "Event Production", narrative: "Technical production across lighting, sound, staging, special effects, and show calling.", image: BRAND_IMAGES.gallery[3], caseStudy: "Redundant AV, staging and show control for large-format events." },
] as const;

/* BRAND_AWARDS and BRAND_MEDIA removed (Phase-2): no public proof URLs
   exist for these award and press claims. Restore individual entries only
   with a verifiable citation for each. */
