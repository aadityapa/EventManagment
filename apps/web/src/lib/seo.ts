import { Metadata } from "next";
import { services } from "@/data/cms";
import { SITE_CONFIG, ENTITY_FACTS } from "./constants";

/** Static OG fallback (1200×630). Route-level opengraph-image.tsx files override it. */
const DEFAULT_OG_IMAGE = "/brand/og-default.png";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  twitterImage?: string;
  path?: string;
  type?: "website" | "article";
  /**
   * Keep the page out of the index. Unless `canonicalPath` is given, the page
   * also declares no canonical or og:url: a noindex page should not point
   * search engines (or share cards) at another URL.
   */
  noIndex?: boolean;
  /** Robots `follow`; defaults to `!noIndex`. Listing filters are noindex but follow, so their links stay crawlable. */
  follow?: boolean;
  /** Canonical (and og:url) when it differs from `path`, e.g. a filtered listing pointing at its unfiltered base. */
  canonicalPath?: string;
  /**
   * The 404 page. Next.js injects `<meta name="robots" content="noindex">` on
   * every 404 response, so emit no robots tag of our own (never two) and no
   * canonical or og:url.
   */
  notFound?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

const SEO_BRAND = "Nexyyra Events";
/** Search results show about 60–65 characters of a title before cutting it. */
const MAX_TITLE = 65;
const MAX_DESCRIPTION = 160;

function warnInDev(message: string) {
  if (process.env.NODE_ENV !== "production") console.warn(`[seo] ${message}`);
}

/** "Title | Nexyyra Events", or the bare title when the suffix would push it past 65 characters. */
function composeTitle(title?: string): string {
  if (!title) return `${SEO_BRAND} | ${SITE_CONFIG.tagline}`;
  const branded = `${title} | ${SEO_BRAND}`;
  if (branded.length <= MAX_TITLE) return branded;
  warnInDev(`title is over ${MAX_TITLE} characters with the brand suffix — shorten it: "${branded}"`);
  return title;
}

/**
 * Descriptions are authored as complete sentences of 160 characters or fewer.
 * If one runs long, keep the whole sentences that fit — never cut mid-sentence
 * and append "…" — and warn in development so the copy gets rewritten.
 */
function fitDescription(text: string): string {
  if (text.length <= MAX_DESCRIPTION) return text;
  warnInDev(`description is over ${MAX_DESCRIPTION} characters — rewrite it: "${text}"`);
  let fitted = "";
  for (const sentence of text.match(/[^.!?]*[.!?]+(?:\s+|$)/g) ?? []) {
    if ((fitted + sentence).trimEnd().length > MAX_DESCRIPTION) break;
    fitted += sentence;
  }
  return fitted.trimEnd() || text;
}

/**
 * The twelve services as published in data/cms.ts — the only topic and offer
 * list the schema and meta keywords may state.
 */
const SERVICE_TITLES = services.map((s) => s.title);

const DEFAULT_KEYWORDS = [
  "Nexyyra Events",
  "Event Management Company Pune",
  "Luxury Event Planner Pune",
  "Wedding Planner Pune",
  "Destination Wedding Planner India",
  ...SERVICE_TITLES,
];

/**
 * A published "From ₹…" price. Every price on the site is a starting point,
 * so the amount is a minimum (minPrice), never an exact Offer.price.
 */
export function startingPriceSpecification(minPrice: number) {
  return { "@type": "PriceSpecification", minPrice, priceCurrency: "INR" };
}

/** "₹10 Lakhs" → 1000000, "₹1 Crore+" → 10000000 (the BRAND_INVESTMENTS `from` labels). */
function rupeesFromLabel(label: string): number | undefined {
  const match = /₹\s*([\d.,]+)\s*(lakhs?|l\b|crores?|cr\b)?/i.exec(label);
  if (!match) return undefined;
  const amount = Number(match[1].replace(/,/g, ""));
  const unit = match[2]?.toLowerCase() ?? "";
  if (unit.startsWith("c")) return amount * 1_00_00_000;
  if (unit.startsWith("l")) return amount * 1_00_000;
  return amount;
}

/** The global Organization node's @id — reference it instead of emitting a second Organization. */
export const ORG_ID = `${SITE_CONFIG.url}/#organization`;
const LOCAL_BUSINESS_ID = `${SITE_CONFIG.url}/#localbusiness`;
const WEBSITE_ID = `${SITE_CONFIG.url}/#website`;


