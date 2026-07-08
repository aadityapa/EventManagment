import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { SITEMAP_CHILDREN } from "@/lib/sitemap-entries";

export default function robots(): MetadataRoute.Robots {
  const sitemapIndex = `${SITE_CONFIG.url}/sitemap.xml`;
  const childSitemaps = SITEMAP_CHILDREN.map((child) => `${SITE_CONFIG.url}${child.path}`);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api/"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "PerplexityBot", "Google-Extended"],
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api/"],
      },
    ],
    sitemap: [sitemapIndex, ...childSitemaps],
    host: SITE_CONFIG.url,
  };
}
