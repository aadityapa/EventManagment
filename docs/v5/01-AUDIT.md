# Glitz Events V5 — Complete Codebase Audit

> **Baseline:** V4 rebuild @ `374b288` (Session 3) · **Uncommitted WIP:** Session 4 edits (blog, gallery, venues, vendors, pricing, contact, loader, budget calculator)  
> **Live:** https://event-managment-mocha.vercel.app/ · **Phone:** +91 9730594753  
> **Vision lens:** V5 = *Cinematic Event Universe* (not a website). Category reinvention, not incremental polish.  
> **Prior docs:** `docs/v4/*` (foundation through Session 3)

## Executive summary

V4 successfully installed a **shared design + motion grammar** (`v4-tokens.css`, `lib/motion/`, `HeroV4`, `GlassPanel`, adaptive theme) and rebuilt **Home (8 acts)**, **About**, **Services**, **Portfolio**, **Book skin**, and **shell navigation** across Sessions 1–3. The site now reads as a *directed luxury film* in places — but still behaves like a **multi-page marketing site** with conventional nav, a single-scene loader, form-heavy booking, and no "universe" spatial model.

V5 must evolve from **cinematic pages** → **experience chapters inside a persistent universe**. The gap is architectural and emotional, not feature-count.

| Dimension | V4 state (master) | V5 requirement | Gap severity |
|-----------|-------------------|----------------|--------------|
| Experience model | Pages + sections | Chapters + worlds + portals | **Critical** |
| Loader | Single GSAP scene (~3s) | 6-scene movie intro | **Critical** |
| Home narrative | 8 acts (good) | 9 chapters + world portals | **High** |
| Navigation | Mega-menu + header | Spatial universe nav | **Critical** |
| Portfolio | Grid/story toggle, pinned featured | Netflix-style rows + case films | **Critical** |
| Booking | 9-step wizard (forms) | Event Architect (5 experiential steps) | **Critical** |
| AI | Chip-based planner on `/book-event` | Dedicated AI Experience hub | **High** |
| Page transitions | None | Curtain / portal transitions | **High** |
| Design tokens | V4 Dune Glow (partial) | Full Dune Glow Luxury System + `--v5-*` | **High** |
| 3D boundaries | R3F hero sparkles, canvas particles | Purposeful 3D for worlds/venues only | **Medium** |
| SEO/GEO | Strong schema, 20 blog posts, 6 local pages | Entity universe + answer blocks per world | **Medium** |
| A11y | Reduced-motion guards, adaptive contrast | AAA everywhere + motion parity | **Medium** |
| Perf | Heavy client stack (GSAP+Framer+Lenis+Three) | Tiered spectacle, LCP budget | **High** |
| DevOps | CI + Vercel + Docker documented | Monitoring dashboards, perf gates | **Medium** |

---

## Git & session inventory

| Commit | Session | Delivered |
|--------|---------|-----------|
| `2b95059` | V4 Foundation | Audit, strategy, `v4-tokens.css`, `lib/motion/`, `HeroV4`, docs |
| `6203f86` | V4 Session 2 | Home → 8 cinematic acts, section consolidation |
| `374b288` | V4 Session 3 | Portfolio, Services, About, shell (header/footer), Book skin |
| *(working tree)* | V4 Session 4 (WIP, uncommitted) | blog, gallery, venues, vendors, pricing, contact, loader tweaks, budget calculator |

**Preserve:** All V4 motion primitives, adaptive engine, business APIs, SEO routes, booking/payment wiring.

---

## Route inventory (complete)

### Marketing / editorial (29 pages)

| Route | View / implementation | V4 status | V5 gap |
|-------|----------------------|-----------|--------|
| `/` | `home-view.tsx` → 8 acts | Session 2 rebuilt | Expand to 9 chapters + Experience Worlds portals |
| `/about` | `about-view.tsx` | Session 3 cinematic timeline, manifesto, team | Reframe as "Atelier" chapter inside universe |
| `/services` | `services-view.tsx` | Session 3 ranked featured + process spine | Per-service **cinematic chapter template** |
| `/services/[slug]` | `app/services/[slug]/page.tsx` | Partial V4 skin | Full chapter template per service |
| `/portfolio` | `portfolio-view.tsx` | Session 3 filters, featured pin, grid/story | **Netflix experience** — rows, autoplay previews |
| `/venues` | `venues-view.tsx` | WIP Session 4 — filters, spotlight cities | Venue Universe + map/3D destination framing |
| `/vendors` | `vendors-view.tsx` | WIP Session 4 | Curated Atelier presentation |
| `/gallery` | `gallery-view.tsx` | WIP Session 4 + `brand-lightbox` | Editorial masonry + motion enter |
| `/blog` | `blog-view.tsx` | WIP Session 4 | Featured hero article, editorial typography |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | WIP + `blog-content.ts` | Preserve all slugs; add TL;DR/GEO blocks |
| `/pricing` | `pricing-view.tsx` | WIP Session 4 | Investment philosophy (not tiers) |
| `/testimonials` | `testimonials-view.tsx` | V3 + partial motion | Single-focus cinematic quotes |
| `/faqs` | `faqs-view.tsx` | V3 + schema | GEO answer engine blocks |
| `/contact` | `contact-view.tsx` | WIP Session 4 | Concierge atmosphere |
| `/book-event` | `book-view.tsx` + `booking-wizard.tsx` | Session 3 skin + 9-step wizard | **Event Architect** — 5 experiential steps |

