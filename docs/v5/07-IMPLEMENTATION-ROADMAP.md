# Glitz Events V5 — Implementation Roadmap

> Phased build plan mirroring V4 session discipline.  
> **Baseline commit:** `374b288` · **Docs session:** V5 foundation (this commit)  
> **Rule:** Preserve all business logic, APIs, routes, SEO URLs, auth, payments.

---

## Overview

| Phase | Name | Complexity | Depends on |
|-------|------|------------|------------|
| 0 | Foundation tokens + motion migration | M | Docs approval |
| 1 | Cinematic loader (6 scenes) | L | 0 |
| 2 | Home ch. 1–3 | L | 0, 1 |
| 3 | Home ch. 4–6 | M | 2 |
| 4 | Home ch. 7–9 + universe shell | L | 3 |
| 5 | Services cinematic chapters | M | 0, 4 |
| 6 | Portfolio Netflix | L | 0, 4 |
| 7 | Venue universe + map/3D | M | 0, 4 |
| 8 | Event Architect booking | M | 0, 4 |
| 9 | AI Experience hub | M | 8 |
| 10 | SEO/GEO/local polish | S | 4–9 |
| 11 | A11y/perf Lighthouse | M | 0–10 |
| 12 | DevOps CI/CD/monitoring | S | 11 |

**Complexity:** S = 1 session · M = 1–2 sessions · L = 2–3 sessions

---

## Pre-Phase 0 — housekeeping

| Task | Action |
|------|--------|
| Session 4 WIP | Commit or integrate uncommitted blog/gallery/venues/etc. before V5 code |
| Branch strategy | `feat/v5-phase-N` per phase; merge to `master` after review |
| Env | Set `NEXT_PUBLIC_APP_URL` to production canonical in Vercel + local |

---

## Phase 0 — Foundation tokens + motion primitives (V4→V5)

### Deliverables
- `brand/design-system/v5-tokens.css` with full Dune Glow system
- V4→V5 alias layer (`--v4-*` → `--v5-*`)
- `lib/motion/scene-director.ts`, `use-lenis-scroll-trigger.ts`
- Adaptive world presets stub (`lib/adaptive-theme/world-presets.ts`)
- Replace hardcoded pure black/white in hero/book/shell (touched files only)
- Global Lenis ↔ ScrollTrigger sync

### Files touched
```
apps/web/src/brand/design-system/v5-tokens.css          (new)
apps/web/src/app/globals.css
apps/web/src/lib/motion/scene-director.ts               (new)
apps/web/src/lib/motion/use-lenis-scroll-trigger.ts     (new)
apps/web/src/lib/motion/index.ts
apps/web/src/lib/adaptive-theme/world-presets.ts        (new)
apps/web/src/components/providers/smooth-scroll-provider.tsx
docs/v5/05-DESIGN-SYSTEM.md                             (status note)
```

### Dependencies
- Docs approval
- None technical

### Preserve checklist
- [ ] Dual theme toggle works
- [ ] Adaptive hero contrast AAA
- [ ] All routes build
- [ ] No API changes

### Complexity: **M** (1 session)

---

## Phase 1 — Cinematic loader

### Deliverables
- `universe-loader.tsx` — 6-scene timeline per `06-MOTION-SYSTEM.md`
- Update `cinematic-provider.tsx` storage key migration
- Skip button + reduced-motion path + aria-live
- Preload montage assets (4 world WebPs)

### Files touched
```
apps/web/src/components/effects/universe-loader.tsx     (new, deprecate luxury-loader)
apps/web/src/components/effects/luxury-loader.tsx       (re-export or remove)
apps/web/src/components/providers/cinematic-provider.tsx
apps/web/public/assets/v5/loader/*                      (new images)
```

### Dependencies
- Phase 0 tokens (`--v5-*` in loader)

### Preserve checklist
- [ ] Lenis still disabled until complete
- [ ] sessionStorage skip on repeat visit
- [ ] No layout shift on handoff to home

### Complexity: **L** (1 session)

---

## Phase 2 — Home chapters 1–3

### Deliverables
- Ch.1 Welcome — evolve `hero-v4.tsx` / `sections/home/hero.tsx`
- Ch.2 Who We Are — refine `intro.tsx`
- Ch.3 Experience Worlds — **NEW** `sections/home/experience-worlds.tsx` + `PortalCard`
- `home-view.tsx` updated order + anchors
- Scene director on all three

### Files touched
```
apps/web/src/components/home/hero-v4.tsx
apps/web/src/brand/sections/home/hero.tsx
apps/web/src/brand/sections/home/intro.tsx
apps/web/src/brand/sections/home/experience-worlds.tsx  (new)
apps/web/src/brand/primitives/portal-card.tsx           (new)
apps/web/src/brand/views/home-view.tsx
```

### Dependencies
- Phase 0, 1

### Preserve checklist
- [ ] Single primary CTA ch.1
- [ ] `#welcome`, `#atelier`, `#worlds` anchors
- [ ] Hero carousel API `/api/hero-images`
- [ ] Analytics hero events

