import type { Commitment } from "@/components/ui/types";
import { BRAND_IMAGES } from "./imagery";

/* BRAND_STATS and BRAND_TRUST removed (Phase-2 entity trust remediation):
   the statistics had no verified source and the "trusted by" brand names
   (Taj, Netflix, Reliance, …) were template data implying client
   relationships that are not evidenced. Restore only with verified facts
   and written authorization to display client logos/names. */

/**
 * Illustrative concepts — NOT delivered events (DESIGN.md §1.2). Every view
 * renders them with a ConceptTag. `venue` is a venue *type*, never a named
 * venue; guests, budget and timeline are the planning scale of the concept;
 * challenge / solution / result describe capability, never track record.
 * `image` is the concept's curated frame (`concept-{id}` role in
 * image-curation.ts) as a plain URL, so client bundles never pull the
 * curation table in.
 */
export const BRAND_CASE_STUDIES = [
  {
    id: "cs-1",
    title: "Royal Udaipur Wedding",
    category: "Wedding",
    venue: "Heritage palace",
    guests: 800,
    budget: "₹2.5 – 4 Cr",
    timeline: "5 Days",
    story: "A five-day destination celebration planned across mehendi, sangeet, ceremony and reception, each in its own part of a heritage palace.",
    challenge: "A large guest list moving between several heritage spaces, each with its own access rules, timings and ceremonial customs.",
    solution: "One event director holding a single run-of-show for every space, a cultural liaison for each ritual, and hospitality desks that keep guests moving between functions.",
    result: "How we plan a multi-day, multi-venue wedding: one schedule, one accountable lead, and guest care from arrival to farewell.",
    image: "https://lh3.googleusercontent.com/d/131RPh47oY4c9iflke0JALMHs_znZzrb1=w1920",
  },
  {
    id: "cs-2",
    title: "Black-Tie Corporate Gala",
    category: "Corporate",
    venue: "Hotel ballroom",
    guests: 1500,
    budget: "₹1.2 – 2 Cr",
    timeline: "1 Evening",
    story: "A black-tie anniversary gala with a projected brand timeline and a live orchestra.",
    challenge: "A senior audience and a tight running order, with no room for pauses between speeches, film and performance.",
    solution: "A cue-by-cue show script, rehearsed stage management, and backup audio-visual systems running alongside the main rig.",
    result: "How we produce a single-evening gala: a scripted show, rehearsed transitions, and a fallback ready for every critical cue.",
    image: "https://lh3.googleusercontent.com/d/1lT00v7aMGMqSg8_rr1ooLteStd366itK=w1920",
  },
  {
    id: "cs-3",
    title: "Sunset Beach Wedding",
    category: "Destination",
    venue: "Beachfront",
    guests: 200,
    budget: "₹40 – 80 L",
    timeline: "3 Days",
    story: "An intimate beachfront ceremony timed to golden hour, with a live stream for family who cannot travel.",
    challenge: "Weather and tide windows that decide whether the ceremony can land at sunset.",
    solution: "An indoor backup prepared in parallel, daily forecast checks, and a ceremony schedule built around the sunset time.",
    result: "How we plan an outdoor ceremony: a confirmed backup, a weather call agreed in advance, and a schedule built around the light.",
    image: "https://lh3.googleusercontent.com/d/1StkcCxM1dFUrm9It_QhylB0w4gDCSXL8=w1920",
  },
];

/* Collections are cumulative: each one includes everything in the one below
   it, so the comparison table never marks a lower-tier service as missing
   from a higher tier. What every client gets regardless of collection (free
   consultation, one event director, itemised proposal) is NOT listed here —
   it lives in BRAND_COLLECTION_ESSENTIALS and is shown once above the table. */
const BOUTIQUE_INCLUDES = ["Vendor shortlisting and contracts", "Bespoke design concept", "Day-of coordination"] as const;
const SIGNATURE_INCLUDES = [...BOUTIQUE_INCLUDES, "Full vendor management", "Technical production", "VIP guest handling", "Rehearsal management"] as const;
const GRAND_INCLUDES = [...SIGNATURE_INCLUDES, "Creative director", "Travel and multi-city coordination", "Talent and artist booking coordination", "Guest hospitality desks", "Multi-day production"] as const;

/** Published collection prices exclude GST (terms: "All prices are subject to 18% GST"). */
export const BRAND_PRICE_TAX_NOTE = "Prices exclude 18% GST";

export const BRAND_INVESTMENTS = [
  {
    name: "The Boutique Experience",
    tagline: "Intimate gatherings, impeccable taste",
    from: "₹10 Lakhs",
    narrative: "For celebrations of 50–150 guests where every detail whispers luxury.",
    includes: BOUTIQUE_INCLUDES,
  },
  {
    name: "The Signature Gala",
    tagline: "Where brands and celebrations converge",
    from: "₹35 Lakhs",
    featured: true,
    narrative: "Full planning for 150–500 guests with immersive design and premium production.",
    includes: SIGNATURE_INCLUDES,
  },
  {
    name: "The Grand Masterpiece",
    tagline: "The pinnacle of event artistry",
    from: "₹1 Crore+",
    narrative: "Destination weddings, corporate galas, and landmark celebrations of 500+ guests.",
    includes: GRAND_INCLUDES,
  },
];

/* BRAND_TIMELINE removed (Phase-2): every milestone before 2026 was
   unverified template data. The one verifiable fact — incorporation as
   Nexyyra Events and Promotions Private Limited in 2026 (CIN
   U70200ME2026PTC476014) — lives on the /company page. Restore a timeline
   only with verified dates. */