### Local SEO (preserve exactly)

```
/wedding-planner-pune
/corporate-event-management-pune
/destination-wedding-planner-pune
/luxury-wedding-planner-maharashtra
/event-management-company-pune
/exhibition-management-pune
```

Implemented via `local-seo-page.tsx` + `lib/local-seo-pages.ts`. **Do not break URLs.**

### Application

| Route | Purpose | V5 treatment |
|-------|---------|--------------|
| `/login`, `/register` | Auth | Design-only later; inherit V5 tokens |
| `/dashboard`, `/dashboard/vendor` | Client/vendor portals | Out of marketing scope; token cohesion |
| `/admin` | Admin | Same |

### Legal

`/privacy`, `/terms`, `/refund` — preserve; restyle with V5 tokens.

### APIs (`apps/web/src/app/api/`)

| Endpoint | Role | Preserve |
|----------|------|----------|
| `/api/auth/*` | login, logout, register, me | ✅ |
| `/api/bookings`, `/api/bookings/my` | Booking CRUD | ✅ (re-skin UI only) |
| `/api/payments/razorpay/*` | create-order, verify | ✅ |
| `/api/leads` | Lead capture | ✅ |
| `/api/hero-images` | Dynamic hero slides | ✅ extend for universe frames |

Backend API lives in `server/` (Express/Prisma). **No backend rewrite in V5.**

---

## Cross-cutting audit

### 1. Design system (V4 → V5)

**What exists:**
- `apps/web/src/brand/design-system/v4-tokens.css` — Obsidian, gold scale, dune glow, glass, grain, editorial type scale
- `apps/web/src/brand/design-system/tokens.css` — V3 semantic tokens (still active)
- `apps/web/src/styles/design-system.css` — legacy utilities
- `GlassPanel` primitive wrapping `.v4-glass-liquid`
- Dual theme via `next-themes` + `.light`/`.dark`

**Gaps vs V5 Dune Glow Luxury System:**
- V4 uses `#F7F3EB` as warm-sand; V5 spec adds explicit **Champagne `#F7F3EB`**, **Copper `#B8860B`**, and **no pure black/white sections** rule — some components still use `text-white`, `from-black/88` scrims
- No `--v5-*` namespace yet; migration path should alias V4 → V5
- Component tiers documented in V4 but **Portal** and **Chapter** tiers missing
- ShadCN primitives (`components/ui/*`) not fully mapped to V5 semantic roles

**Severity:** **High**

### 2. Adaptive Luxury Theme Engine

**Location:** `apps/web/src/lib/adaptive-theme/` + `components/adaptive/adaptive-theme-provider.tsx`

**Capabilities:** Image/video frame analysis → palette generation → `--adaptive-*` CSS vars (text, muted, accent, scrim, button, gradient-gold)

**V5 extensions needed:**
- `--adaptive-atmosphere` (warm sand wash intensity)
- `--adaptive-glow` (dune radial strength per frame)
- World-aware presets (Wedding World = warmer champagne; Corporate = cooler sand)
- Section-level handoff animations when adaptive palette shifts

**Severity:** **High** (extend, not rebuild)

### 3. Motion system

**Location:** `apps/web/src/lib/motion/` — `easing.ts`, `variants.ts`, `scroll-reveal.tsx`, `parallax.tsx`, `index.ts`

**Integrated:** Lenis (`smooth-scroll-provider`), GSAP ScrollTrigger (`lib/gsap/use-gsap`), Framer Motion variants

**V4 achievements:**
- Shared easing/duration grammar
- `ScrollReveal`, `Parallax`, mask reveals, stagger patterns
- Reduced-motion short-circuits in hero, loader, parallax

**V5 gaps:**
- No page/portal transitions (documented as V4 roadmap, not built)
- Loader is **one timeline**, not 6-scene movie
- No global "nothing appears instantly" orchestration layer
- ScrollTrigger + Lenis sync not wired globally (noted in V4 motion doc)
- No motion director / scene registry for universe navigation

