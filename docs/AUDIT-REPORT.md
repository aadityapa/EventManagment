# Glitz Events & Promotions — Website Audit Report

**Date:** June 12, 2026  
**Live site:** https://event-managment-mocha.vercel.app/  
**Codebase:** `apps/web` (Next.js 16 App Router) + `server/` (Express/Prisma)  
**Brand:** Glitz luxury — ivory (#FDFBF5) / gold (#B8860B), NOT violet SaaS

---

## Executive Summary

| Category | Score | Grade |
|----------|-------|-------|
| UI / Visual Design | 82/100 | B+ |
| UX / Navigation | 78/100 | B |
| Accessibility (A11y) | 72/100 | C+ |
| SEO (Technical) | 75/100 | B |
| GEO (AI Search) | 68/100 | C+ |
| Performance | 70/100 | C+ |
| CRO / Conversion | 74/100 | B |
| Responsiveness | 85/100 | A- |
| Content / Trust | 80/100 | B+ |
| **Overall** | **76/100** | **B** |

---

## Page-by-Page Audit

### Home (`/`)
| Category | Severity | Finding |
|----------|----------|---------|
| UI | Low | Strong HeroPremium + adaptive theme; ivory/gold tokens verified |
| UX | Medium | Long page — 12 sections; consider sticky section nav |
| A11y | Medium | Carousel dot buttons lack `aria-current`; hero pause on hover good |
| SEO | Low | Metadata strong; FAQ + Review schema added (Phase 11) |
| Performance | Medium | GSAP + Framer + Lenis + hero API — heavy initial JS |
| CRO | Low | Triple CTA (Book, Consultation, WhatsApp) + social proof strip ✅ |

**Page Score: 80/100**

### About (`/about`)
| Category | Severity | Finding |
|----------|----------|---------|
| UI | Low | BrandPageHero + timeline — on-brand |
| UX | Low | Clear narrative flow |
| A11y | Medium | Timeline lacks `<ol>` semantics |
| SEO | Medium | Missing dedicated About schema (Person/Organization subpage) |
| Content | Low | Strong founder story; team from CMS |

**Page Score: 78/100**

### Services (`/services`, `/services/[slug]`)
| Category | Severity | Finding |
|----------|----------|---------|
| UI | Low | Brand view + service detail with image hero |
| SEO | Low | Service JSON-LD added per slug (Phase 11) |
| UX | Medium | Services mega menu added to nav (Phase 6) |
| Content | Low | 12 services with features + pricing |

**Page Score: 82/100**

### Portfolio (`/portfolio`)
| Category | Severity | Finding |
|----------|----------|---------|
| UI | Low | Grid with hover overlays |
| UX | High | No client-side filter by event type — Phase 9 backlog |
| A11y | Medium | Overlay text uses `text-white` on dark gradient — OK |
| SEO | Medium | Missing ItemList schema for portfolio |

**Page Score: 74/100**

### Venues (`/venues`)
| Category | Severity | Finding |
|----------|----------|---------|
| UX | High | Search/filter foundation missing — Phase 10 backlog |
| SEO | Medium | Venue schema helper exists but not injected on page |
| UI | Low | Marketplace layout functional |

**Page Score: 70/100**

### Vendors (`/vendors`)
| Category | Severity | Finding |
|----------|----------|---------|
| UX | Medium | Category filter present in marketplace component |
| Trust | Low | Verified badges shown |
| SEO | Low | No Vendor schema |

**Page Score: 75/100**

### Gallery (`/gallery`)
| Category | Severity | Finding |
|----------|----------|---------|
| UI | Low | Lightbox + grid |
| Performance | Medium | Verify lazy loading on below-fold images |
| A11y | Medium | Lightbox keyboard trap needs verification |

**Page Score: 76/100**

### Blog (`/blog`, `/blog/[slug]`)
| Category | Severity | Finding |
|----------|----------|---------|
| Content | Medium | Expanded to 8 seed posts (Phase 14 partial) |
| SEO | Medium | Article schema not yet on `[slug]` pages |
| UX | Low | Featured + grid layout |

**Page Score: 72/100**

### Pricing (`/pricing`)
| Category | Severity | Finding |
|----------|----------|---------|
| CRO | Medium | Budget calculator exists in planner section; pricing page could link to `/book-event` more prominently |
| SEO | Low | Offer schema missing |
| UI | Low | Three-tier packages clear |

**Page Score: 76/100**

### Contact (`/contact`)
| Category | Severity | Finding |
|----------|----------|---------|
| CRO | Low | WhatsApp + phone + form ✅ |
| A11y | Low | Form labels present |
| SEO | Low | ContactPage schema missing |

**Page Score: 80/100**

### Book Event (`/book-event`)
| Category | Severity | Finding |
|----------|----------|---------|
| CRO | Low | Multi-step wizard + WhatsApp fallback |
| UX | Medium | Could surface budget calculator inline — Phase 17 |

**Page Score: 78/100**

---

## Category Deep-Dive

### UI / Typography / Colors (82/100)
- ✅ Light theme tokens: `#FDFBF5` bg, `#F7F3EB` surface, `#FFF` card, `#111/#444/#666` text, `#B8860B` accent
- ✅ Dark theme: `#050505` bg, `#111` surface, `#D4AF37` gold
- ⚠️ Legacy `PageHero` uses hardcoded `bg-black` — acceptable for dark hero sections
- ⚠️ Some legacy components in `components/home/` still use `text-white` on image overlays (intentional)
- ❌ Fixed: adaptive bleed — hero uses `--adaptive-*` vars exclusively

### Accessibility (72/100)
- ✅ Skip link present with focus reveal
- ✅ `:focus-visible` ring on interactive elements
- ✅ ARIA on nav, mobile menu, FAB
- ⚠️ Testimonial carousel prev/next need `aria-controls`
- ⚠️ Some icon-only buttons lack visible focus in dark mode
- 📋 Target: 90+ with full keyboard audit

### SEO / Technical (75/100)
- ✅ Dynamic `sitemap.ts` + `robots.ts`
- ✅ Canonical URLs via `generateSEO()`
- ✅ OG + Twitter cards
- ✅ Breadcrumb schema on service pages
- ✅ 6 local landing pages added (Phase 12)
- ⚠️ `SITE_CONFIG.url` should match production domain via env
- 📋 Article schema for blog posts — backlog

### GEO / AI Search (68/100 → 80 after Phase 11)
- ✅ Organization + LocalBusiness + WebSite JSON-LD
- ✅ Entity definition schema with `knowsAbout`, awards
- ✅ FAQ schema on home + local pages
- ✅ AI-friendly entity blocks on local SEO pages
- 📋 Per-page FAQ blocks on services — backlog

### Performance (70/100)
- ✅ Font `display: swap` + preload on primary fonts
- ✅ `next/image` in brand components
- ✅ Vercel cache headers for static assets + images
- ⚠️ Hero fetches `/api/hero-images` client-side
- ⚠️ Three.js canvas optional but heavy when enabled
- 📋 Route-level code splitting audit — backlog

### CRO (74/100)
- ✅ Sticky FAB: WhatsApp + Book + Call
- ✅ Header CTA: Book Consultation
- ✅ Footer CTA strip
- ✅ Exit intent popup component exists
- ⚠️ No desktop sticky bottom bar
- 📋 Budget calculator page enhancement — Phase 17

### Trust Signals (80/100)
- ✅ Trust marquee with brand names
- ✅ Stats section with animated counters
- ✅ Testimonials carousel
- ✅ Awards badges in trust bar + footer
- ✅ 4.9★ rating displayed

---

## Actionable Fix List → Phase Mapping

| Priority | Issue | Phase | Status |
|----------|-------|-------|--------|
| Critical | Light theme invisible text | 2 | ✅ Done (tokens verified) |
| Critical | Local SEO pages missing | 12 | ✅ Done (6 pages) |
| High | JSON-LD gaps | 11 | ✅ Done (Service, FAQ, Review, Entity) |
| High | Nav glassmorphism + mega menu | 6 | ✅ Done |
| High | Sitemap missing local pages | 13 | ✅ Done |
| High | Trust section thin | 18 | ✅ Enhanced |
| Medium | Portfolio filters | 9 | 📋 Backlog |
| Medium | Venue search/filter | 10 | 📋 Backlog |
| Medium | Blog Article schema | 14 | 📋 Backlog |
| Medium | About GSAP timeline | 7 | 📋 Backlog |
| Low | Article schema all blog slugs | 14 | 📋 Backlog |
| Low | Docker/CI docs | 19 | 📋 Backlog |

---

## Files Audited

- **Pages:** 16 static routes + 12 service slugs + 8 blog slugs + 6 local SEO pages
- **Brand system:** `brand/design-system/tokens.css`, `brand/shell/*`, `brand/views/*`
- **Adaptive theme:** `lib/adaptive-theme/*`, `components/adaptive/*`
- **SEO:** `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`
- **Legacy:** `components/home/*` (partially superseded by brand views)

---

*Generated during Glitz 20-Phase Transformation — Session 1*