### Complexity: **L** (1–2 sessions)

---

## Phase 3 — Home chapters 4–6

### Deliverables
- Ch.4 Signature Experiences — refine ranked layout
- Ch.5 Portfolio Universe — pinned horizontal ScrollTrigger row
- Ch.6 Venue Universe — destination teaser cards
- Dynamic imports for below-fold

### Files touched
```
apps/web/src/brand/sections/home/signature-experiences.tsx
apps/web/src/brand/sections/home/portfolio-showcase.tsx
apps/web/src/brand/sections/home/venue-collection.tsx
apps/web/src/lib/gsap/use-gsap.ts                       (horizontal helper)
```

### Dependencies
- Phase 2

### Preserve checklist
- [ ] ScrollTrigger + Lenis sync stable
- [ ] Mobile: horizontal swipe fallback (no pin on `< md`)

### Complexity: **M** (1 session)

---

## Phase 4 — Home chapters 7–9 + universe shell

### Deliverables
- Ch.7 Testimonials — re-add to home (`sections/home/testimonials-v5.tsx`)
- Ch.8 Media & Awards — **NEW** section from `BRAND_MEDIA` / `BRAND_AWARDS`
- Ch.9 Book Journey — evolve `luxury-cta.tsx`
- **Universe Nav** — worlds mega-menu, label updates, `PortalTransition`
- Page transition shell (view transitions or AnimatePresence)

### Files touched
```
apps/web/src/brand/sections/home/testimonials-v5.tsx    (new)
apps/web/src/brand/sections/home/media-awards.tsx       (new)
apps/web/src/brand/sections/home/luxury-cta.tsx
apps/web/src/brand/shell/brand-header.tsx
apps/web/src/brand/shell/brand-footer.tsx
apps/web/src/lib/motion/portal-transition.tsx           (new)
apps/web/src/lib/motion/page-transition.tsx             (new)
apps/web/src/brand/views/home-view.tsx
```

### Dependencies
- Phase 3

### Preserve checklist
- [ ] Dashboard routes hide shell
- [ ] Phone +91 9730594753 visible
- [ ] All nav URLs unchanged
- [ ] Mega-menu a11y (Esc, focus trap)

### Complexity: **L** (2 sessions)

---

## Phase 5 — Services cinematic chapters

### Deliverables
- `ServiceChapterTemplate` component
- Apply to `services-view.tsx` + `app/services/[slug]/page.tsx`
- Process film spine, proof block, commission CTA
- World tag from query param

### Files touched
```
apps/web/src/brand/templates/service-chapter.tsx        (new)
apps/web/src/brand/views/services-view.tsx
apps/web/src/app/services/[slug]/page.tsx
apps/web/src/data/cms.ts                                (metadata only)
```

### Dependencies
- Phase 0, 4 (portal transitions)

### Preserve checklist
- [ ] All service slugs 200
- [ ] Existing FAQ sections (`service-faq-section.tsx`)
- [ ] Schema per service

### Complexity: **M** (1–2 sessions)

---

## Phase 6 — Portfolio Netflix

### Deliverables
- Hero feature row + autopreview hover
- Category rows (horizontal)
- Case film modal / full-screen story spine
- Filter → row visibility transitions
- Optional `/portfolio/[slug]` route

### Files touched
```
apps/web/src/brand/views/portfolio-view.tsx
apps/web/src/brand/sections/portfolio/*                 (new folder)
apps/web/src/app/portfolio/[slug]/page.tsx              (optional new)
apps/web/src/brand/data/content.ts
```

### Dependencies
- Phase 0, 4

### Preserve checklist
- [ ] `BRAND_CASE_STUDIES` data intact
- [ ] Analytics portfolio events
- [ ] Reduced-motion posters

### Complexity: **L** (2 sessions)

---

## Phase 7 — Venue universe + map/3D

### Deliverables
- Destination spotlight tabs (Jaipur, Udaipur, Goa, Mumbai)
- Editorial desire framing copy
- Optional 2D map + WebGL pin glow (desktop, lazy)
- Integrate Session 4 WIP venue filters

### Files touched
```
apps/web/src/brand/views/venues-view.tsx
apps/web/src/components/three/venue-map-canvas.tsx        (new, optional)
apps/web/src/data/cms.ts
```

### Dependencies
- Phase 0, 4

### Preserve checklist
- [ ] Venue API fetch fallback (`getApiUrl`)
- [ ] Compare UI if present in WIP
- [ ] Max 1 WebGL context

### Complexity: **M** (1–2 sessions)

---

## Phase 8 — Event Architect booking

### Deliverables
- 5-step UI wrapping existing `booking-wizard` state machine
- Commission language + glass panels
- Summary "brief" panel step 4
- Handshake celebration step 5
- Map UI steps → existing 9 API steps internally

### Files touched
```
apps/web/src/components/booking/event-architect.tsx     (new facade)
apps/web/src/components/booking/booking-wizard.tsx      (refactor steps)
apps/web/src/brand/views/book-view.tsx
```