**Severity:** **Critical**

### 4. Loader & cinematic shell

**Files:** `luxury-loader.tsx`, `cinematic-provider.tsx`

**Current behavior:**
- Session-scoped (`LOADER_STORAGE_KEY` in sessionStorage)
- GSAP: ring, logo, glow, rays, dust, particles → fade out
- Reduced motion → skip instantly
- WIP Session 4 may extend loader (uncommitted)

**V5 requirement:** 6-scene intro (Obsidian void → gold thread → logo reveal → world glimpse montage → tagline → curtain rise). **Critical gap.**

### 5. Home (`/`)

**V4 structure (8 acts):**
1. Hero (`hero-v4.tsx`) — word mask, parallax, adaptive, single primary CTA ✅
2. Who We Are (`intro.tsx`) — editorial split ✅
3. Signature Experiences — ranked services ✅
4. Portfolio showcase — teaser ✅
5. Glitz Difference — consolidated stats/why ✅
6. Venue collection ✅
7. Trust wall ✅
8. Luxury CTA ✅

**Missing for V5 (9 chapters):**
- **Experience Worlds portals** (Wedding World, Corporate World, etc.) — **Critical**
- **Testimonials** as dedicated chapter (currently absent from home-view)
- **Media & Awards** chapter
- **Book Journey** chapter (concierge preview, not just CTA)
- Horizontal pinned portfolio teaser (partially in showcase; not full Netflix row)

**Severity:** **High**

### 6. Services

**V4:** Featured wedding hero, secondary cards, process steps, GSAP media scrub on featured

**V5:** Each service = cinematic chapter (brief → vision → process film → proof → consultation). Template not yet defined in code.

**Severity:** **Critical** (template)

### 7. Portfolio

**V4 Session 3:** Filters, featured ScrollTrigger caption, grid/story toggle, `BRAND_CASE_STUDIES` data

**V5:** Netflix-style — hero row, category rows, hover preview, horizontal case films, sticky story spine. **Critical gap.**

### 8. Venues

**V4/WIP:** Filter by city/capacity/price, spotlight destination cities, compare UI started

**V5:** Venue Universe — editorial destination chapters, optional map/3D, desire framing (Udaipur, Goa as worlds)

**Severity:** **High**

### 9. Booking journey

**Current:** `booking-wizard.tsx` — **9 steps**: Event Type → Date → Venue → Guests → Budget → Services → Review → Payment → Confirmation. Functional Razorpay integration. GlassPanel skin.

**V5 Event Architect:** **5 experiential steps** — Vision → Scale → Atmosphere → Partners → Handshake (not form fields). Backend mapping preserves same API payloads.

**Severity:** **Critical**

### 10. AI features

**Current:** `ai-planner.tsx` on `/book-event` — chip selectors, client-side plan builder, optional API call. Rule-based, not a hub.

**V5:** Dedicated **AI Experience hub** — conversational concierge, plan export, world-aware recommendations, GEO-friendly structured outputs.

**Severity:** **High**

### 11. SEO / GEO

**Strengths:**
- `lib/seo.ts` — generateSEO, organization, website, entity, FAQ, review, article, breadcrumb schemas
- `app/sitemap.ts`, 20 blog posts, 6 local landing pages
- Analytics: GA4, Hotjar (`analytics-provider`)

**Gaps:**
- Per-page extractable fact blocks inconsistent
- No entity graph linking worlds → services → locations
- Blog articles lack standardized TL;DR / key takeaways for AEO
- `SITE_CONFIG.url` defaults to Vercel preview URL if env unset

**Severity:** **Medium**

### 12. Accessibility

**Strengths:** Skip link, reduced-motion paths, adaptive AAA on hero frames, Radix primitives on forms

**Gaps:** Gold on champagne below AAA in some glass panels; focus rings inconsistent on custom magnetic buttons; loader not announced to screen readers; no live region for portal transitions

**Severity:** **Medium**

### 13. Performance

**Stack weight:** Next 16.2.7, Framer 12, GSAP 3.15, Lenis, Three/R3F, Recharts, Sentry

**Issues:**
- Hero ships carousel + FX + particles + optional Three canvas eagerly
- Multiple home sections dynamically imported (good) but loader + Lenis + header mega-menu still on critical path
- No Lighthouse CI gates in workflow

**Targets (V5):** LCP < 2.5s, INP < 200ms, CLS < 0.1 mobile; tier spectacle below fold

**Severity:** **High**

### 14. DevOps

**Exists:** `.github/workflows/ci.yml`, `docker-compose.yml`, `docs/DEVOPS.md`, Vercel deploy, Sentry init

