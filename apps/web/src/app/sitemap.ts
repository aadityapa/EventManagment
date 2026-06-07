import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { services, blogPosts } from "@/data/cms";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;

  const staticPages = [
    "", "/about", "/services", "/portfolio", "/venues", "/vendors",
    "/gallery", "/testimonials", "/pricing", "/blog", "/faqs",
    "/contact", "/book-event", "/privacy", "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const servicePages = services.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages = blogPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...blogPages];
}
