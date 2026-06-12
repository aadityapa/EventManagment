import { SITE_CONFIG } from "./constants";

export interface LocalSeoPage {
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  serviceType: string;
  intro: string;
  highlights: string[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
}

export const LOCAL_SEO_PAGES: LocalSeoPage[] = [
  {
    slug: "event-management-company-pune",
    title: "Event Management Company Pune",
    h1: "Premier Event Management Company in Pune",
    description:
      "Glitz Events & Promotions is Pune's leading luxury event management company — weddings, corporate galas, concerts, exhibitions, and destination celebrations with 12+ years of excellence.",
    keywords: [
      "Event Management Company Pune",
      "Best Event Planner Pune",
      "Luxury Event Management Pune",
      "Event Organiser Pune Maharashtra",
    ],
    serviceType: "EventManagementService",
    intro:
      "Glitz Events & Promotions is a full-service event management company headquartered in Pune, Maharashtra. We design and deliver luxury weddings, corporate conferences, product launches, concerts, and brand activations for clients across India and abroad.",
    highlights: [
      "1,000+ events delivered across 35+ cities",
      "Dedicated Pune-based planning team with on-ground execution crews",
      "End-to-end vendor, venue, and logistics management",
      "Corporate, wedding, and entertainment event specialists",
    ],
    faqs: [
      {
        question: "Why choose Glitz as your event management company in Pune?",
        answer:
          "Glitz Events combines luxury design sensibility with military-precision operations. Our Pune team offers local venue knowledge, vetted vendor networks, and a 4.9-star client rating across 500+ reviews.",
      },
      {
        question: "What types of events does Glitz manage in Pune?",
        answer:
          "We manage weddings, corporate events, product launches, exhibitions, concerts, award functions, birthday celebrations, fashion shows, and destination events throughout Pune and Maharashtra.",
      },
    ],
    relatedLinks: [
      { href: "/wedding-planner-pune", label: "Wedding Planner Pune" },
      { href: "/corporate-event-management-pune", label: "Corporate Events Pune" },
      { href: "/services", label: "All Services" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    slug: "wedding-planner-pune",
    title: "Wedding Planner Pune",
    h1: "Luxury Wedding Planner in Pune",
    description:
      "Award-winning wedding planner in Pune specialising in luxury ceremonies, destination weddings, and bespoke celebrations. Full planning from mehendi to reception.",
    keywords: [
      "Wedding Planner Pune",
      "Luxury Wedding Planner Pune",
      "Best Wedding Planner Maharashtra",
      "Destination Wedding Planner Pune",
    ],
    serviceType: "WeddingPlanningService",
    intro:
      "As Pune's trusted luxury wedding planner, Glitz Events crafts bespoke celebrations that reflect your love story. From intimate ceremonies to palace-scale destination weddings, every floral detail, guest experience, and cultural ritual is orchestrated with obsessive precision.",
    highlights: [
      "Full-service wedding planning and day-of coordination",
      "Destination wedding expertise — Udaipur, Goa, Lonavala, and international venues",
      "Curated vendor network: decorators, photographers, caterers, entertainment",
      "Featured in Vogue India and Wedding Sutra",
    ],
    faqs: [
      {
        question: "How much does a wedding planner cost in Pune?",
        answer:
          "Glitz wedding planning packages start from ₹8 lakhs for full-service planning. Custom packages are available based on guest count, venue, and design scope. Book a free consultation for a tailored quote.",
      },
      {
        question: "Do you plan destination weddings from Pune?",
        answer:
          "Yes. We plan destination weddings across India and internationally, handling travel logistics, guest hospitality, venue sourcing, and on-ground execution from our Pune headquarters.",
      },
    ],
    relatedLinks: [
      { href: "/destination-wedding-planner-pune", label: "Destination Weddings" },
      { href: "/luxury-wedding-planner-maharashtra", label: "Luxury Weddings Maharashtra" },
      { href: "/venues", label: "Wedding Venues" },
      { href: "/book-event", label: "Book Consultation" },
    ],
  },
  {
    slug: "corporate-event-management-pune",
    title: "Corporate Event Management Pune",
    h1: "Corporate Event Management in Pune",
    description:
      "Pune's premier corporate event management company — conferences, annual days, product launches, award ceremonies, and team-building events for leading brands.",
    keywords: [
      "Corporate Event Management Pune",
      "Corporate Event Planner Pune",
      "Conference Organizer Pune",
      "Annual Day Event Planner Pune",
    ],
    serviceType: "CorporateEventService",
    intro:
      "Glitz Events & Promotions delivers corporate event management in Pune for India's leading brands. From 50-person leadership retreats to 5,000-delegate conferences, we combine strategic event design with flawless AV production and guest experience management.",
    highlights: [
      "Conference and summit management up to 5,000 attendees",
      "Product launch and brand activation expertise",
      "Award ceremony and annual day production",
      "Trusted by Tata Group, Reliance, and leading IT companies",
    ],
    faqs: [
      {
        question: "What corporate events does Glitz manage in Pune?",
        answer:
          "We manage conferences, annual general meetings, product launches, team-building events, award functions, dealer meets, and executive galas for corporate clients across Pune and Maharashtra.",
      },
      {
        question: "Can Glitz handle hybrid and virtual corporate events?",
        answer:
          "Yes. We provide live streaming, virtual platform integration, and hybrid event production with redundant AV systems and dedicated technical directors.",
      },
    ],
    relatedLinks: [
      { href: "/services/corporate-events", label: "Corporate Events Service" },
      { href: "/services/product-launches", label: "Product Launches" },
      { href: "/portfolio", label: "Corporate Portfolio" },
      { href: "/contact", label: "Request Quote" },
    ],
  },
  {
    slug: "luxury-wedding-planner-maharashtra",
    title: "Luxury Wedding Planner Maharashtra",
    h1: "Luxury Wedding Planner in Maharashtra",
    description:
      "Maharashtra's premier luxury wedding planner — palace weddings in Udaipur, beach celebrations in Goa, and grand Pune ceremonies with white-glove service.",
    keywords: [
      "Luxury Wedding Planner Maharashtra",
      "Premium Wedding Planner India",
      "Palace Wedding Planner",
      "High End Wedding Planner Pune",
    ],
    serviceType: "WeddingPlanningService",
    intro:
      "Glitz Events & Promotions is Maharashtra's choice for luxury wedding planning. We serve discerning families across Mumbai, Pune, Nashik, and beyond — delivering palace-scale celebrations, celebrity entertainment, and bespoke design that sets new standards in Indian wedding excellence.",
    highlights: [
      "Luxury Wedding Planner of the Year — Wedding Sutra 2024",
      "Heritage palace and five-star venue partnerships across Maharashtra",
      "Celebrity entertainment and VIP guest management",
      "Budgets from ₹40 lakhs to ₹4 crore+",
    ],
    faqs: [
      {
        question: "Which cities in Maharashtra does Glitz serve for weddings?",
        answer:
          "We plan luxury weddings across Pune, Mumbai, Nashik, Lonavala, Mahabaleshwar, and destination venues throughout Maharashtra including coastal Goa and heritage Rajasthan.",
      },
      {
        question: "What makes Glitz a luxury wedding planner?",
        answer:
          "Our luxury approach combines bespoke design, white-glove guest hospitality, celebrity vendor networks, and a dedicated planning team with a minimum 1:50 planner-to-guest ratio for premium events.",
      },
    ],
    relatedLinks: [
      { href: "/wedding-planner-pune", label: "Wedding Planner Pune" },
      { href: "/destination-wedding-planner-pune", label: "Destination Weddings" },
      { href: "/pricing", label: "Wedding Packages" },
      { href: "/testimonials", label: "Client Reviews" },
    ],
  },
  {
    slug: "exhibition-management-pune",
    title: "Exhibition Management Pune",
    h1: "Exhibition Management Company in Pune",
    description:
      "Professional exhibition management in Pune — booth design, floor planning, lead capture, setup, and teardown for trade shows and brand exhibitions.",
    keywords: [
      "Exhibition Management Pune",
      "Trade Show Organizer Pune",
      "Exhibition Stall Design Pune",
      "Expo Management Maharashtra",
    ],
    serviceType: "ExhibitionEventService",
    intro:
      "Glitz Events delivers end-to-end exhibition management in Pune for trade shows, brand expos, and industry conferences. From stunning booth design to lead capture systems and seamless setup, we help brands stand out on the exhibition floor.",
    highlights: [
      "Custom booth and pavilion design",
      "Floor planning and traffic flow optimisation",
      "Lead capture and post-event analytics",
      "Experience with Auto Expo, IT exhibitions, and pharma trade shows",
    ],
    faqs: [
      {
        question: "What exhibition services does Glitz provide in Pune?",
        answer:
          "We provide booth design, fabrication, floor planning, staffing, lead capture, AV integration, setup/teardown, and post-event reporting for exhibitions and trade shows in Pune and across India.",
      },
      {
        question: "How far in advance should we book exhibition management?",
        answer:
          "We recommend booking 8–12 weeks before the exhibition date for custom booth design. Standard packages can be arranged with 4–6 weeks notice depending on availability.",
      },
    ],
    relatedLinks: [
      { href: "/services/exhibitions", label: "Exhibition Service" },
      { href: "/corporate-event-management-pune", label: "Corporate Events Pune" },
      { href: "/portfolio", label: "Exhibition Portfolio" },
      { href: "/contact", label: "Get a Quote" },
    ],
  },
  {
    slug: "destination-wedding-planner-pune",
    title: "Destination Wedding Planner Pune",
    h1: "Destination Wedding Planner from Pune",
    description:
      "Plan your dream destination wedding from Pune — Udaipur palaces, Goa beaches, international venues. Full logistics, guest management, and luxury execution.",
    keywords: [
      "Destination Wedding Planner Pune",
      "Destination Wedding Planner India",
      "International Wedding Planner Pune",
      "Beach Wedding Planner India",
    ],
    serviceType: "WeddingPlanningService",
    intro:
      "Based in Pune, Glitz Events & Promotions specialises in destination wedding planning across India and internationally. We handle venue sourcing, guest travel logistics, multi-day itinerary design, and on-ground execution so you can focus on celebrating.",
    highlights: [
      "Udaipur, Goa, Kerala, Rajasthan, and international destinations",
      "Guest travel, accommodation, and RSVP management",
      "Multi-day celebration planning — mehendi, sangeet, ceremony, reception",
      "Legal and cultural liaison for international ceremonies",
    ],
    faqs: [
      {
        question: "What destination wedding locations does Glitz recommend?",
        answer:
          "Popular destinations include Udaipur heritage palaces, Goa beachfront resorts, Lonavala hill stations, Kerala backwaters, and international venues in Dubai, Bali, and Thailand.",
      },
      {
        question: "How does Glitz manage guest logistics for destination weddings?",
        answer:
          "We provide dedicated guest concierge, group travel coordination, welcome kits, RSVP tracking, and on-site hospitality teams to ensure every guest enjoys a seamless experience.",
      },
    ],
    relatedLinks: [
      { href: "/wedding-planner-pune", label: "Wedding Planner Pune" },
      { href: "/luxury-wedding-planner-maharashtra", label: "Luxury Weddings" },
      { href: "/services/destination-weddings", label: "Destination Wedding Service" },
      { href: "/book-event", label: "Plan Your Wedding" },
    ],
  },
];

export function getLocalSeoPage(slug: string): LocalSeoPage | undefined {
  return LOCAL_SEO_PAGES.find((p) => p.slug === slug);
}

export function localBusinessSchemaForPage(page: LocalSeoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/${page.slug}#localbusiness`,
    name: `${SITE_CONFIG.name} — ${page.title}`,
    description: page.description,
    url: `${SITE_CONFIG.url}/${page.slug}`,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    image: `${SITE_CONFIG.url}/logo.jpg`,
    priceRange: "₹₹₹₹",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.city,
      addressRegion: SITE_CONFIG.region,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 18.5204,
      longitude: 73.8567,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Maharashtra, India",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: page.serviceType,
      itemListElement: page.highlights.map((h, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: h },
      })),
    },
  };
}
