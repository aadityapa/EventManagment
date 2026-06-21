import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { services, blogPosts } from "@/data/cms";
import { LOCAL_SEO_PAGES } from "@/lib/local-seo-pages";
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

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: absUrl(path),
      lastModified: staticPageLastMod(path || "/"),
      changeFrequency: staticPageChangeFreq(path || "/"),
      priority: path === "" ? 1 : ["/privacy", "/terms", "/refund"].includes(path) ? 0.3 : 0.8,
    };
    if (path === "/gallery") {
      entry.images = BRAND_IMAGES.gallery.slice(0, 12);
    }
    if (path === "/portfolio") {
      entry.images = BRAND_CASE_STUDIES.slice(0, 8).map((cs) => cs.image);
    }
    return entry;
  });

  const localPages = LOCAL_SEO_PAGES.map((p) => ({
    url: absUrl(`/${p.slug}`),
    lastModified: localPageLastMod(p.slug),
    changeFrequency: "monthly" as const,
    priority: 0.85,
    images: [`${SITE_CONFIG.url}/brand/logo-primary.png`],
  }));

  const servicePages = services.map((s) => ({
    url: absUrl(`/services/${s.slug}`),
    lastModified: servicePageLastMod(s.slug),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: [s.image.startsWith("http") ? s.image : absUrl(s.image)],
  }));

  const blogPages = blogPosts.map((p) => ({
    url: absUrl(`/blog/${p.slug}`),
    lastModified: blogPostLastMod(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
    images: [p.image],
  }));

  const portfolioCases = BRAND_CASE_STUDIES.map((cs) => ({
    url: absUrl(`/portfolio/${cs.id}`),
    lastModified: portfolioCaseLastMod(cs.id),
    changeFrequency: "monthly" as const,
    priority: 0.65,
    images: [cs.image],
  }));

  return [...staticPages, ...localPages, ...servicePages, ...portfolioCases, ...blogPages];
}
