import { SITE_CONFIG } from "./constants";
import { UNIVERSAL_LOCAL_FAQS } from "./geo-content";

export interface LocationPage {
  slug: string;
  city: string;
  state: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  intro: string;
  highlights: string[];
  faqs: { question: string; answer: string }[];
  geo: { latitude: number; longitude: number };
}

export const LOCATION_PAGES: LocationPage[] = [
  {
    slug: "pune",
    city: "Pune",
    state: "Maharashtra",
    title: "Luxury Event Planner Pune",
    h1: "Luxury Event Planner in Pune",
    description:
      "Nexyyra Events — Pune's premier luxury event planner for weddings, corporate galas, exhibitions, and destination celebrations since 2012.",
    keywords: ["Event Planner Pune", "Wedding Planner Pune", "Luxury Events Pune"],
    intro:
      "Headquartered in Pune, Nexyyra Events is Maharashtra's trusted luxury event management company — delivering 1,800+ weddings, corporate experiences, and entertainment productions with white-glove precision.",
    highlights: [
      "Pune-based planning studio with on-ground execution crews",
      "Heritage venues, five-star hotels, and farmhouse partnerships across Pune",
      "Wedding, corporate, concert, and exhibition specialists",
      "4.9-star rating across 500+ client reviews",
    ],
    faqs: [
      {
        question: "Why is Nexyyra considered a top event planner in Pune?",
        answer:
          "Nexyyra combines luxury design, vetted vendor networks, and military-precision operations — with local venue expertise and awards including Best Event Management Company India 2025.",
      },
    ],
    geo: { latitude: 18.5204, longitude: 73.8567 },
  },
  {
    slug: "mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    title: "Luxury Event Planner Mumbai",
    h1: "Luxury Event Planner in Mumbai",
    description:
      "Premium wedding and corporate event planning in Mumbai — five-star galas, celebrity events, product launches, and luxury weddings by Nexyyra Events.",
    keywords: ["Event Planner Mumbai", "Wedding Planner Mumbai", "Corporate Events Mumbai"],
    intro:
      "Nexyyra Events serves Mumbai's most discerning clients with luxury wedding planning, corporate conferences, brand activations, and celebrity event management across South Mumbai, Bandra, Juhu, and Navi Mumbai venues.",
    highlights: [
      "Five-star hotel and ballroom partnerships across Mumbai",
      "Corporate galas for leading brands and financial institutions",
      "Celebrity entertainment and VIP guest management",
      "End-to-end production with redundant AV systems",
    ],
    faqs: [
      {
        question: "Does Nexyyra plan events in Mumbai?",
        answer:
          "Yes. We plan and execute luxury weddings, corporate events, product launches, and award ceremonies across Mumbai and Navi Mumbai, coordinated from our Pune headquarters with dedicated Mumbai on-ground teams.",
      },
    ],
    geo: { latitude: 19.076, longitude: 72.8777 },
  },
  {
    slug: "nashik",
    city: "Nashik",
    state: "Maharashtra",
    title: "Wedding & Event Planner Nashik",
    h1: "Luxury Event Planner in Nashik",
    description:
      "Luxury wedding and corporate event planning in Nashik — vineyard weddings, resort celebrations, and corporate retreats by Nexyyra Events.",
    keywords: ["Wedding Planner Nashik", "Event Management Nashik", "Vineyard Wedding Nashik"],
    intro:
      "Nexyyra Events brings luxury event planning to Nashik — from vineyard weddings and resort celebrations to corporate retreats and cultural festivals across the wine country region.",
    highlights: [
      "Vineyard and resort wedding expertise",
      "Corporate off-sites and dealer meets",
      "Multi-day celebration planning",
      "Guest logistics and hospitality management",
    ],
    faqs: [
      {
        question: "Can Nexyyra plan vineyard weddings in Nashik?",
        answer:
          "Yes. We specialise in vineyard and resort weddings in Nashik with bespoke décor, wine-pairing dinners, and guest accommodation coordination.",
      },
    ],
    geo: { latitude: 19.9975, longitude: 73.7898 },
  },
  {
    slug: "nagpur",
    city: "Nagpur",
    state: "Maharashtra",
    title: "Event Management Nagpur",
    h1: "Luxury Event Management in Nagpur",
    description:
      "Premium event management in Nagpur — weddings, corporate conferences, exhibitions, and cultural celebrations by Nexyyra Events.",
    keywords: ["Event Management Nagpur", "Wedding Planner Nagpur", "Corporate Events Nagpur"],
    intro:
      "Nexyyra Events delivers luxury event management across Nagpur and Central India — weddings, corporate conferences, exhibitions, and award ceremonies with full production capabilities.",
    highlights: [
      "Corporate conference and exhibition management",
      "Luxury wedding planning for Nagpur families",
      "Central India venue partnerships",
      "Travel and logistics coordination",
    ],
    faqs: [
      {
        question: "Does Nexyyra serve clients in Nagpur?",
        answer:
          "Yes. We plan weddings, corporate events, and exhibitions in Nagpur with dedicated on-ground teams and vendor networks across Central Maharashtra.",
      },
    ],
    geo: { latitude: 21.1458, longitude: 79.0882 },
  },
  {
    slug: "ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    title: "Luxury Wedding Planner Ahmedabad",
    h1: "Luxury Event Planner in Ahmedabad",
    description:
      "Luxury wedding and corporate event planning in Ahmedabad — heritage celebrations, corporate galas, and brand activations by Nexyyra Events.",
    keywords: ["Wedding Planner Ahmedabad", "Event Planner Gujarat", "Corporate Events Ahmedabad"],
    intro:
      "Nexyyra Events serves Ahmedabad and Gujarat with luxury wedding planning, corporate galas, product launches, and cultural celebrations — blending Marathi and Gujarati hospitality traditions.",
    highlights: [
      "Heritage and palace venue partnerships in Gujarat",
      "Corporate events for Ahmedabad's business community",
      "Multi-cultural wedding expertise",
      "Destination coordination from Pune HQ",
    ],
    faqs: [
      {
        question: "Does Nexyyra plan weddings in Ahmedabad?",
        answer:
          "Yes. We plan luxury weddings and corporate events in Ahmedabad and across Gujarat, handling venue sourcing, vendor curation, and on-ground execution.",
      },
    ],
    geo: { latitude: 23.0225, longitude: 72.5714 },
  },
  {
    slug: "surat",
    city: "Surat",
    state: "Gujarat",
    title: "Event Planner Surat",
    h1: "Luxury Event Planner in Surat",
    description:
      "Premium event planning in Surat — luxury weddings, corporate events, and diamond industry galas by Nexyyra Events.",
    keywords: ["Event Planner Surat", "Wedding Planner Surat", "Corporate Events Surat"],
    intro:
      "Nexyyra Events delivers luxury event planning in Surat for weddings, corporate galas, dealer meets, and industry celebrations — with expertise in large-scale guest management.",
    highlights: [
      "Large guest-count wedding expertise",
      "Corporate dealer meets and industry galas",
      "Surat venue and vendor partnerships",
      "Entertainment and stage production",
    ],
    faqs: [
      {
        question: "Can Nexyyra manage large weddings in Surat?",
        answer:
          "Yes. We specialise in large-scale luxury weddings in Surat with dedicated guest hospitality teams, multi-venue coordination, and premium entertainment production.",
      },
    ],
    geo: { latitude: 21.1702, longitude: 72.8311 },
  },
  {
    slug: "goa",
    city: "Goa",
    state: "Goa",
    title: "Destination Wedding Planner Goa",
    h1: "Destination Wedding Planner in Goa",
    description:
      "Beach and resort destination weddings in Goa — luxury planning, guest logistics, and multi-day celebrations by Nexyyra Events.",
    keywords: ["Destination Wedding Goa", "Beach Wedding Planner Goa", "Resort Wedding Goa"],
    intro:
      "Nexyyra Events is a leading destination wedding planner for Goa — beachfront ceremonies, resort celebrations, and multi-day parties with full guest travel and hospitality management.",
    highlights: [
      "Beachfront and resort venue partnerships",
      "Guest travel, RSVP, and accommodation coordination",
      "Sangeet, ceremony, and reception production",
      "Legal and permit liaison for beach events",
    ],
    faqs: [
      {
        question: "What Goa wedding venues does Nexyyra recommend?",
        answer:
          "We partner with premium beach resorts, heritage properties, and private villas across North and South Goa — selected based on guest count, budget, and design vision.",
      },
    ],
    geo: { latitude: 15.2993, longitude: 74.124 },
  },
  {
    slug: "udaipur",
    city: "Udaipur",
    state: "Rajasthan",
    title: "Palace Wedding Planner Udaipur",
    h1: "Palace Wedding Planner in Udaipur",
    description:
      "Heritage palace weddings in Udaipur — royal celebrations, guest logistics, and luxury production by Nexyyra Events.",
    keywords: ["Palace Wedding Udaipur", "Destination Wedding Udaipur", "Luxury Wedding Rajasthan"],
    intro:
      "Nexyyra Events crafts palace-scale destination weddings in Udaipur — heritage venue partnerships, royal décor, celebrity entertainment, and white-glove guest hospitality on the lakes.",
    highlights: [
      "Heritage palace and luxury hotel partnerships",
      "Royal-themed décor and cultural programming",
      "Multi-day palace wedding itineraries",
      "Guest concierge and travel coordination",
    ],
    faqs: [
      {
        question: "How much does a palace wedding in Udaipur cost?",
        answer:
          "Palace weddings in Udaipur with Nexyyra typically range from ₹40 lakhs to ₹4 crore+ depending on palace, guest count, décor, and entertainment. Complimentary consultations include tailored proposals.",
      },
    ],
    geo: { latitude: 24.5854, longitude: 73.7125 },
  },
];

export function getLocationPage(slug: string): LocationPage | undefined {
  return LOCATION_PAGES.find((p) => p.slug === slug);
}

export function getExpandedLocationFaqs(page: LocationPage) {
  const seen = new Set<string>();
  return [...page.faqs, ...UNIVERSAL_LOCAL_FAQS].filter((faq) => {
    if (seen.has(faq.question)) return false;
    seen.add(faq.question);
    return true;
  });
}

export function locationBusinessSchema(page: LocationPage) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/locations/${page.slug}#localbusiness`,
    name: `${SITE_CONFIG.name} — ${page.city}`,
    description: page.description,
    url: `${SITE_CONFIG.url}/locations/${page.slug}`,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    image: `${SITE_CONFIG.url}/brand/logo-primary.png`,
    priceRange: "₹₹₹₹",
    address: {
      "@type": "PostalAddress",
      addressLocality: page.city,
      addressRegion: page.state,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: page.geo.latitude,
      longitude: page.geo.longitude,
    },
    areaServed: { "@type": "City", name: page.city },
    parentOrganization: { "@id": `${SITE_CONFIG.url}/#organization` },
  };
}
