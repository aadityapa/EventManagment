import { Metadata } from "next";
import { SITE_CONFIG, SEO_KEYWORDS, ENTITY_FACTS } from "./constants";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  path?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

const ORG_ID = `${SITE_CONFIG.url}/#organization`;
const WEBSITE_ID = `${SITE_CONFIG.url}/#website`;

export function generateSEO({
  title,
  description = SITE_CONFIG.description,
  keywords = SEO_KEYWORDS,
  image = "/brand/logo-primary.png",
  path = "",
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: SEOProps = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`;
  const url = `${SITE_CONFIG.url}${path}`;
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: authors?.map((name) => ({ name })) ?? [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: { canonical: url, languages: { "en-IN": url } },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      locale: "en_IN",
      type,
      ...(type === "article" && {
        publishedTime,
        modifiedTime: modifiedTime ?? publishedTime,
        authors: authors ?? [SITE_CONFIG.name],
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@nexyyraevents",
      site: "@nexyyraevents",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        },
    ...(googleVerification || bingVerification
      ? {
          verification: {
            ...(googleVerification && { google: googleVerification }),
            ...(bingVerification && { other: { "msvalidate.01": bingVerification } }),
          },
        }
      : {}),
  };
}

/** Consolidated global JSON-LD — single @graph for layout */
export function globalGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "EventPlanner", "Organization"],
        "@id": ORG_ID,
        name: SITE_CONFIG.legalName,
        alternateName: [SITE_CONFIG.name, SITE_CONFIG.shortName],
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        telephone: SITE_CONFIG.phone,
        email: SITE_CONFIG.email,
        image: `${SITE_CONFIG.url}/brand/logo-primary.png`,
        logo: `${SITE_CONFIG.url}/brand/logo-primary.png`,
        slogan: SITE_CONFIG.tagline,
        foundingDate: String(ENTITY_FACTS.foundingYear),
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
        areaServed: ENTITY_FACTS.serviceAreas.map((name) => ({ "@type": "Place", name })),
        sameAs: Object.values(SITE_CONFIG.social),
        knowsAbout: ENTITY_FACTS.knowsAbout,
        numberOfEmployees: { "@type": "QuantitativeValue", minValue: ENTITY_FACTS.teamSize },
        award: ENTITY_FACTS.awards,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Luxury Event Services",
          itemListElement: ENTITY_FACTS.knowsAbout.map((name, i) => ({
            "@type": "Offer",
            position: i + 1,
            itemOffered: { "@type": "Service", name, provider: { "@id": ORG_ID } },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        description: SITE_CONFIG.description,
        inLanguage: "en-IN",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": ORG_ID,
    name: SITE_CONFIG.legalName,
    alternateName: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    image: `${SITE_CONFIG.url}/brand/logo-primary.png`,
    slogan: SITE_CONFIG.tagline,
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
    areaServed: { "@type": "City", name: "Pune" },
    sameAs: Object.values(SITE_CONFIG.social),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "21:00",
    },
  };
}

export function entityDefinitionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_CONFIG.legalName,
    alternateName: [SITE_CONFIG.name, SITE_CONFIG.shortName],
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    foundingDate: String(ENTITY_FACTS.foundingYear),
    knowsAbout: ENTITY_FACTS.knowsAbout,
    slogan: SITE_CONFIG.tagline,
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: ENTITY_FACTS.teamSize },
    award: ENTITY_FACTS.awards,
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

export function qaPageSchema(qa: { question: string; answer: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: qa.question,
      text: qa.question,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
        url: `${SITE_CONFIG.url}${qa.url}`,
      },
    },
  };
}

export function howToSchema(howTo: {
  name: string;
  description: string;
  slug: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    description: howTo.description,
    url: `${SITE_CONFIG.url}/blog/${howTo.slug}`,
    inLanguage: "en-IN",
    step: howTo.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
    ...(howTo.totalTime && { totalTime: howTo.totalTime }),
    publisher: { "@id": ORG_ID },
  };
}

export function speakableWebPageSchema(path: string, cssSelectors: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_CONFIG.url}${path}#webpage`,
    url: `${SITE_CONFIG.url}${path}`,
    name: SITE_CONFIG.name,
    isPartOf: { "@id": WEBSITE_ID },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
    inLanguage: "en-IN",
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_CONFIG.url}/contact#webpage`,
    url: `${SITE_CONFIG.url}/contact`,
    name: `Contact ${SITE_CONFIG.name}`,
    description: `Contact ${SITE_CONFIG.name} for luxury wedding and corporate event planning in Pune, Maharashtra.`,
    mainEntity: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };
}

export function collectionPageSchema(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_CONFIG.url}${path}#webpage`,
    url: `${SITE_CONFIG.url}${path}`,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
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
    location: {
      "@type": "Place",
      name: event.location,
      address: { "@type": "PostalAddress", addressLocality: "Pune", addressCountry: "IN" },
    },
    image: event.image,
    organizer: { "@id": ORG_ID },
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
    provider: { "@id": ORG_ID },
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
    itemReviewed: { "@id": ORG_ID },
    ...(r.datePublished && { datePublished: r.datePublished }),
  }));
}

export function aggregateRatingSchema(ratingValue: number, reviewCount: number) {
  return {
    "@type": "AggregateRating",
    ratingValue: String(ratingValue),
    reviewCount: String(reviewCount),
    bestRating: "5",
  };
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

export function articleSchema(article: {
  title: string;
  description: string;
  slug: string;
  image: string;
  author: string;
  publishedAt: string;
  modifiedAt?: string;
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
    author: {
      "@type": "Person",
      name: article.author,
      url: `${SITE_CONFIG.url}/about`,
      worksFor: { "@id": ORG_ID },
    },
    publisher: { "@id": ORG_ID },
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt ?? article.publishedAt,
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
      url: item.url.startsWith("http") ? item.url : `${SITE_CONFIG.url}${item.url}`,
      ...(item.image && { image: item.image }),
    })),
  };
}

export function creativeWorkSchema(work: {
  name: string;
  description: string;
  slug: string;
  image: string;
  location?: string;
  genre?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.name,
    description: work.description,
    url: `${SITE_CONFIG.url}/portfolio/${work.slug}`,
    image: work.image,
    creator: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
    ...(work.location && { contentLocation: { "@type": "Place", name: work.location } }),
    ...(work.genre && { genre: work.genre }),
  };
}

export function offerCatalogSchema(
  offers: { name: string; description: string; price: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `${SITE_CONFIG.name} Investment Collections`,
    itemListElement: offers.map((o, i) => ({
      "@type": "Offer",
      position: i + 1,
      name: o.name,
      description: o.description,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "INR",
        description: o.price,
      },
      seller: { "@id": ORG_ID },
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
    worksFor: { "@id": ORG_ID },
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
        "@type": "AboutPage",
        "@id": `${SITE_CONFIG.url}/about#webpage`,
        url: `${SITE_CONFIG.url}/about`,
        name: `About ${SITE_CONFIG.name}`,
        mainEntity: { "@id": ORG_ID },
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

/** Inject multiple JSON-LD blocks as React-safe script elements */
export function jsonLdScripts(...schemas: object[]) {
  return schemas.map((schema, i) => ({
    key: `jsonld-${i}`,
    html: JSON.stringify(schema),
  }));
}
