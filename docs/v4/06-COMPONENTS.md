# Glitz Events V4 — Component Architecture

> Three tiers: **primitives → sections → page templates**. Naming, props contracts, composition, reuse-vs-rebuild, and Server/Client boundaries for Next.js 16 App Router.

## 1. Layering model
```
Page (Server Component, app/**/page.tsx)
└── View (brand/views/*-view.tsx)            ← composition root per page
    └── Section (brand/sections/**)           ← one "act"; mostly Client (motion)
        ├── Primitive (brand/primitives/**)   ← atoms: button, header, image, glass
        └── Motion primitive (lib/motion/**)  ← ScrollReveal, Parallax, variants
```

## 2. Server vs Client boundaries (Next.js 16)
- **Server by default:** `app/**/page.tsx`, metadata, schema injection, data fetching, `brand/views/*` where possible.
- **Client (`"use client"`):** anything using motion (Framer/GSAP), hooks, `next-themes`, adaptive backdrop, interactivity (carousels, forms, mega-menu).
- **Boundary rule:** push `"use client"` **down** to the leaf that needs it. Views stay server where they only compose. Sections that animate are client. `ScrollReveal`/`Parallax` are client and isolate interactivity so wrapper layout can stay server when refactored.
- **Data:** server components fetch and pass plain props to client sections (no client-side fetch for above-the-fold content where avoidable).

## 3. Motion primitives (`lib/motion/`) — NEW (this session)
| Component / export | Type | Props / contract |
|--------------------|------|------------------|
| `ScrollReveal` | Client | `preset?: "reveal"\|"left"\|"right"\|"fade"\|"scale"`, `delay?`, `as?`, `once?`, `amount?`, `className` |
| `Parallax` | Client | `distance?`, `axis?: "x"\|"y"`, `className` |
| `EASE/DUR/STAGGER/GSAP_EASE` | const | shared timing |
| `reveal/fade/scaleIn/maskChild/staggerParent/staggerItem` | `Variants` | reuse in any `motion.*` |

## 4. Primitives (`brand/primitives/`)
| Primitive | Status | Reuse / rebuild |
|-----------|--------|-----------------|
| `BrandButton` | **reuse** | gold/outline, magnetic, sheen. Add `as`/size in later pass. |
| `BrandSection` / `BrandHeader` | **reuse + extend** | add V4 editorial variant (kicker/display/standfirst) — see `BrandHeader` usage; new sections use `.v4-*` utilities directly. |
| `BrandImage` | **reuse** | art-directed `next/image` wrapper. |
| `BrandHero` | **superseded** | replaced by V4 `HeroV4` pattern for Home; keep for inner-page heroes until migrated. |
| `BrandFaqAccordion`, `BrandLightbox` | **reuse** | functional. |
| **`GlassPanel`** (proposed) | **new (next session)** | wraps `.v4-glass-liquid`; props `variant`, `glow`. Currently applied via utility classes in hero proof. |

## 5. Sections (`brand/sections/**`)
Home acts map (target 8). This session rebuilds **Hero** and **Who We Are**; others get refactored in later sessions.
| Section | File | Status | Notes |
|---------|------|--------|-------|
| Hero | `sections/home/hero.tsx` → `components/home/hero-v4.tsx` | **REBUILT** | cinematic, single CTA, glass, gold particles, mouse parallax, GSAP word reveal |
| Who We Are | `sections/home/intro.tsx` | **REBUILT** | editorial split, parallax media, floating glass stat card |
| Trust | `sections/home/trust.tsx` | reuse | retune as quiet ribbon later |
| Services | `sections/home/services.tsx` | rebuild later | ranked/featured, not equal grid |
| Stats / Why / How | `sections/home/*` | consolidate later | merge into "The Glitz Difference" |
| Testimonials | `sections/home/testimonials.tsx` | rebuild later | single-focus pull-quote |
| Case studies / Venues / Planner / AI / FAQ / CTA | `sections/home/*` | reuse → refine later | preserve functionality |

### Section contract
- Each section is self-contained, reads its own data (from `data/cms`, `brand/data/*`), and accepts no required props (composition-friendly).
- Animations via `ScrollReveal`/variants; never bespoke easing.
- Spacing via `.v4-section`; typography via `.v4-*` utilities.

## 6. Page templates (`brand/views/*`)
- One view per route, composing sections in act-order (see `home-view.tsx`).
- Views can stay Server Components; `dynamic()` import used for below-the-fold sections to tier hydration (already done for case-studies/testimonials/venues/planner/ai-planner).
- Inner pages (About/Services/Portfolio/…) follow the same View → Sections pattern.

## 7. Shell (`brand/shell/`)
| Component | Status | V4 note |
|-----------|--------|---------|
| `BrandHeader` | reuse + evolve | trim nav to ≤7, richer mega-menu (see SITEMAP §3), adaptive chrome already present |
| `BrandFooter` | reuse | becomes SEO/local catch-all (SITEMAP §3) |
| `BrandFab` | reuse | dedupe CTA vs hero |

## 8. Reuse vs rebuild summary
- **Reuse as-is:** adaptive theme provider, GSAP/Lenis providers, BrandButton, BrandImage, FAQ/lightbox, all API/data/SEO/schema modules, dashboards, auth, payments.
- **Rebuild (design/motion):** Home hero + Who We Are (this session); Services/Portfolio/Testimonials/Book and inner-page heroes (later).
- **New:** `lib/motion/*`, `v4-tokens.css`, `hero-v4.tsx`; proposed `GlassPanel` primitive next.

## 9. Naming conventions
- Sections: `Home<Act>` (e.g. `HomeHero`, `HomeIntro`).
- V4 components suffixed `V4` only during coexistence with V3 (`HeroV4`); drop suffix once V3 variant is removed.
- Utility classes: `v4-` prefix; tokens `--v4-`.
- Motion: import from `@/lib/motion` barrel, never redefine easing inline.
