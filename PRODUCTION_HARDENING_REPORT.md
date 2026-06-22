# Nexyyra Events — Production Hardening Report

**Date:** 2026-06-22  
**Branch:** master  
**Scope:** Phases 2–15 production readiness

---

## Summary

Completed header/theme logo fixes, experience mega menu, hero loader retiming (2.5s), carousel optimization, card layout parity, scroll skeletons, performance preloads, SEO structured data, accessibility improvements, CI workflows, and verification.

---

## Files Changed

| File | Change |
|------|--------|
| `apps/web/src/components/branding/logo.tsx` | CSS dual-image theme swap (black/gold), removed JS theme detection |
| `apps/web/src/styles/responsive-system.css` | Logo swap CSS, card equal-height grid, mobile nav animations |
| `apps/web/src/brand/shell/brand-header.tsx` | Framer Motion mega/mobile menus, experience categories, a11y |
| `apps/web/src/components/effects/universe-loader.tsx` | Retimed to 2.5s (LOADER_HANDOFF_MS 1800) |
| `apps/web/src/components/providers/cinematic-provider.tsx` | Faster hero handoff transition |
| `apps/web/src/brand/sections/home/hero-carousel-bg.tsx` | 5s autoplay, blur placeholders, Framer Motion |
| `apps/web/src/brand/sections/home/signature-experiences.tsx` | Equal-height card grid |
| `apps/web/src/components/shared/lazy-section.tsx` | Skeleton labels for a11y |
| `apps/web/src/brand/views/home-below-fold.tsx` | Tuned min-heights, section labels |
| `apps/web/src/app/layout.tsx` | logo-gold preload, humans.txt link |
| `apps/web/src/lib/seo.ts` | SearchAction JSON-LD on WebSite |
| `.github/workflows/build.yml` | **Created** — lint, typecheck, build |
| `.github/workflows/lighthouse.yml` | Added media sync env vars |
| `apps/web/public/logo-gold.png` | **Created** (from logo.png) |
| `apps/web/public/logo-gold.avif` | **Created** (from logo.avif) |
| `apps/web/public/security.txt` | **Created** |
| `apps/web/public/.well-known/security.txt` | **Created** |
| `apps/web/public/humans.txt` | **Created** |

## Files Deleted

None (safe dead-code removal deferred — no unused routes identified).

---

## Phase Completion

| Phase | Status | Notes |
|-------|--------|-------|
| 2 Header Fix | ✅ | CSS dual-logo, theme instant swap, mobile animations |
| 3 Experience Mega Menu | ✅ | 9 categories, Framer Motion, keyboard/outside-click, route-close via path state |
| 4 Hero Loader 2.5s | ✅ | LOADER_DURATION_MS=2500, LOADER_HANDOFF_MS=1800 |
| 5 Hero Carousel | ✅ | 5s autoplay, blur, Framer Motion, priority on first slide |
| 6 Card Layout | ✅ | Equal height cards/images, responsive grid |
| 7 Scroll Fix | ✅ | LazySection skeletons + min-heights |
| 8–9 Performance | ✅ | Hero/logo preload, font-display swap, dynamic below-fold imports |
| 10 SEO | ✅ | Metadata, OG, Twitter, JSON-LD graph, robots, sitemap, llms, security, humans |
| 11 Accessibility | ✅ | aria labels, skip link, focus states, sr-only loader labels |
| 12 CI | ✅ | build.yml + lighthouse.yml stabilized |
| 13–14 Cleanup | ✅ | Lint/typecheck/build pass (78 routes) |
| 15 Report + Git | ✅ | This document |

---

## Verification Results

```
npm run lint      — PASS
npm run typecheck — PASS
npm run build     — PASS (78 routes)
```

---

## Performance Estimates

| Metric | Before (est.) | After (est.) |
|--------|---------------|--------------|
| First-visit loader | ~5.0s | ~2.5s |
| Hero LCP blocking | Logo JS hydration flash | CSS instant theme swap |
| Below-fold JS | Eager | IntersectionObserver + dynamic import |
| Hero carousel CLS | Opacity-only swap | Blur placeholder + fixed min-height hero |

---

## Lighthouse (Estimated Post-Deploy)

| Category | Score (est.) |
|----------|--------------|
| Performance | 82–88 |
| Accessibility | 92–96 |
| Best Practices | 95–100 |
| SEO | 95–100 |

*Run `.github/workflows/lighthouse.yml` on push for artifact scores.*

---

## Bundle

- Below-fold homepage sections dynamically imported (`home-below-fold.tsx`)
- `optimizePackageImports` enabled (Next.js 16)
- Priority images limited to hero first slide + header logo

---

## SEO Coverage

- **Metadata API:** `generateSEO()` sitewide
- **Open Graph / Twitter:** layout + per-page metadata
- **JSON-LD:** Organization, LocalBusiness, EventPlanningService, FAQ, Breadcrumb, WebSite, SearchAction, Review (homepage)
- **robots.txt:** `apps/web/src/app/robots.ts`
- **sitemap.xml:** `apps/web/src/app/sitemap.ts`
- **llms.txt:** `apps/web/public/llms.txt`
- **security.txt:** `public/security.txt` + `.well-known/security.txt`
- **humans.txt:** `public/humans.txt`

---

## CI/CD Status

| Workflow | Purpose | Status |
|----------|---------|--------|
| `ci.yml` | Full monorepo lint + build + API typecheck | Existing |
| `build.yml` | Web-only lint, typecheck, build | **New** |
| `lighthouse.yml` | Lighthouse CI on key routes | Updated |

---

## Deployment

Ready for production deploy to Vercel/origin. No `.env` changes committed.
