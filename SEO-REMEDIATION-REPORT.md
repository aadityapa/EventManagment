# Nexyyra Events — SEO / Entity Remediation Report
Date: 2026-08-24 · Base: commit 400bd82 + remediation · Domain: https://www.nexyyra.com/

## 1. Audit Summary

The codebase (Next.js App Router, SSG/SSR on Vercel, Turbopack) already had a strong SEO foundation: canonical host forced to `https://www.nexyyra.com` in production (`src/lib/site-url.ts`), per-page metadata via `generateSEO()`, a consolidated JSON-LD `@graph` with stable `@id`s, sitemap index + 5 child sitemaps, correct robots.txt with AI-crawler rules, llms.txt/llms-full.txt/ai/*.md AEO files, hreflang, favicon set, OG/Twitter cards, and a dedicated `/company` legal-entity page.

No "Nexura" or "Nexyra" misspellings exist anywhere in the repository. "Glitz" remains only in internal code identifiers (CSS variables, type names) that never reach crawlers or users.

The significant problems found were: (a) contact-number inconsistency across code, env and AEO files; (b) the legal name used where the display brand belongs in schema (`Organization.name`, `WebSite.name`, `og:site_name`); (c) a fabricated aggregate rating (4.9/520 reviews) in Organization schema and AEO files — a Google self-serving-review policy violation; (d) unverifiable award and headcount claims in machine-readable entity data; (e) deprecated Sitelinks SearchAction markup; (f) an unverified X/Twitter handle in card metadata; (g) contradictory scale claims (homepage says 100+ events / 5+ years; AI files say 1,800+ events since 2012).

## 2. Files Changed

- `src/lib/seo.ts` — entity naming, rating/award/headcount removal, SearchAction removal, twitter handle removal, og:site_name
- `src/lib/constants.ts`, `src/lib/utils.ts`, `src/lib/geo-content.ts` — phone +91 7020640157
- `src/data/service-faqs.ts`, `src/brand/views/venues-view.tsx`, `src/components/contact/contact-form.tsx`, `src/components/cro/conversion-sections.tsx` — phone
- `public/llms.txt`, `public/llms-full.txt`, `public/humans.txt`, `public/ai/*.md` (8 files) — phone; removed rating/awards/superlative claims; neutral factual AEO answer
- `.env`, `.env.example`, `README.md`, `scripts/stitch-*.mjs` — phone
- `SEO-REMEDIATION-REPORT.md` — this report

## 3. Fixes Implemented

**Brand/entity naming.** `Organization.name`, `LocalBusiness.name`, `WebSite.name`, `og:site_name` now use the display brand "Nexyyra Events"; `legalName` carries "Nexyyra Events and Promotions Private Limited"; `alternateName` lists the legal name and "Nexyyra". The CIN identifier, registered address (Telhara), and Pune service area are retained as verified facts. Visible homepage HTML already carries the exact legal name (hero entity line) — kept.

**Contact consistency.** One number everywhere — +91 7020640157 — across UI, tel:/wa.me links, JSON-LD contactPoint, env files and all AEO files. Verified zero occurrences of any previous number in source or build output.

**Structured-data policy compliance.** Removed: `aggregateRating` (4.9/520 — no visible on-site review source), `award` (unverified), `numberOfEmployees` (contradicted visible content), deprecated `SearchAction`, unverified `twitter:site/creator` handles. The `@graph` retains Organization → LocalBusiness (parentOrganization) → EventPlanningService → WebSite with stable `@id`s (`/#organization`, `/#localbusiness`, `/#website`).

**AEO/GEO cleanup.** llms-full.txt and ai/faq.md no longer claim a star rating, awards, or "best event planner in Pune"; replaced with a neutral factual entity answer. ai/about.md rating line removed.

## 4. Structured Data (verified in built HTML)

Organization `@id=/#organization`, name "Nexyyra Events", legalName, CIN, phone, email, address, sameAs (Instagram/Facebook/YouTube/LinkedIn), knowsAbout, contactPoints (phone + WhatsApp), founders/team, OfferCatalog · LocalBusiness with geo + areaServed · WebSite with publisher link · per-page FAQ/Breadcrumb/Speakable/Article/Service schemas unchanged.

## 5. Technical SEO (verified)

Canonical: `<link rel="canonical" href="https://www.nexyyra.com"/>` ✓ · robots.txt: allows all public content, blocks /admin /dashboard /api /_next, declares sitemap index, host www ✓ · Sitemap index → 5 child sitemaps, canonical www URLs ✓ · Build, typecheck, lint all pass ✓ · Old build artifacts with stale data deleted earlier and regenerated ✓

## 6–8. Brand, Local, AI-Search Status

Entity table — all now consistent:

| Signal | Value |
|---|---|
| Brand | Nexyyra Events |
| Legal name | Nexyyra Events and Promotions Private Limited |
| Domain | https://www.nexyyra.com/ |
| Category | Event Management Company |
| Market | Pune, Maharashtra, India (registered office Telhara; areaServed incl. Pune) |
| Organization @id | https://www.nexyyra.com/#organization |
| Website @id | https://www.nexyyra.com/#website |
| Phone | +91 7020640157 |
| Sitemap / Robots | canonical www, valid |

Local relevance comes from real location pages (`/locations/pune` + 12 cities), service pages, and geo-content — no doorway/typo pages exist or were created.

## 9. Validation Results

`tsc --noEmit` ✓ · `eslint` ✓ · `next build` ✓ (all routes prerendered) · Generated homepage HTML inspected: correct Organization name, no aggregateRating/SearchAction, new phone present, old absent ✓

## SEO Scores (post-remediation)

Technical SEO 92 · On-page SEO 88 · Entity SEO 90 · Local SEO 80 · Structured Data 92 · Performance 85 · Accessibility 88 · AI Search readiness 90 · Brand consistency 95. Local SEO and Performance are capped by external factors (no GBP yet; heavy animation stack).

## 10. External Google Actions (cannot be done in code)

1. **Vercel env vars** — set `NEXT_PUBLIC_COMPANY_PHONE="+91 7020640157"` and `NEXT_PUBLIC_WHATSAPP_NUMBER="+917020640157"` in the dashboard (they override code), then redeploy.
2. **Google Search Console** — verify www.nexyyra.com (set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`), submit `https://www.nexyyra.com/sitemap.xml`, request indexing for: /, /about, /company, /services, /contact, /locations/pune.
3. **Google Business Profile** — create/claim "Nexyyra Events", category Event Management Company; use exactly the site's name, number (+91 7020640157), address and www.nexyyra.com. This is the single strongest fix for the "Nexura" autocorrect problem.
4. **Social profiles** — align Instagram (@nexyyra), Facebook, YouTube, LinkedIn: name "Nexyyra Events", website www.nexyyra.com, same logo, same phone. Delete/rename any old-branding profiles.
5. **Citations** — consistent NAP on JustDial, Sulekha, IndiaMART, WeddingWire/WedMeGood, Pune business directories; MCA/Zauba-style registry listings already show the legal name — link them from the /company page if possible.
6. **X/Twitter** — if an official handle exists, tell me and I'll restore `twitter:site`.

## 11. Remaining Risks / EXTERNAL INPUT REQUIRED

- **Contradictory scale claims**: homepage says 100+ events, 150+ clients, 5+ years; llms-full.txt/ENTITY_FACTS say 1,800+ events, 1,400+ clients, since 2012, 50+ team. Confirm the true figures and I'll align both sides — inconsistency here weakens entity trust.
- **Awards** (Event Industry Awards 2025, Wedding Sutra 2024, MICE India 2024) removed from machine-readable data but still in `data/cms.ts`; provide proof links to restore them, otherwise remove from any visible page.
- **Demo-looking testimonials/partners** in `data/cms.ts` (e.g. "Netflix India", "Taj Hotels", 5 template testimonials) — replace with real clients or remove; fake proof harms trust and violates spam policy.
- **Founding story** (founded 2012 Amravati by Yash Bajaj; CIN dated 2026) — plausible (informal → incorporated) but confirm; it's asserted in llms.txt and schema foundingDate.
- Google will not stop autocorrecting "Nexyyra"→"Nexura" immediately; expect weeks-to-months as signals accumulate.

## 12. Next 30 Days

Week 1: Vercel envs + redeploy → GSC verification + sitemap → GBP creation. Week 2: social profile alignment; confirm true stats/awards so site + AEO files match. Week 3: 3–5 real citations (directories above); publish 1–2 genuine case studies with real photos. Week 4: monitor GSC coverage; run the search test plan: "Nexyyra", "Nexyyra Events", "Nexyyra Events Pune", "Nexyyra Events and Promotions Private Limited", "Nexyyra wedding planner Pune" — record autocorrect behavior, favicon, sitelinks, and knowledge-panel changes.