**Gaps:** No perf budgets in CI, no visual regression, no staging content sync documented for universe rollout

**Severity:** **Medium**

---

## Reusable V4 assets (keep & extend)

| Asset | Path | V5 action |
|-------|------|-----------|
| V4 tokens | `brand/design-system/v4-tokens.css` | Migrate → `v5-tokens.css`, alias `--v4-*` |
| Motion library | `lib/motion/*` | Extend with scene director, portal transitions |
| HeroV4 | `components/home/hero-v4.tsx` | Evolve → Welcome chapter; reduce carousel noise |
| GlassPanel | `brand/primitives/glass-panel.tsx` | Extend liquid glass variants |
| Adaptive engine | `lib/adaptive-theme/*` | Add world presets + new `--adaptive-*` |
| Brand shell | `brand/shell/*` | Rebuild as universe navigation |
| Content data | `brand/data/content.ts`, `data/cms.ts` | Add world/chapter metadata |
| Booking wizard | `components/booking/booking-wizard.tsx` | Reskin + reduce to 5 steps (preserve API) |
| SEO utilities | `lib/seo.ts` | Extend entity schemas for worlds |
| Stitch pipeline | `lib/stitch/*` | Asset handoff for Figma/Stitch (see doc 08) |

---

## Scored gap analysis

### Critical (must ship for V5 identity)

| ID | Gap | Impact |
|----|-----|--------|
| C1 | Universe navigation model (worlds/portals) | Without this, V5 = V4+ |
| C2 | 6-scene cinematic loader | First impression defines category |
| C3 | Event Architect booking (5 steps) | Conversion + differentiation |
| C4 | Portfolio Netflix experience | Proof = product for luxury events |
| C5 | Experience Worlds on Home | Core IA metaphor |
| C6 | Page/portal transitions | Breaks "single film" illusion today |
| C7 | Services cinematic chapter template | Every service must feel bespoke |

### High

| ID | Gap | Impact |
|----|-----|--------|
| H1 | V5 token layer + no pure B/W sections | Visual identity consistency |
| H2 | Home chapters 7–9 (testimonials, media, book journey) | Complete home narrative |
| H3 | Venue Universe + destination framing | Aspirational commerce |
| H4 | AI Experience hub | Modern luxury expectation |
| H5 | Motion director / global reveal orchestration | "Nothing appears instantly" |
| H6 | Perf tiering (lazy 3D, deferred loader assets) | Luxury = speed |
| H7 | Adaptive engine world presets | Cohesion across worlds |

### Medium

| ID | Gap | Impact |
|----|-----|--------|
| M1 | GEO entity graph per world | AI search visibility |
| M2 | Blog editorial typography + TL;DR | Content authority |
| M3 | Dashboard token cohesion | Brand trust post-conversion |
| M4 | CI perf gates + monitoring dashboards | Sustain quality |
| M5 | Gallery/vendor/pricing WIP → V5 polish | Secondary pages completeness |

### Low

| ID | Gap | Impact |
|----|-----|--------|
| L1 | Loader sound hook (`useLoaderSound`) | Nice-to-have immersion |
| L2 | Exit intent popup styling | CRO polish |
| L3 | Legacy hero components cleanup | Code hygiene |

---

## Technical debt register

1. **Dual token systems** — V3 `tokens.css`, V4 `v4-tokens.css`, inline `--glitz-*` still referenced in components
2. **Hero proliferation** — `hero-v4`, `hero-premium`, `hero-cinematic-*`, `brand-hero` coexist
3. **View/server boundaries** — Most views are `"use client"` entire file; missed RSC opportunities
4. **Session 4 WIP uncommitted** — Risk of divergence; merge or stash before V5 Phase 0
5. **Preview URL as default** — `SITE_CONFIG.url` fallback to Vercel preview hurts canonical SEO locally
6. **Booking step count** — 9 steps vs V5 spec; UX debt for mobile completion rate
7. **Stitch HTML exports** — Legacy `lib/stitch/exports/` may confuse asset pipeline

---

## Conclusion

V4 proved the **grammar** (tokens, motion, hero, glass, adaptive). V5 must prove the **universe** (worlds, chapters, portals, Netflix portfolio, Event Architect, 6-scene loader, spatial nav). The codebase is **ready for extension**, not greenfield — preserve all business logic, routes, APIs, and SEO assets while rebuilding the experience layer documented in `02-STRATEGY.md` through `07-IMPLEMENTATION-ROADMAP.md`.

**Recommended pre-code action:** Commit or integrate Session 4 WIP, then start V5 Phase 0 (token + motion migration) upon doc approval.
