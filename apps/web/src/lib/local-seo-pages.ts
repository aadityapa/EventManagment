import { BRAND_INVESTMENTS } from "@/brand/data/content";
import type { ServiceSlug } from "@/components/ui/types";
import { services } from "@/data/cms";
import { SITE_CONFIG } from "./constants";
import { UNIVERSAL_LOCAL_FAQS } from "./geo-content";
import { startingPrice } from "./location-pages";
import { ORG_ID, startingPriceSpecification } from "./seo";

export interface LocalSeoPage {
  slug: string;
  /** SEO title (metadata, breadcrumb and footer label). */
  title: string;
  h1: string;
  /** Cover eyebrow, plain words. */
  eyebrow: string;
  description: string;
  keywords: string[];
  /** Schema input: the OfferCatalog name; also maps to the inquiry form's event type. */
  serviceType: string;
  /** The 48px cover icon. */
  icon: ServiceSlug;
  /** Cover lead. */
  intro: string;
  /** "The brief" — three paragraphs of unique intent copy. */
  brief: string[];
  /** 3–6 rows for "Relevant services". */
  services: ServiceSlug[];
  /** Overrides the serviceType → event type mapping when the intent is narrower. */
  eventType?: string;
  faqs: { question: string; answer: string }[];
  /** Fallback when wedding-internal-links has no contextual links for the page. */
  relatedLinks: { href: string; label: string }[];
}

const [BOUTIQUE, SIGNATURE, GRAND] = BRAND_INVESTMENTS;

/** serviceType → InquiryForm event type id (EVENT_TYPES in constants.ts). */
const EVENT_TYPE_BY_SERVICE_TYPE: Record<string, string | undefined> = {
  EventManagementService: undefined, // a general brief: let the visitor choose
  WeddingPlanningService: "WEDDING",
  CorporateEventService: "CORPORATE",
  ExhibitionEventService: "EXHIBITION",
};

export function localPageEventType(page: LocalSeoPage): string | undefined {
  return page.eventType ?? EVENT_TYPE_BY_SERVICE_TYPE[page.serviceType];
}

/*
 * Copy rules (DESIGN.md §1.2): no "Premier", no awards or press, no partnerships,
 * no invented capacities or track record. Prices come from cms.ts / content.ts.
 */
