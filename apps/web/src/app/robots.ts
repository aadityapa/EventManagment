import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Private and out-of-scope routes. (/ai, /vendors and /venues now 308-redirect
 * in next.config.ts, so they need no rule.) /_next/ is deliberately not blocked:
 * crawlers need the CSS and JS to render the pages they index.
 */
const DISALLOW = ["/dashboard", "/admin", "/login", "/register", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "PerplexityBot", "Google-Extended"],
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    // Child sitemaps are linked from the index — listing only the index avoids duplicate discovery noise.
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
