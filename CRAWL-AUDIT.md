# Crawl Audit — www.nexyyra.com (2026-08-24)

Verified against the production build output (`next build`, all routes prerendered).

| Check | Status |
|---|---|
| robots.txt | ✅ Allows all public content; blocks /admin, /dashboard, /api/, /_next/; AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) explicitly allowed; sitemap + www host declared |
| sitemap.xml | ✅ Index → 5 children (pages, blog, services, venues, images); canonical https://www URLs; lastmod present |
| Canonicals | ✅ Self-referencing, forced to https://www.nexyyra.com by `src/lib/site-url.ts` (dev/IP URLs rejected in production) |
| Redirects | ✅ apex→www normalization in site-url; no chains/loops found in config |
| 404 handling | ✅ Custom not-found page renders (404.html in build) |
| noindex | ✅ Only via explicit `noIndex` flag; no accidental noindex on public routes |
| X-Robots-Tag | ✅ None set globally (nothing blocking) |
| Orphan pages | ⚠️ /company is linked from llms.txt and footer-level content — verify a visible internal link exists from /about (recommended) |
| Internal links | ✅ Header/footer link Services, About, Portfolio, Contact, legal pages; service/location pages interlink |
| JS-dependent content | ⚠️ Below-fold homepage sections load client-side (ssr:false) — hero + metadata + JSON-LD are server-rendered, so core entity signals are crawlable; consider SSR for below-fold sections later |
| Demo content | ⚠️ /venues and /vendors directories still use template data (fictional venues/vendors) — see Phase-2 report §Remaining |

Re-run after each major deploy: `npm run build`, then grep build output for "Nexura", old phone numbers, and fabricated claims (all currently zero).