export const LOCAL_SEO_PAGES: LocalSeoPage[] = [
  {
    slug: "event-management-company-pune",
    title: "Event Management Company Pune",
    h1: "Event Management Company in Pune",
    eyebrow: "Event management · Pune",
    description:
      "Nexyyra Events is an event management company in Pune: weddings, corporate events, celebrations and production, planned end-to-end by one event director.",
    keywords: [
      "Event Management Company Pune",
      "Event Planner Pune",
      "Luxury Event Management Pune",
      "Event Organiser Pune Maharashtra",
    ],
    serviceType: "EventManagementService",
    icon: "event-production",
    intro:
      "Weddings, corporate events, milestone celebrations and full production, planned from our Delivery & Coordination Office in Pune and run on the day by one event director.",
    brief: [
      "Nexyyra Events and Promotions Private Limited was incorporated in 2026, with its registered office in Telhara and a Delivery & Coordination Office in Pune. We take on the whole event — concept, venue, suppliers, production and the day itself — so you deal with one company and one accountable person.",
      "In Pune that means site walks at ballrooms, lawns and farm estates, tastings with caterers, and production plans built around the season: open-air in the cool months, covered settings through the monsoon. Décor, staging, lighting and sound are designed in-house and built by suppliers we brief on a single schedule.",
      "You receive an itemised proposal within 48 hours of your free consultation, with every line priced. A 30% advance secures the date, and the balance follows in milestones by Razorpay, bank transfer or UPI.",
    ],
    services: ["wedding-planning", "corporate-events", "birthday-events", "conferences", "product-launches", "event-production"],
    faqs: [
      {
        question: "What does an event management company in Pune actually handle?",
        answer:
          "Everything between the first idea and the last load-out: concept and design, venue sourcing, supplier contracts, budget, guest logistics, production and on-site management. With Nexyyra Events, one event director owns all of it.",
      },
      {
        question: "What types of events does Nexyyra manage in Pune?",
        answer:
          "Weddings, corporate events, conferences, product launches, exhibitions, birthday and milestone celebrations, concerts and fashion shows, along with destination events planned from Pune.",
      },
    ],
    relatedLinks: [
      { href: "/wedding-planner-pune", label: "Wedding Planner Pune" },
      { href: "/corporate-event-management-pune", label: "Corporate Events Pune" },
      { href: "/services", label: "All services" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    slug: "wedding-planner-pune",
    title: "Luxury Wedding Planner Pune",
    h1: "Luxury Wedding Planner in Pune",
    eyebrow: "Wedding planning · Pune",
    description:
      "Luxury wedding planning in Pune: venues, décor, suppliers, guest hospitality and every function from mehendi to reception, led by one event director.",
    keywords: [
      "Wedding Planner Pune",
      "Luxury Wedding Planner Pune",
      "Best Wedding Planner Maharashtra",
      "Destination Wedding Planner Pune",
    ],
    serviceType: "WeddingPlanningService",
    icon: "wedding-planning",
    intro:
      "From the mehendi to the reception, one event director plans your Pune wedding: venues, décor, suppliers, guests and the running order of every function.",
    brief: [
      "A Pune wedding usually means several functions across two or three days, often at different venues: a haldi at home, a mehendi on a lawn, a ceremony under a mandap and a reception in a ballroom. We plan them as one sequence, so décor, catering and guest movement carry through rather than restart each time.",
      "We begin with what matters to your families — rituals, guest list, budget — and then shortlist venues to match. November to February is the busiest season, so we hold venues and key suppliers early; monsoon dates are easier to secure with a covered plan.",
      `Décor and production are designed in-house. Photographers, caterers, florists and entertainers are briefed by us and work to one schedule. Wedding planning starts from ${startingPrice("wedding-planning")}, and your itemised proposal follows within 48 hours of the consultation.`,
    ],
    services: ["wedding-planning", "destination-weddings", "event-production", "birthday-events"],
    faqs: [
      {
        question: "How much does a wedding planner cost in Pune?",
        answer: `Wedding planning as a single service starts from ${startingPrice("wedding-planning")}. Full collections start from ${BOUTIQUE.from} for 50–150 guests, ${SIGNATURE.from} for 150–500 and ${GRAND.from} for 500+. Your consultation is free and the proposal is itemised.`,
      },
      {
        question: "Do you plan destination weddings from Pune?",
        answer: `Yes. We plan destination weddings across India and abroad from Pune: venue sourcing, guest travel and stays, multi-day itineraries and on-site management. Destination wedding planning starts from ${startingPrice("destination-weddings")}.`,
      },
    ],
    relatedLinks: [
      { href: "/services/wedding-planning", label: "Wedding planning" },
      { href: "/blog/wedding-planner-pune-guide", label: "Choosing a wedding planner in Pune" },
      { href: "/blog/pune-luxury-venues-guide", label: "Pune venues guide" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    slug: "corporate-event-management-pune",
    title: "Corporate Event Management Pune",
    h1: "Corporate Event Management in Pune",
    eyebrow: "Corporate events · Pune",
    description:
      "Corporate event management in Pune: conferences, annual days, offsites, product launches, award nights and dealer meets, produced end-to-end.",
    keywords: [
      "Corporate Event Management Pune",
      "Corporate Event Planner Pune",
      "Conference Organizer Pune",
      "Annual Day Event Planner Pune",
    ],
    serviceType: "CorporateEventService",
    icon: "corporate-events",
    intro:
      "Conferences, annual days, offsites, launches and award nights for Pune companies, planned against your objectives, produced end-to-end and run by one event director.",
    brief: [
      "Corporate briefs start with the purpose: what the audience should leave knowing, feeling or doing. We shape the agenda, staging and guest journey around that, then build the budget line by line so finance teams can sign off without surprises.",
      "Pune's companies cluster around the IT corridors, the industrial belts and the city centre, and venues range from hotel ballrooms and convention halls to resorts on the city's edge for offsites. We plan delegate transfers around peak traffic, and registration, AV and speaker logistics with the venue's technical team.",
      `Stage design, lighting, sound and screens are designed in-house and built by suppliers working to our show schedule. Live streaming for hybrid sessions can be added where the brief needs it. Corporate events start from ${startingPrice("corporate-events")} and conferences from ${startingPrice("conferences")}.`,
    ],
    services: ["corporate-events", "conferences", "product-launches", "brand-promotions", "exhibitions", "event-production"],
    faqs: [
      {
        question: "What corporate events does Nexyyra manage in Pune?",
        answer:
          "Conferences, annual general meetings, product launches, team offsites, award functions, dealer meets and executive galas for companies across Pune and Maharashtra.",
      },
      {
        question: "Can Nexyyra handle hybrid and virtual corporate events?",
        answer:
          "Yes. Live streaming and hybrid production can be added to a conference or launch; it is scoped and priced as its own line in your itemised proposal.",
      },
    ],
    relatedLinks: [
      { href: "/services/corporate-events", label: "Corporate events" },
      { href: "/services/conferences", label: "Conferences" },
      { href: "/services/product-launches", label: "Product launches" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    slug: "luxury-wedding-planner-maharashtra",
    title: "Luxury Wedding Planner Maharashtra",
    h1: "Luxury Wedding Planner in Maharashtra",
    eyebrow: "Weddings · Maharashtra",
    description:
      "Luxury wedding planning across Maharashtra: Pune, Mumbai, Nashik, Nagpur and the hill and coastal destinations between, planned by one event director.",
    keywords: [
      "Luxury Wedding Planner Maharashtra",
      "Premium Wedding Planner India",
      "Palace Wedding Planner",
      "High End Wedding Planner Pune",
    ],
    serviceType: "WeddingPlanningService",
    icon: "wedding-planning",
    intro:
      "City ballrooms in Mumbai and Pune, vineyards near Nashik, hill resorts in the Sahyadris and the Konkan coast: weddings across Maharashtra, planned from Pune by one event director.",
    brief: [
      "Maharashtra gives couples a wide choice within a few hours' drive: hotel ballrooms in Mumbai and Pune, estates and vineyards around Nashik, hill resorts at Lonavala and Mahabaleshwar, beach properties along the Konkan coast and large lawns in Nagpur and Vidarbha. We help you choose by guest count, season and travel time rather than by photographs alone.",
      "Marathi, Gujarati, Marwari, Punjabi and South Indian families, and mixed ceremonies, each bring their own rituals and timings. We plan every function with your families and priests, and consultations are available in Marathi, Hindi and English.",
      `Décor and production are designed in-house; local caterers, florists and tent suppliers are briefed by us wherever the wedding takes place. Collections start from ${BOUTIQUE.from}, and your itemised proposal follows within 48 hours of a free consultation.`,
    ],
    services: ["wedding-planning", "destination-weddings", "event-production", "celebrity-management"],
    faqs: [
      {
        question: "Which places in Maharashtra does Nexyyra serve for weddings?",
        answer:
          "Pune, Mumbai, Nashik, Nagpur and across the state, including hill stations such as Lonavala and Mahabaleshwar and coastal properties on the Konkan. We also plan destination weddings in Goa, Rajasthan and abroad.",
      },
      {
        question: "What do you mean by luxury wedding planning?",
        answer:
          "Attention rather than excess: a design built for your families, every guest looked after, suppliers held to one schedule, and one event director accountable from brief to wrap. The budget follows the brief, and every line of it is itemised.",
      },
    ],
    relatedLinks: [
      { href: "/wedding-planner-pune", label: "Wedding Planner Pune" },
      { href: "/destination-wedding-planner-pune", label: "Destination weddings" },
      { href: "/pricing", label: "Collections and pricing" },
      { href: "/why-nexyyra", label: "Why Nexyyra" },
    ],
  },
  {
    slug: "exhibition-management-pune",
    title: "Exhibition Management Pune",
    h1: "Exhibition Management Company in Pune",
    eyebrow: "Exhibitions · Pune",
    description:
      "Exhibition management in Pune: stand design, fabrication, floor planning, staffing, and build and dismantle for trade shows and brand expos.",
    keywords: [
      "Exhibition Management Pune",
      "Trade Show Organizer Pune",
      "Exhibition Stall Design Pune",
      "Expo Management Maharashtra",
    ],
    serviceType: "ExhibitionEventService",
    icon: "exhibitions",
    intro:
      "Stand design, fabrication, staffing, and build and dismantle for trade shows and brand expos in Pune and across India, managed by one event director.",
    brief: [
      "An exhibition stand has to work in seconds: visitors decide as they walk past whether to stop. We design for sightlines, one clear message and room for conversation, then plan the flow so your team can meet visitors without crowding the counter.",
      "Organisers set firm rules on stand height, rigging, power and build windows, and those rules differ from hall to hall. We read the exhibitor manual first, submit drawings for approval on time and schedule fabrication so the stand arrives ready to assemble rather than to be finished on the floor.",
      `We also handle staffing, AV, lead capture and dismantle. Exhibition management starts from ${startingPrice("exhibitions")}, and your itemised proposal follows within 48 hours of a free consultation.`,
    ],
    services: ["exhibitions", "brand-promotions", "product-launches", "corporate-events"],
    faqs: [
      {
        question: "What exhibition services does Nexyyra provide in Pune?",
        answer:
          "Stand design, fabrication, floor planning, staffing, lead capture, AV, and build and dismantle for exhibitions and trade shows in Pune and across India.",
      },
      {
        question: "How far in advance should we book exhibition management?",
        answer:
          "Eight to twelve weeks before the show for a custom-built stand, so drawings can be approved and fabrication scheduled. A simpler modular stand can be arranged with four to six weeks' notice, depending on availability.",
      },
    ],
    relatedLinks: [
      { href: "/services/exhibitions", label: "Exhibitions" },
      { href: "/services/brand-promotions", label: "Brand promotions" },
      { href: "/corporate-event-management-pune", label: "Corporate Events Pune" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    slug: "destination-wedding-planner-pune",
    title: "Destination Wedding Planner Pune",
    h1: "Destination Wedding Planner from Pune",
    eyebrow: "Destination weddings · From Pune",
    description:
      "Destination weddings planned from Pune: Udaipur, Jaipur, Goa, Kerala and international venues, with guest travel, stays and every function managed.",
    keywords: [
      "Destination Wedding Planner Pune",
      "Destination Wedding Planner India",
      "International Wedding Planner Pune",
      "Beach Wedding Planner India",
    ],
    serviceType: "WeddingPlanningService",
    icon: "destination-weddings",
    eventType: "DESTINATION_WEDDING",
    intro:
      "Udaipur, Jaipur, Goa, Kerala or abroad: we plan the venue, guest travel, stays and every function from Pune, and your event director travels with the wedding.",
    brief: [
      "A destination wedding is a piece of travel planning wrapped around a celebration. We start with the guest list and where people are flying from, then match destinations to travel time, season and budget before anyone falls for a venue.",
      "Room blocks, flights, transfers, welcome desks and RSVP tracking are planned alongside décor and production, so every guest knows where to be and when. Heritage and beach venues bring their own permissions and rules on sound, flame and fixings; we record them at the site visit and design within them.",
      `Planning, design and budgeting run from Pune; suppliers at the destination are briefed by us and work to one schedule. Destination wedding planning starts from ${startingPrice("destination-weddings")}, and your itemised proposal follows within 48 hours of a free consultation.`,
    ],
    services: ["destination-weddings", "wedding-planning", "event-production"],
    faqs: [
      {
        question: "What destination wedding locations does Nexyyra recommend?",
        answer:
          "It depends on your guest list, season and budget. In India, couples often look at Udaipur, Jaipur and other Rajasthan heritage cities, Goa, Kerala, and hill stations close to Pune such as Lonavala; abroad, destinations such as Dubai, Bali and Thailand are easy for most guests to reach. We shortlist venues after the consultation.",
      },
      {
        question: "How does Nexyyra manage guest logistics for destination weddings?",
        answer:
          "We plan group travel, room blocks, RSVP tracking, welcome desks and transfers, and keep a hospitality desk at the venue so every guest knows the plan for each day.",
      },
    ],
    relatedLinks: [
      { href: "/services/destination-weddings", label: "Destination weddings" },
      { href: "/blog/udaipur-palace-wedding-guide", label: "Udaipur palace wedding guide" },
      { href: "/blog/goa-beach-wedding-guide", label: "Goa beach wedding guide" },
      { href: "/book-event", label: "Get a Free Proposal" },
    ],
  },
];

export function getLocalSeoPage(slug: string): LocalSeoPage | undefined {
  return LOCAL_SEO_PAGES.find((p) => p.slug === slug);
}

/** For the six static routes: a missing entry is a build error, not a 404. */
export function requireLocalSeoPage(slug: string): LocalSeoPage {
  const page = getLocalSeoPage(slug);
  if (!page) throw new Error(`Missing local SEO page: ${slug}`);
  return page;
}

/** Merge page-specific + universal FAQs for AEO/GEO depth */
export function getExpandedLocalFaqs(page: LocalSeoPage) {
  const seen = new Set<string>();
  return [...page.faqs, ...UNIVERSAL_LOCAL_FAQS].filter((faq) => {
    if (seen.has(faq.question)) return false;
    seen.add(faq.question);
    return true;
  });
}

/**
 * The registered office is in Telhara and the Pune office has no published
 * street address (DESIGN.md §1.1), so Pune appears only as `areaServed`:
 * no GeoCoordinates, which would pin the business to a Pune map point.
 */
export function localBusinessSchemaForPage(page: LocalSeoPage) {
  // The offer catalog lists exactly the service rows the page renders (DESIGN.md §11.5).
  const offered = page.services.flatMap((slug) => services.filter((s) => s.slug === slug));
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/${page.slug}#localbusiness`,
    name: `${SITE_CONFIG.name} — ${page.title}`,
    description: page.description,
    url: `${SITE_CONFIG.url}/${page.slug}`,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    image: `${SITE_CONFIG.url}/brand/nexyyra-og.png`,
    priceRange: "₹₹₹₹",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.city,
      addressRegion: SITE_CONFIG.region,
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "City", name: "Pune" },
      { "@type": "State", name: "Maharashtra" },
    ],
    parentOrganization: { "@id": ORG_ID },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: page.serviceType,
      itemListElement: offered.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        // basePrice is a published starting price ("From ₹…"), so it is a minimum.
        priceSpecification: startingPriceSpecification(s.basePrice),
        itemOffered: { "@type": "Service", name: s.title, url: `${SITE_CONFIG.url}/services/${s.slug}` },
      })),
    },
  };
}