### Dependencies
- Phase 0, 4

### Preserve checklist
- [ ] `/api/bookings` payload unchanged
- [ ] Razorpay flow intact
- [ ] Auth prefill `/api/auth/me`
- [ ] Guest checkout path

### Complexity: **M** (1–2 sessions)

---

## Phase 9 — AI Experience hub

### Deliverables
- New route `/ai` (or `/experience-ai`)
- `ai-experience-view.tsx` — conversational UI
- Migrate/enhance `ai-planner.tsx` logic
- World-aware chip sets
- Plan export + book CTA
- Optional structured output schema

### Files touched
```
apps/web/src/app/ai/page.tsx                            (new)
apps/web/src/brand/views/ai-experience-view.tsx           (new)
apps/web/src/brand/sections/home/ai-planner.tsx           (extract shared lib)
apps/web/src/lib/ai/planner.ts                            (new)
apps/web/src/app/sitemap.ts
```

### Dependencies
- Phase 8 (shared conversion path)

### Preserve checklist
- [ ] Existing book page AI section still works or redirects
- [ ] No secret keys client-side
- [ ] Lead API if plan shared

### Complexity: **M** (1 session)

---

## Phase 10 — SEO/GEO/local polish

### Deliverables
- "At a glance" blocks per chapter
- World entity schema fragments
- Blog TL;DR + key takeaways component
- Sitemap update for `/ai`
- Canonical URL env enforcement
- Internal linking mesh (worlds → services → local pages)

### Files touched
```
apps/web/src/lib/seo.ts
apps/web/src/components/seo/geo-facts-block.tsx         (new)
apps/web/src/app/blog/[slug]/page.tsx
apps/web/src/components/shared/local-seo-page.tsx
apps/web/src/app/sitemap.ts
```

### Dependencies
- Phases 4–9 content stable

### Preserve checklist
- [ ] All 6 local URLs + schema
- [ ] 20 blog slugs unchanged
- [ ] No ranking regressions (monitor GSC)

### Complexity: **S** (1 session)

---

## Phase 11 — A11y/perf Lighthouse targets

### Deliverables
- AAA audit fixes (contrast, focus, live regions)
- Lighthouse CI thresholds in GitHub Actions
- Tier hydration audit (dynamic imports)
- Hero Three.js off by default
- Image priority/`sizes` audit
- INP profiling fixes

### Targets
| Metric | Mobile target |
|--------|---------------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| Lighthouse Performance | ≥ 85 |
| Lighthouse A11y | ≥ 95 |

### Files touched
```
.github/workflows/ci.yml
apps/web/src/components/home/hero-v4.tsx
apps/web/src/components/three/*
lighthouse-budget.json                                  (new)
```

### Complexity: **M** (1–2 sessions)

---

## Phase 12 — DevOps (Docker, CI/CD, monitoring)

### Deliverables
- Lighthouse CI job
- Preview deploy comments on PR
- Sentry release tagging per phase
- Docker compose prod profile validation
- `docs/DEVOPS.md` V5 addendum
- Uptime/monitoring checklist (Vercel + Sentry)

### Files touched
```
.github/workflows/ci.yml
.github/workflows/lighthouse.yml                        (new)
docker-compose.yml
docs/DEVOPS.md
```

### Complexity: **S** (1 session)

---

## Session sequencing recommendation

After **docs approval**, first implementation session:

> **Phase 0 + Phase 1 combined** (if timeboxed 1 day) OR **Phase 0 alone** (if conservative)

**Recommended:** **Phase 0 first** — tokens + scene director + Lenis sync — because every subsequent phase depends on `--v5-*` and global reveal rules. Immediately follow with **Phase 1 loader** as the emotional proof.

---

## Business logic preservation master checklist

Apply before merging any phase:

- [ ] Auth: login, register, logout, me
- [ ] Bookings: create, list, my bookings
- [ ] Payments: Razorpay create-order, verify
- [ ] Leads API
- [ ] Hero images API
- [ ] All 29 marketing routes return 200
- [ ] All 6 local SEO routes + schema
- [ ] All blog slugs
- [ ] Dashboard/admin hidden from marketing shell
- [ ] Phone/WhatsApp CTAs functional
- [ ] Cookie consent + analytics
- [ ] Sentry initialization
- [ ] `npm run build` + `npm run lint` pass

---

## Risk register

| Risk | Mitigation |
|------|------------|
| Session 4 WIP conflicts | Merge WIP before Phase 0 |
| ScrollTrigger + Lenis jank | Phase 0 sync hook; test iOS |
| Booking refactor breaks payment | Facade pattern; keep wizard state internal |
| Perf regression from loader | Skip path; lazy montage assets |
| SEO URL change accident | IA doc rule: no renames; CI link checker |

---

## Definition of done (V5 complete)

1. All 12 phases merged to `master`
2. Lighthouse targets met on Home, Portfolio, Book
3. Stakeholder sign-off on loader + worlds + Event Architect
4. GSC shows no crawl errors on preserved URLs
5. Live site at production URL with V5 premiere enabled