export function generateSEO({
  title,
  description = SITE_CONFIG.description,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_OG_IMAGE,
  twitterImage = DEFAULT_OG_IMAGE,
  path = "",
  type = "website",
  noIndex = false,
  follow = !noIndex,
  canonicalPath,
  notFound = false,
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: SEOProps = {}): Metadata {
  const fullTitle = composeTitle(title);
  const metaDescription = fitDescription(description);
  const canonical =
    notFound || (noIndex && canonicalPath === undefined) ? null : `${SITE_CONFIG.url}${canonicalPath ?? path}`;
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
  const pinterestVerification = process.env.NEXT_PUBLIC_PINTEREST_SITE_VERIFICATION;
  const yandexVerification = process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION;

  const verificationOther: Record<string, string> = {};
  if (bingVerification) verificationOther["msvalidate.01"] = bingVerification;
  if (pinterestVerification) verificationOther["p:domain_verify"] = pinterestVerification;

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: keywords.join(", "),
    authors: authors?.map((name) => ({ name })) ?? [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),
    // null (not undefined) so a noindex page does not inherit the layout's homepage canonical.
    alternates: canonical ? { canonical, languages: { "en-IN": canonical } } : null,
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      ...(canonical && { url: canonical }),
      siteName: SITE_CONFIG.shortName,
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
      description: metaDescription,
      images: [twitterImage],
      // creator/site handles removed — no verified X/Twitter profile on record.
      // EXTERNAL INPUT REQUIRED: restore once an official @handle exists.
    },
    robots: notFound
      ? null
      : noIndex
        ? { index: false, follow }
        : {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
          },
    ...(googleVerification || bingVerification || pinterestVerification || yandexVerification
      ? {
          verification: {
            ...(googleVerification && { google: googleVerification }),
            ...(yandexVerification && { yandex: yandexVerification }),
            ...(Object.keys(verificationOther).length > 0 && { other: verificationOther }),
          },
        }
      : {}),
  };
}

/** Consolidated global JSON-LD — single @graph for layout (Organization, LocalBusiness, WebSite). */
export function globalGraphSchema() {
  const { "@context": _epsCtx, ...eventPlanningNode } = eventPlanningServiceSchema();
  void _epsCtx;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        // Display brand as name; legal entity carried by legalName (Google entity guidance).
        name: SITE_CONFIG.shortName,
        legalName: SITE_CONFIG.legalName,
        alternateName: [SITE_CONFIG.legalName, "Nexyyra"],
        identifier: {
          "@type": "PropertyValue",
          propertyID: "CIN",
          value: SITE_CONFIG.cin,
        },
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        telephone: SITE_CONFIG.phone,
        email: SITE_CONFIG.email,
        image: `${SITE_CONFIG.url}${DEFAULT_OG_IMAGE}`,
        logo: `${SITE_CONFIG.url}/brand/nexyyra-logo-dark.svg`,
        slogan: SITE_CONFIG.tagline,
        sameAs: Object.values(SITE_CONFIG.social),
        knowsAbout: SERVICE_TITLES,
        // numberOfEmployees / award / aggregateRating / founder / employee removed —
        // unverified claims. No Person nodes anywhere until a name is verified
        // against the MCA filing and shown on the page.
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: SITE_CONFIG.phone,
            contactType: "customer service",
            email: SITE_CONFIG.email,
            areaServed: "IN",
            availableLanguage: ENTITY_FACTS.languages,
          },
          {
            "@type": "ContactPoint",
            telephone: SITE_CONFIG.whatsapp,
            contactType: "sales",
            contactOption: "https://schema.org/WhatsApp",
            areaServed: "IN",
          },
        ],
        // The twelve published services, each with its page. Prices stay on
        // /pricing and the service pages, where they are rendered.
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Event services",
          itemListElement: services.map((s, i) => ({
            "@type": "Offer",
            position: i + 1,
            itemOffered: {
              "@type": "Service",
              name: s.title,
              url: `${SITE_CONFIG.url}/services/${s.slug}`,
              provider: { "@id": ORG_ID },
            },
          })),
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": LOCAL_BUSINESS_ID,
        name: SITE_CONFIG.shortName,
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        telephone: SITE_CONFIG.phone,
        email: SITE_CONFIG.email,
        image: `${SITE_CONFIG.url}${DEFAULT_OG_IMAGE}`,
        priceRange: "₹₹₹₹",
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE_CONFIG.streetAddress,
          addressLocality: SITE_CONFIG.city,
          addressRegion: SITE_CONFIG.region,
          postalCode: SITE_CONFIG.postalCode,
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 21.03,
          longitude: 76.84,
        },
        areaServed: ENTITY_FACTS.serviceAreas.map((name) => ({ "@type": "Place", name })),
        parentOrganization: { "@id": ORG_ID },
        additionalType: ["https://schema.org/EventPlanner", "https://schema.org/ProfessionalService"],
      },
      eventPlanningNode,
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_CONFIG.shortName,
        alternateName: [SITE_CONFIG.legalName, "Nexyyra"],
        url: SITE_CONFIG.url,
        description: SITE_CONFIG.description,
        inLanguage: "en-IN",
        publisher: { "@id": ORG_ID },
        // Sitelinks SearchAction removed — deprecated by Google (no longer surfaced).
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_CONFIG.shortName,
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
    "@id": LOCAL_BUSINESS_ID,
    name: SITE_CONFIG.shortName,
    alternateName: SITE_CONFIG.legalName,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "CIN",
      value: SITE_CONFIG.cin,
    },
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    image: `${SITE_CONFIG.url}${DEFAULT_OG_IMAGE}`,
    slogan: SITE_CONFIG.tagline,
    priceRange: "₹₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.streetAddress,
      addressLocality: SITE_CONFIG.city,
      addressRegion: SITE_CONFIG.region,
      postalCode: SITE_CONFIG.postalCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 21.03,
      longitude: 76.84,
    },
    areaServed: { "@type": "City", name: "Pune" },
    sameAs: Object.values(SITE_CONFIG.social),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "21:00",
    },
    parentOrganization: { "@id": ORG_ID },
  };
}

