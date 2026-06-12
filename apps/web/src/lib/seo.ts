import { Metadata } from "next";
import { SITE_CONFIG, SEO_KEYWORDS } from "./constants";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  path?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function generateSEO({
  title,
  description = SITE_CONFIG.description,
  keywords = SEO_KEYWORDS,
  image = "/logo.jpg",
  path = "",
  type = "website",
  noIndex = false,
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`;
  const url = `${SITE_CONFIG.url}${path}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      locale: "en_IN",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@glitzevents",
      site: "@glitzevents",
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    publisher: { "@id": `${SITE_CONFIG.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_CONFIG.url}/services?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
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
      "@type": "City",
      name: "Pune",
    },
    sameAs: Object.values(SITE_CONFIG.social),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "512",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "21:00",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function eventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  location: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    location: { "@type": "Place", name: event.location, address: { "@type": "PostalAddress", addressLocality: "Pune", addressCountry: "IN" } },
    image: event.image,
    organizer: { "@type": "Organization", name: SITE_CONFIG.name, url: SITE_CONFIG.url },
  };
}

export function serviceSchema(service: {
  name: string;
  description: string;
  slug: string;
  image?: string;
  price?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_CONFIG.url}/services/${service.slug}#service`,
    name: service.name,
    description: service.description,
    url: `${SITE_CONFIG.url}/services/${service.slug}`,
    image: service.image,
    provider: { "@id": `${SITE_CONFIG.url}/#organization` },
    areaServed: { "@type": "AdministrativeArea", name: "Maharashtra, India" },
    ...(service.price && {
      offers: {
        "@type": "Offer",
        price: service.price,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    }),
  };
}

export function reviewSchema(reviews: {
  author: string;
  reviewBody: string;
  ratingValue: number;
  datePublished?: string;
}[]) {
  return reviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: r.author },
    reviewBody: r.reviewBody,
    reviewRating: { "@type": "Rating", ratingValue: r.ratingValue, bestRating: 5 },
    itemReviewed: { "@id": `${SITE_CONFIG.url}/#organization` },
    ...(r.datePublished && { datePublished: r.datePublished }),
  }));
}

export function venueSchema(venue: {
  name: string;
  description: string;
  slug: string;
  city: string;
  capacity: number;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: venue.name,
    description: venue.description,
    url: `${SITE_CONFIG.url}/venues#${venue.slug}`,
    image: venue.image,
    maximumAttendeeCapacity: venue.capacity,
    address: {
      "@type": "PostalAddress",
      addressLocality: venue.city,
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
  };
}

/** AI-friendly entity block for GEO — clear definitions for LLM crawlers */
export function articleSchema(article: {
  title: string;
  description: string;
  slug: string;
  image: string;
  author: string;
  publishedAt: string;
  tags?: string[];
  section?: string;
  wordCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    author: { "@type": "Person", name: article.author },
    publisher: { "@id": `${SITE_CONFIG.url}/#organization` },
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: `${SITE_CONFIG.url}/blog/${article.slug}`,
    url: `${SITE_CONFIG.url}/blog/${article.slug}`,
    keywords: article.tags?.join(", "),
    articleSection: article.section,
    wordCount: article.wordCount,
    inLanguage: "en-IN",
    isAccessibleForFree: true,
  };
}

export function itemListSchema(items: { name: string; url: string; image?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${SITE_CONFIG.url}${item.url}`,
      ...(item.image && { image: item.image }),
    })),
  };
}

export function personSchema(person: {
  name: string;
  jobTitle: string;
  description: string;
  image?: string;
  url?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_CONFIG.url}/about#${person.name.replace(/\s+/g, "-").toLowerCase()}`,
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.description,
    image: person.image,
    url: person.url ?? `${SITE_CONFIG.url}/about`,
    worksFor: { "@id": `${SITE_CONFIG.url}/#organization` },
    ...(person.sameAs?.length && { sameAs: person.sameAs }),
  };
}

export function aboutPageSchema(
  team: { name: string; role: string; bio: string; image?: string }[],
  founderName: string,
) {
  const founder = team.find((m) => m.name === founderName) ?? team[0];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...organizationSchema(),
        founder: { "@id": `${SITE_CONFIG.url}/about#${founder.name.replace(/\s+/g, "-").toLowerCase()}` },
      },
      personSchema({
        name: founder.name,
        jobTitle: founder.role,
        description: founder.bio,
        image: founder.image,
        url: `${SITE_CONFIG.url}/about`,
      }),
      ...team.slice(0, 6).map((member) =>
        personSchema({
          name: member.name,
          jobTitle: member.role,
          description: member.bio,
          image: member.image,
          url: `${SITE_CONFIG.url}/about`,
        }),
      ),
    ],
  };
}

export function entityDefinitionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.shortName,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    foundingDate: "2012",
    knowsAbout: [
      "Luxury Wedding Planning",
      "Corporate Event Management",
      "Destination Weddings",
      "Concert Management",
      "Exhibition Management",
      "Celebrity Event Management",
      "Product Launch Events",
    ],
    slogan: SITE_CONFIG.tagline,
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 50 },
    award: [
      "Best Event Management Company — Event Industry Awards India 2025",
      "Luxury Wedding Planner of the Year — Wedding Sutra 2024",
    ],
  };
}
