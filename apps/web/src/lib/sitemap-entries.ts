import { SITE_CONFIG } from "./constants";
import { services, blogPosts } from "@/data/cms";
import { LOCAL_SEO_PAGES } from "./local-seo-pages";
import { LOCATION_PAGES } from "./location-pages";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import {
  staticPageLastMod,
  staticPageChangeFreq,
  localPageLastMod,
  servicePageLastMod,
  portfolioCaseLastMod,
  blogPostLastMod,
} from "./sitemap-lastmod";
import type { SitemapEntry } from "./sitemap-xml";

const STATIC_PATHS = [
  "",
  "/about",
  "/services",
  "/portfolio",
  "/venues",
  "/vendors",
  "/gallery",
  "/testimonials",
  "/pricing",
  "/blog",
  "/faqs",
  "/contact",
  "/book-event",
  "/ai",
  "/privacy",
  "/terms",
  "/refund",
] as const;

function absUrl(path: string): string {
  return `${SITE_CONFIG.url}${path}`;
}

function sitemapImage(src: string): string {
  if (src.startsWith("/")) return absUrl(src);
  return absUrl("/brand/nexyyra-og.png");
}

function brandImageAt(): string {
  return absUrl("/brand/nexyyra-og.png");
}

export function buildPagesSitemapEntries(): SitemapEntry[] {
  const staticPages: SitemapEntry[] = STATIC_PATHS.map((path) => ({
    url: absUrl(path),
    lastModified: staticPageLastMod(path || "/"),
    changeFrequency: staticPageChangeFreq(path || "/"),
    priority: path === "" ? 1 : path === "/blog" ? 0.7 : ["/privacy", "/terms", "/refund"].includes(path) ? 0.3 : 0.8,
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
  const listing: SitemapEntry = {
    url: absUrl("/blog"),
    lastModified: staticPageLastMod("/blog"),
    changeFrequency: "weekly",
    priority: 0.7,
  };

  const posts: SitemapEntry[] = blogPosts.map((p) => ({
    url: absUrl(`/blog/${p.slug}`),
    lastModified: blogPostLastMod(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [listing, ...posts];
}

export function buildServicesSitemapEntries(): SitemapEntry[] {
  const listing: SitemapEntry = {
    url: absUrl("/services"),
    lastModified: staticPageLastMod("/services"),
    changeFrequency: "monthly",
    priority: 0.8,
  };

  const detailPages: SitemapEntry[] = services.map((s) => ({
    url: absUrl(`/services/${s.slug}`),
    lastModified: servicePageLastMod(s.slug),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [listing, ...detailPages];
}

export function buildVenuesSitemapEntries(): SitemapEntry[] {
  const venuesListing: SitemapEntry = {
    url: absUrl("/venues"),
    lastModified: staticPageLastMod("/venues"),
    changeFrequency: "monthly",
    priority: 0.75,
  };

  const locationPages: SitemapEntry[] = LOCATION_PAGES.map((p) => ({
    url: absUrl(`/locations/${p.slug}`),
    lastModified: localPageLastMod(`locations-${p.slug}`),
    changeFrequency: "monthly",
    priority: 0.82,
  }));

  return [venuesListing, ...locationPages];
}

export function buildImagesSitemapEntries(): SitemapEntry[] {
  const galleryEntry: SitemapEntry = {
    url: absUrl("/gallery"),
    lastModified: staticPageLastMod("/gallery"),
    changeFrequency: "weekly",
    priority: 0.6,
    images: BRAND_IMAGES.gallery.map(sitemapImage),
  };

  const portfolioEntries: SitemapEntry[] = BRAND_CASE_STUDIES.map((cs) => ({
    url: absUrl(`/portfolio/${cs.id}`),
    lastModified: portfolioCaseLastMod(cs.id),
    changeFrequency: "monthly",
    priority: 0.55,
    images: [sitemapImage(cs.image)],
  }));

  const serviceEntries: SitemapEntry[] = services.map((s) => ({
    url: absUrl(`/services/${s.slug}`),
    lastModified: servicePageLastMod(s.slug),
    changeFrequency: "monthly",
    priority: 0.5,
    images: [s.image.startsWith("/") ? sitemapImage(s.image) : brandImageAt()],
  }));

  const blogEntries: SitemapEntry[] = blogPosts.map((p) => ({
    url: absUrl(`/blog/${p.slug}`),
    lastModified: blogPostLastMod(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.5,
    images: [p.image.startsWith("/") ? sitemapImage(p.image) : brandImageAt()],
  }));

  const portfolioListing: SitemapEntry = {
    url: absUrl("/portfolio"),
    lastModified: staticPageLastMod("/portfolio"),
    changeFrequency: "weekly",
    priority: 0.6,
    images: BRAND_CASE_STUDIES.slice(0, 8).map((cs) => sitemapImage(cs.image)),
  };

  return [galleryEntry, portfolioListing, ...portfolioEntries, ...serviceEntries, ...blogEntries];
}

export const SITEMAP_CHILDREN = [
  { id: "pages", path: "/sitemap-pages.xml", build: buildPagesSitemapEntries },
  { id: "blog", path: "/sitemap-blog.xml", build: buildBlogSitemapEntries },
  { id: "services", path: "/sitemap-services.xml", build: buildServicesSitemapEntries },
  { id: "venues", path: "/sitemap-venues.xml", build: buildVenuesSitemapEntries },
  { id: "images", path: "/sitemap-images.xml", build: buildImagesSitemapEntries },
] as const;
