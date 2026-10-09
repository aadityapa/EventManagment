import { SITE_CONFIG } from "./constants";
import { services, blogPosts } from "@/data/cms";
import { LOCAL_SEO_PAGES } from "./local-seo-pages";
import { LOCATION_PAGES } from "./location-pages";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { assetForRole, assetsByRole, blogLeadRole, type CurationAsset } from "@/brand/data/image-curation";
import {
  staticPageLastMod,
  staticPageChangeFreq,
  localPageLastMod,
  servicePageLastMod,
  portfolioCaseLastMod,
  blogPostLastMod,
} from "./sitemap-lastmod";
import type { SitemapEntry } from "./sitemap-xml";

/**
 * Indexable V6 routes only. /ai, /vendors and /venues stay noindex (and are
 * disallowed in robots.ts); /testimonials 308s to /why-nexyyra.
 */
const STATIC_PATHS = [
  "",
  "/about",
  "/company",
  "/services",
  "/portfolio",
  "/gallery",
  "/why-nexyyra",
  "/pricing",
  "/blog",
  "/faqs",
  "/contact",
  "/book-event",
  "/sitemap",
  "/privacy",
  "/terms",
  "/refund",
] as const;

const LOW_PRIORITY = new Set<string>(["/privacy", "/terms", "/refund", "/sitemap"]);

function absUrl(path: string): string {
  return `${SITE_CONFIG.url}${path}`;
}

/** Covers are served from the local WebP export; the 1920 file is the full frame. */
function coverImage(role: string): string[] {
  const asset = assetForRole(role);
  return asset?.local ? [absUrl(`${asset.local}-1920.webp`)] : [];
}

/** Below-fold photos are the curated lh3 1920 variant (`src`). */
function photo(asset: CurationAsset | undefined): string[] {
  if (!asset) return [];
  return [asset.local ? absUrl(`${asset.local}-1920.webp`) : asset.src];
}

function withImages(entries: SitemapEntry[]): SitemapEntry[] {
  return entries.filter((entry) => entry.images && entry.images.length > 0);
}

export function buildPagesSitemapEntries(): SitemapEntry[] {
  const staticPages: SitemapEntry[] = STATIC_PATHS.map((path) => ({
    url: absUrl(path),
    lastModified: staticPageLastMod(path || "/"),
    changeFrequency: staticPageChangeFreq(path || "/"),
    priority: path === "" ? 1 : path === "/blog" ? 0.7 : LOW_PRIORITY.has(path) ? 0.3 : 0.8,
  }));

  const localPages: SitemapEntry[] = LOCAL_SEO_PAGES.map((p) => ({
    url: absUrl(`/${p.slug}`),
    lastModified: localPageLastMod(p.slug),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const portfolioCases: SitemapEntry[] = BRAND_CASE_STUDIES.map((cs) => ({
    url: absUrl(`/portfolio/${cs.id}`),
    lastModified: portfolioCaseLastMod(cs.id),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticPages, ...localPages, ...portfolioCases];
}

export function buildBlogSitemapEntries(): SitemapEntry[] {
  // /blog listing lives in sitemap-pages.xml — only posts here (no duplicate URLs).
  return blogPosts.map((p) => ({
    url: absUrl(`/blog/${p.slug}`),
    lastModified: blogPostLastMod(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));
}

export function buildServicesSitemapEntries(): SitemapEntry[] {
  // /services listing lives in sitemap-pages.xml — only detail pages here.
  return services.map((s) => ({
    url: absUrl(`/services/${s.slug}`),
    lastModified: servicePageLastMod(s.slug),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
}

export function buildVenuesSitemapEntries(): SitemapEntry[] {
  // Historical feed name; it lists the city pages (/locations/[city]).
  return LOCATION_PAGES.map((p) => ({
    url: absUrl(`/locations/${p.slug}`),
    lastModified: localPageLastMod(`locations-${p.slug}`),
    changeFrequency: "monthly",
    priority: 0.82,
  }));
}

/**
 * Image sitemap from the curation layer: the gallery set is exactly
 * `assetsByRole("gallery")` (what /gallery paginates through), and every other
 * page lists only the curated roles it renders. Entries without images are dropped.
 */
export function buildImagesSitemapEntries(): SitemapEntry[] {
  const galleryEntry: SitemapEntry = {
    url: absUrl("/gallery"),
    lastModified: staticPageLastMod("/gallery"),
    changeFrequency: "weekly",
    priority: 0.6,
    images: assetsByRole("gallery").map((asset) => asset.src),
  };

  const coverPages: SitemapEntry[] = (
    [
      ["", "cover-home"],
      ["/services", "cover-services"],
      ["/about", "cover-about"],
      ["/why-nexyyra", "cover-why"],
    ] as const
  ).map(([path, role]) => ({
    url: absUrl(path),
    lastModified: staticPageLastMod(path || "/"),
    changeFrequency: staticPageChangeFreq(path || "/"),
    priority: 0.5,
    images: coverImage(role),
  }));

  const portfolioListing: SitemapEntry = {
    url: absUrl("/portfolio"),
    lastModified: staticPageLastMod("/portfolio"),
    changeFrequency: "weekly",
    priority: 0.6,
    images: [...coverImage("cover-portfolio"), ...BRAND_CASE_STUDIES.flatMap((cs) => photo(assetForRole(`concept-${cs.id}`)))],
  };

  const portfolioEntries: SitemapEntry[] = BRAND_CASE_STUDIES.map((cs) => ({
    url: absUrl(`/portfolio/${cs.id}`),
    lastModified: portfolioCaseLastMod(cs.id),
    changeFrequency: "monthly",
    priority: 0.55,
    images: [`concept-${cs.id}`, `case-${cs.id}-l`, `case-${cs.id}-r`].flatMap((role) => photo(assetForRole(role))),
  }));

  const serviceEntries: SitemapEntry[] = services.map((s) => ({
    url: absUrl(`/services/${s.slug}`),
    lastModified: servicePageLastMod(s.slug),
    changeFrequency: "monthly",
    priority: 0.5,
    images: coverImage(`service-cover-${s.slug}`),
  }));

  const blogEntries: SitemapEntry[] = blogPosts.map((p) => ({
    url: absUrl(`/blog/${p.slug}`),
    lastModified: blogPostLastMod(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.5,
    images: photo(assetForRole(blogLeadRole(p.category))),
  }));

  return withImages([galleryEntry, ...coverPages, portfolioListing, ...portfolioEntries, ...serviceEntries, ...blogEntries]);
}

export const SITEMAP_CHILDREN = [
  { id: "pages", label: "Pages", path: "/sitemap-pages.xml", build: buildPagesSitemapEntries },
  { id: "blog", label: "Journal", path: "/sitemap-blog.xml", build: buildBlogSitemapEntries },
  { id: "services", label: "Services", path: "/sitemap-services.xml", build: buildServicesSitemapEntries },
  { id: "venues", label: "Cities", path: "/sitemap-venues.xml", build: buildVenuesSitemapEntries },
  { id: "images", label: "Images", path: "/sitemap-images.xml", build: buildImagesSitemapEntries },
] as const;
