import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { services, blogPosts } from "@/data/cms";
import { LOCAL_SEO_PAGES } from "@/lib/local-seo-pages";
import { LOCATION_PAGES } from "@/lib/location-pages";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import {
  staticPageLastMod,
  staticPageChangeFreq,
  localPageLastMod,
  servicePageLastMod,
  portfolioCaseLastMod,
  blogPostLastMod,
} from "@/lib/sitemap-lastmod";

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

function absUrl(path: string) {
  return `${SITE_CONFIG.url}${path}`;
}

/** Sitemap image:loc — same-origin only (external Drive URLs break XML generation). */
function sitemapImage(src: string): string {
  if (src.startsWith("/")) return absUrl(src);
  return absUrl("/brand/nexyyra-og.png");
}

function sitemapImages(sources: readonly string[]): string[] {
  return sources.map(sitemapImage);
}

function brandImageAt(): string {
  return absUrl("/brand/nexyyra-og.png");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: absUrl(path),
      lastModified: staticPageLastMod(path || "/"),
      changeFrequency: staticPageChangeFreq(path || "/"),
      priority: path === "" ? 1 : path === "/blog" ? 0.7 : ["/privacy", "/terms", "/refund"].includes(path) ? 0.3 : 0.8,
    };
    if (path === "/gallery") {
      entry.images = sitemapImages(BRAND_IMAGES.gallery);
    }
    if (path === "/portfolio") {
      entry.images = sitemapImages(BRAND_CASE_STUDIES.slice(0, 8).map((cs) => cs.image));
    }
    return entry;
  });

  const localPages = LOCAL_SEO_PAGES.map((p) => ({
    url: absUrl(`/${p.slug}`),
    lastModified: localPageLastMod(p.slug),
    changeFrequency: "monthly" as const,
    priority: 0.85,
    images: [`${SITE_CONFIG.url}/brand/nexyyra-og.png`],
  }));

  const locationPages = LOCATION_PAGES.map((p) => ({
    url: absUrl(`/locations/${p.slug}`),
    lastModified: localPageLastMod(`locations-${p.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.82,
    images: [`${SITE_CONFIG.url}/brand/nexyyra-og.png`],
  }));

  const servicePages = services.map((s) => ({
    url: absUrl(`/services/${s.slug}`),
    lastModified: servicePageLastMod(s.slug),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: [s.image.startsWith("/") ? sitemapImage(s.image) : brandImageAt()],
  }));

  const blogPages = blogPosts.map((p) => ({
    url: absUrl(`/blog/${p.slug}`),
    lastModified: blogPostLastMod(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
    images: [p.image.startsWith("/") ? sitemapImage(p.image) : brandImageAt()],
  }));

  const portfolioCases = BRAND_CASE_STUDIES.map((cs) => ({
    url: absUrl(`/portfolio/${cs.id}`),
    lastModified: portfolioCaseLastMod(cs.id),
    changeFrequency: "monthly" as const,
    priority: 0.65,
    images: sitemapImages([cs.image]),
  }));

  return [...staticPages, ...localPages, ...locationPages, ...servicePages, ...portfolioCases, ...blogPages];
}