export const BRAND_PROCESS_STEPS = [
  { step: "01", title: "Discovery", desc: "A free consultation to understand your vision, traditions, guest list and budget band." },
  { step: "02", title: "Design", desc: "A creative concept, mood boards and a venue shortlist, priced line by line in your proposal." },
  { step: "03", title: "Production", desc: "Vendor contracts, a single run-of-show, and technical rehearsals before the day." },
  { step: "04", title: "Execution", desc: "Your event director and an on-ground team run every cue, vendor and guest desk on the day." },
  { step: "05", title: "Wrap", desc: "A post-event debrief, vendor settlement, and the hand-over of your photos and films." },
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
  { slug: "wedding-planning", title: "Luxury Weddings", narrative: "Bespoke ceremonies planned ritual by ritual, from florals and lighting to hospitality and the run-of-show.", image: BRAND_IMAGES.weddings[0], caseStudy: "Multi-day palace wedding productions with décor, hospitality and show flow." },
  { slug: "destination-weddings", title: "Destination Weddings", narrative: "Palace, beach and hill-station celebrations, with guest travel, stays and on-ground logistics in one plan.", image: BRAND_IMAGES.destinations[0], caseStudy: "Beachfront and palace destination ceremonies with full guest logistics." },
  { slug: "corporate-events", title: "Corporate Experiences", narrative: "Black-tie galas, leadership offsites and annual days, scripted cue by cue.", image: BRAND_IMAGES.corporate[0], caseStudy: "Black-tie galas and leadership events with scripted shows and backup AV." },
  { slug: "celebrity-management", title: "Celebrity Events", narrative: "Talent and artist booking coordination, red-carpet arrivals and VIP hospitality.", image: BRAND_IMAGES.hero.palace, caseStudy: "Artist riders, red-carpet flow and VIP hospitality, managed end to end." },
  { slug: "birthday-events", title: "Birthday Events", narrative: "Milestone birthdays and private celebrations shaped with luxury styling, entertainment, and guest hospitality.", image: BRAND_IMAGES.weddings[3], caseStudy: "Themed birthday productions with entertainment, styling and guest hospitality." },
  { slug: "conferences", title: "Conferences", narrative: "Conference planning with speaker logistics, registration, AV production, and executive guest flow.", image: BRAND_IMAGES.corporate[1], caseStudy: "Multi-track conference programming with speaker and delegate logistics." },
  { slug: "fashion-shows", title: "Fashion Shows", narrative: "Runway productions with lighting design, styling, and front-row experiences.", image: BRAND_IMAGES.gallery[7], caseStudy: "Runway productions with lighting design and front-row experiences." },
  { slug: "concert-management", title: "Concerts", narrative: "Live music production with artist hospitality, stage design and crowd-safety planning.", image: BRAND_IMAGES.gallery[3], caseStudy: "Stage, sound and crowd-safety production for live music events." },
  { slug: "exhibitions", title: "Exhibitions", narrative: "Trade shows and brand exhibitions with immersive booth design and guest flow.", image: BRAND_IMAGES.gallery[11], caseStudy: "Exhibition pavilions engineered for footfall and lead capture." },
  { slug: "brand-promotions", title: "Brand Activations", narrative: "Experiential activations in malls, campuses and public spaces, built around your brief.", image: BRAND_IMAGES.gallery[11], caseStudy: "Experiential activations designed for engagement and recall." },
  { slug: "product-launches", title: "Product Launches", narrative: "Launch experiences with media management, influencer outreach, immersive staging, and live streaming.", image: BRAND_IMAGES.corporate[1], caseStudy: "Launch reveals with immersive staging and live-stream production." },
  { slug: "event-production", title: "Event Production", narrative: "Technical production across lighting, sound, staging, special effects, and show calling.", image: BRAND_IMAGES.gallery[3], caseStudy: "Redundant AV, staging and show control for large-format events." },
] as const;

/* BRAND_AWARDS and BRAND_MEDIA removed (Phase-2): no public proof URLs
   exist for these award and press claims. Restore individual entries only
   with a verifiable citation for each. */

import { BRAND_REPLY_HOURS, BRAND_REPLY_HOURS_SHORT } from "./reply-hours";

export { BRAND_REPLY_HOURS, BRAND_REPLY_HOURS_SHORT };

/**
 * The four business-controlled commitments — the site's trust block
 * (DESIGN.md Appendix). Policies the company sets, never statistics;
 * rendered by `Commitments`, which takes no numeric props.
 */
export const BRAND_COMMITMENTS: Commitment[] = [
  { id: "reply", term: "Same-day reply", detail: BRAND_REPLY_HOURS },
  { id: "proposal", term: "Itemised proposal in 48 hours", detail: "Every line priced after your free consultation." },
  { id: "director", term: "One event director", detail: "A single accountable lead from brief to wrap." },
  { id: "advance", term: "30% secures your date", detail: "Balance in milestones via Razorpay, bank transfer or UPI." },
];

/**
 * What every collection includes, whatever its size — shown once above the
 * collection comparison so the table only compares what each tier adds.
 */
export const BRAND_COLLECTION_ESSENTIALS = [
  { id: "consultation", term: "Free consultation", detail: "In person, on video or at your venue, with no obligation." },
  { id: "director", term: "One event director", detail: "A single accountable lead from brief to wrap." },
  { id: "proposal", term: "Itemised proposal", detail: "Every line priced within 48 hours of your consultation." },
] as const;