export function entityDefinitionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_CONFIG.shortName,
    alternateName: [SITE_CONFIG.legalName, "Nexyyra"],
    identifier: {
      "@type": "PropertyValue",
      propertyID: "CIN",
      value: SITE_CONFIG.cin,
    },
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    knowsAbout: SERVICE_TITLES,
    slogan: SITE_CONFIG.tagline,
    // numberOfEmployees / award removed — pending verification (see remediation report).
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

/** WebPage + speakable. `name` is the page's own title (its H1), never the company name. */
export function speakableWebPageSchema(path: string, cssSelectors: string[], name?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_CONFIG.url}${path}#webpage`,
    url: `${SITE_CONFIG.url}${path}`,
    ...(name && { name }),
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

type CollectionPageInput = { name: string; description: string; path: string };

/** CollectionPage node — object form `({ name, description, path })` or legacy positional args. */
export function collectionPageSchema(page: CollectionPageInput): Record<string, unknown>;
export function collectionPageSchema(name: string, path: string, description: string): Record<string, unknown>;
export function collectionPageSchema(
  nameOrPage: string | CollectionPageInput,
  path = "",
  description = "",
) {
  const page: CollectionPageInput =
    typeof nameOrPage === "string" ? { name: nameOrPage, path, description } : nameOrPage;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_CONFIG.url}${page.path}#webpage`,
    url: `${SITE_CONFIG.url}${page.path}`,
    name: page.name,
    description: page.description,
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

type VideoObjectSchemaInput = {
  hasDedicatedVideo: boolean;
  name: string;
  description: string;
  path: `/videos/${string}` | `/stories/${string}` | `/portfolio/video/${string}` | `/gallery/video/${string}`;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string;
};

/**
 * Guarded VideoObject helper.
 *
 * Google video indexing expects VideoObject only on real watch pages where the
 * primary purpose is watching a specific video. Decorative/background videos,
 * gallery previews, landing pages, FAQs, contact, pricing, blog listings, and
 * legal pages must never emit VideoObject.
 */
export function videoObjectSchema(video: VideoObjectSchemaInput) {
  if (!video.hasDedicatedVideo) return null;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    url: `${SITE_CONFIG.url}${video.path}`,
    thumbnailUrl: video.thumbnailUrl.startsWith("http")
      ? video.thumbnailUrl
      : `${SITE_CONFIG.url}${video.thumbnailUrl}`,
    uploadDate: video.uploadDate,
    ...(video.duration && { duration: video.duration }),
    ...(video.contentUrl && { contentUrl: video.contentUrl }),
    ...(video.embedUrl && { embedUrl: video.embedUrl }),
    publisher: { "@id": ORG_ID },
  };
}

/** Homepage primary service entity — AEO EventPlanningService */
export function eventPlanningServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EventPlanningService",
    "@id": `${SITE_CONFIG.url}/#eventplanning`,
    name: `${SITE_CONFIG.name} — Luxury Event Planning`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    image: `${SITE_CONFIG.url}${DEFAULT_OG_IMAGE}`,
    provider: { "@id": ORG_ID },
    areaServed: ENTITY_FACTS.serviceAreas.map((name) => ({ "@type": "Place", name })),
    priceRange: ENTITY_FACTS.priceRange,
    knowsAbout: SERVICE_TITLES,
    serviceType: SERVICE_TITLES,
  };
}

