import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const sitemapIndex = `${SITE_CONFIG.url}/sitemap.xml`;
  const blocked = ["/admin", "/dashboard", "/api/", "/_next/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: blocked,
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "PerplexityBot", "Google-Extended"],
        allow: "/",
        disallow: blocked,
      },
    ],
    // Child sitemaps are linked from the index — listing only the index avoids duplicate discovery noise.
    sitemap: sitemapIndex,
    host: SITE_CONFIG.url,
  };
}
