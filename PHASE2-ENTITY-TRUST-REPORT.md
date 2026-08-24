# Nexyyra Events — Phase 2: Entity Trust & Disambiguation Report
Date: 2026-08-24 · Builds on SEO-REMEDIATION-REPORT.md (Phase 1)

## 1. Executive Summary

Phase 1's technical layer was verified intact (correct Organization/WebSite naming, canonical www, phone +91 7020640157, no "Nexura"/"Nexyra" anywhere, no deprecated SearchAction, no fabricated aggregateRating). Phase 2 removed the remaining — and most serious — trust liability: a large body of **template/demo marketing claims presented as fact**: three mutually contradictory statistics sets, a fabricated 4.9★/500+ review rating repeated in five more places, unverifiable awards and press mentions ("Vogue India", "Forbes India"), fake client testimonials with fake Review JSON-LD, "trusted by" brand names (Taj, Netflix, Reliance…), and an unverified "founded 2012 in Amravati" origin story that contradicted the 2026 CIN. All of it is now removed or neutralized; the site claims only what is documented. Build, typecheck and lint pass, and the generated HTML was inspected clean.

## 2. Contradictory Facts Found

| Claim | Where | Values found | Verified source? |
|---|---|---|---|
| Events delivered | homepage / AEO files / about / geo-content / BRAND_STATS | 100+ · 1,000+ · 1,800+ | none |
| Happy clients | same | 150+ · 500+ · 1,400+ | none |
| Years / founding | hero, about, llms*, ai/*, schema | 5+ yrs · 10+ yrs · 12 yrs · "since 2012" | none (CIN proves only 2026 incorporation) |
| Team size | counters / llms-full / schema | 20+ · 50+ · 120+ | none |
| Cities | about / venues / llms* | 35+ | none |
| Client rating | schema (P1) + location-pages, local-seo-pages, geo-content, ai files, testimonials page | 4.9★ / 500–520+ reviews | none — fabricated |

## 3. Facts Removed (unverified)

All numeric scale claims above; "since 2012 / founded 2012 in Amravati" (all machine-readable and visible copy); 4.9★ ratings (5 further locations); fake Review JSON-LD on /testimonials; "Google Reviews / 4.9 Star Excellence" section; awards (Event Industry Awards 2025, Wedding Sutra 2024, MICE India 2024, Event Tech Summit 2023); press claims (Forbes India, Economic Times, Vogue India); superlatives ("India's premier", "Award-winning", "widely regarded as best", "Pune's premier", "Maharashtra's premier"); fabricated case-study outcomes ("8M impressions", "98% satisfaction", "featured in 12 media outlets", "40% lead capture", "3x footfall", "50M impressions").

## 4. Facts Retained (verifiable/asserted-by-owner)

Legal name + CIN U70200ME2026PTC476014 (incorporation 2026); registered office Telhara 444108; Pune delivery & coordination office; phone/WhatsApp +91 7020640157; email; service catalogue; service areas; leadership names/roles (Yash Bajaj founder; Aaditya Padiya & Amey Korde co-founders since 2026; staff); price range ₹10L–₹4Cr+ (owner-asserted — confirm); tagline.

## 5–6. Testimonials & Client/Partner Claims Removed

5 template testimonials (fake names "Aisha & Rahul", "Vikram Malhotra CEO TechCorp", "Kapoor Family", "Global Finance Summit") removed from data, homepage strip, /testimonials page and case studies. 14 "trusted by" brand names (Taj Hotels, Marriott, Oberoi, ITC, Hyatt, Tata, Reliance, Sony Music, Zee, Netflix India, Four Seasons, JW Marriott, Aditya Birla, Mahindra) removed from data + About page. Replacements: factual "Why Clients Choose Nexyyra Events" sections (homepage + /testimonials) describing real service structure — no invented praise.

## 7. Awards

All award claims removed from schema, ENTITY_FACTS, content data, About page, AEO files and GEO answers. None had a proof URL. Restore any individual award only with a public citation.

## 8. Founder / Company History

Retained: founded by Yash Bajaj (undated); incorporated 2026 with co-founders joining (CIN-consistent). Removed everywhere: "2012", "Amravati" origin, fake timeline milestones (2012–2025). /company page now describes the brand→legal-entity relationship without unverified dates. EXTERNAL INPUT REQUIRED: if the 2012 Amravati founding is documentable, say so and I'll restore it with the correct "operations began (2012) vs incorporated (2026)" distinction.

## 9. Organization Schema Status

One canonical Organization (`/#organization`), name "Nexyyra Events", legalName correct, CIN identifier, phone/email/address, sameAs (4 profiles — verify ownership), knowsAbout, contactPoints, founder/employee (real team), OfferCatalog. Removed in Ph1+2: aggregateRating, award, numberOfEmployees, foundingDate, foundingLocation, SearchAction, twitter handles. LocalBusiness + EventPlanningService + WebSite nodes link via stable @ids. JSON-LD in built HTML validated by inspection.

## 10–12. Technical / Local / AEO Status

Technical: canonical www enforced, robots + sitemap index valid, all routes prerendered, custom 404 — see CRAWL-AUDIT.md. Local: location pages use "serving Pune" framing; local-seo/geo/location content stripped of fabricated ratings/awards; registered office vs service area correctly distinguished on /company and GBP sheet. AEO: llms.txt, llms-full.txt, ai/*.md now contain nothing more ambitious than the website itself; the canonical "Who is Nexyyra Events?" answer is identical across llms-full.txt, ai/faq.md and geo-content.

## 13–14. Performance & Accessibility

No regressions introduced (removed an embla carousel and count-up timers from two pages — marginally less JS). `prefers-reduced-motion` honored globally via CSS + framer-motion MotionConfig. Deeper performance work (animation stack, hero media) intentionally deferred — flagged as next iteration, not attempted blind.

## 15. Files Modified (20)

src: lib/seo.ts, lib/constants.ts, lib/geo-content.ts, lib/location-pages.ts, lib/local-seo-pages.ts, data/cms.ts, brand/data/content.ts, brand/views/about-view.tsx, brand/views/testimonials-view.tsx, brand/views/venues-view.tsx, brand/sections/home/hero-static.tsx, brand/sections/home/counters.tsx, brand/sections/home/testimonials-strip.tsx, components/shared/local-seo-page.tsx, app/testimonials/page.tsx, app/company/page.tsx, app/about/page.tsx · public: llms.txt, llms-full.txt, ai/about.md, ai/company.md, ai/knowledge-base.md

## 16. Validation Results

`tsc --noEmit` ✅ · eslint (0 errors) ✅ · `next build` ✅ all routes prerendered · Built HTML grep: zero hits for Nexura/Nexyra, old phones, 1,800+, 4.9★ ratings, Netflix/Taj, "since 2012", Wedding Sutra (remaining "4.9" strings are SVG path coordinates) · Organization name/phone verified in generated JSON-LD ✅

## 17–21. External Actions (documents created)

GOOGLE-BUSINESS-PROFILE-SETUP.md · GOOGLE-SEARCH-CONSOLE-CHECKLIST.md · SOCIAL-ENTITY-CONSISTENCY.md · ENTITY-CITATION-PLAN.md · CRAWL-AUDIT.md · BRAND-SEARCH-MONITORING.md — none of these are executed yet; all require account access. Also: set Vercel env phone vars; confirm the 4 social URLs actually exist (they are in sameAs).

## 22. 30-Day Plan

Days 1–3: deploy this remediation; confirm envs; verify social URLs (remove dead ones from constants). Days 4–7: GSC verification + sitemap; GBP as service-area business; align social bios. Days 8–14: citations #6–11 from ENTITY-CITATION-PLAN.md. Days 15–21: replace "Representative showcase" portfolio items with 2–3 real case studies (real photos, authorized clients) — currently the portfolio is honest but generic. Days 22–30: weekly BRAND-SEARCH-MONITORING.md runs + GSC query report.

## Remaining (EXTERNAL INPUT REQUIRED)

1. True figures for events/clients/team/founding — with evidence, I'll reinstate consistent numbers site-wide (they convert better than qualitative claims).
2. 2012/Amravati founding documentation.
3. Award proof URLs (any award with a citation can return).
4. Real testimonials (with permission) → restores testimonial sections + legitimate Review markup.
5. /venues and /vendors directories still contain fictional template entries ("Grand Ballroom Mumbai", "Lens & Light Studio") — replace with real partners or remove the directories.
6. Official X/Twitter handle, if one exists.