export function serviceSchema(service: {
  name: string;
  description: string;
  slug: string;
  image?: string;
  /** The published "From ₹…" price (cms basePrice) — emitted as a minimum, not an exact price. */
  startingPrice?: number;
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
    ...(service.startingPrice && {
      offers: {
        "@type": "Offer",
        priceSpecification: startingPriceSpecification(service.startingPrice),
        availability: "https://schema.org/InStock",
      },
    }),
  };
}

/* reviewSchema / aggregateRatingSchema deleted (V6): the site publishes no reviews
   or ratings, so Review/AggregateRating markup would be self-serving spam. */

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
  /**
   * The byline the page shows, as the Organization's display name (defaults to
   * the trade name). Articles are published as the house, so the author is
   * always the global Organization node — no Person nodes, no verified names.
   */
  author?: string;
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
      "@type": "Organization",
      "@id": ORG_ID,
      name: article.author ?? SITE_CONFIG.shortName,
      url: SITE_CONFIG.url,
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

type ListItemInput = { name: string; url: string; image?: string };
/** The `services` rows from data/cms.ts (and anything shaped like them). */
type ServiceListInput = { title: string; slug: string; image?: string };

function toListItem(item: ListItemInput | ServiceListInput): ListItemInput {
  if ("slug" in item) {
    return { name: item.title, url: `/services/${item.slug}`, image: item.image };
  }
  return item;
}

/** ItemList node — pass `services` straight from cms.ts, or `{ name, url, image? }` rows. */
export function itemListSchema(items: readonly (ListItemInput | ServiceListInput)[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map(toListItem).map((item, i) => ({
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

/** A pre-shaped offer, or a BRAND_INVESTMENTS collection (`from` is the "₹10 Lakhs" string). */
type CollectionOfferInput =
  | { name: string; description: string; price: string }
  | { name: string; from: string; narrative: string };
/** A `services` row from data/cms.ts — basePrice is the published starting price in INR. */
type ServiceOfferInput = { title: string; slug: string; description: string; basePrice: number };

/**
 * OfferCatalog for /pricing: the three collections plus, when `services` is
 * passed, the twelve single-service offers. Every price is a published
 * starting price, so each carries a machine-readable minPrice. Emit only what
 * the page renders.
 */
export function offerCatalogSchema(
  collections: readonly CollectionOfferInput[],
  services: readonly ServiceOfferInput[] = [],
) {
  const collectionOffers = collections.map((c, i) => {
    const description = "narrative" in c ? c.narrative : c.description;
    const label = "from" in c ? `From ${c.from}` : c.price;
    const minPrice = rupeesFromLabel(label);
    return {
      "@type": "Offer",
      position: i + 1,
      name: c.name,
      description,
      priceSpecification: minPrice
        ? { ...startingPriceSpecification(minPrice), description: label }
        : { "@type": "PriceSpecification", priceCurrency: "INR", description: label },
      seller: { "@id": ORG_ID },
    };
  });

  const serviceOffers = services.map((s, i) => ({
    "@type": "Offer",
    position: collectionOffers.length + i + 1,
    name: s.title,
    description: s.description,
    priceSpecification: startingPriceSpecification(s.basePrice),
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@type": "Service",
      name: s.title,
      url: `${SITE_CONFIG.url}/services/${s.slug}`,
      provider: { "@id": ORG_ID },
    },
    seller: { "@id": ORG_ID },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `${SITE_CONFIG.name} Investment Collections`,
    itemListElement: [...collectionOffers, ...serviceOffers],
  };
}

/**
 * AboutPage node with rendered facts only. The company is referenced by ORG_ID
 * (the global Organization node), never re-declared, and there are no Person
 * nodes: no name is published until it is verified against the MCA filing.
 */
export function aboutPageSchema({ description }: { description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_CONFIG.url}/about#webpage`,
    url: `${SITE_CONFIG.url}/about`,
    name: `About ${SITE_CONFIG.shortName}`,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };
}

/** Merge page-level schemas into one @graph block (no duplicate @context nodes). */
export function pageGraphSchema(...schemas: object[]) {
  const nodes = schemas.flatMap((schema) => {
    if ("@graph" in schema && Array.isArray((schema as { "@graph": unknown[] })["@graph"])) {
      return (schema as { "@graph": object[] })["@graph"];
    }
    const { "@context": _ctx, ...node } = schema as { "@context"?: string } & Record<string, unknown>;
    void _ctx;
    return [node];
  });
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Inject multiple JSON-LD blocks as React-safe script elements */
export function jsonLdScripts(...schemas: Array<object | null | undefined | false>) {
  return schemas.filter((schema): schema is object => Boolean(schema)).map((schema, i) => ({
    key: `jsonld-${i}`,
    html: JSON.stringify(schema),
  }));
}
