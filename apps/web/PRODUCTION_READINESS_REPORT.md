# Production Readiness Report — Nexyyra Events

**Date:** 2026-06-22  
**Branch:** master  
**Site:** https://www.nexyyra.com

---

## Executive Summary

| Check | Before | After | Status |
|-------|--------|-------|--------|
| TypeScript | 0 errors | **0 errors** | ✅ Pass |
| ESLint | 11 errors, 18 warnings | **0 errors, 0 warnings** | ✅ Pass |
| Production build | Pass | **Pass** (79 routes) | ✅ Pass |
| npm audit | 2 critical | **0 vulnerabilities** | ✅ Pass |
| Hydration (known patterns) | Logo/theme risk | Fixed via `useSyncExternalStore` | ✅ Improved |
| Lighthouse (local CI) | Not run in agent env | See targets below | ⚠️ Verify on Vercel |

---

## 1. Errors Found & Fixed

### ESLint errors (11 → 0)

| File | Issue | Fix |
|------|-------|-----|
| `hero-carousel-bg.tsx` | `setState` in `useEffect` on slide change | Split inner component with `key={slideKey}` remount |
| `brand-header.tsx` | `setState` in `useEffect` on pathname | Path-scoped menu state (`menuPath === pathname`) |
| `logo.tsx` | `setMounted` in `useEffect` | `useSyncExternalStore` hydration-safe mount |
| `universe-loader.tsx` | `Math.random` in `useMemo` (purity) | `useState(createGoldParticles)` lazy init |
| `luxury-masonry-gallery.tsx` | `setVisibleCount` in `useEffect` | `MasonryAssetGrid` keyed by filter |

### ESLint warnings (18 → 0)

Removed unused imports/vars in: `page.tsx`, `dedupe-images.ts`, `adaptive-theme-provider.tsx`, `hero-gallery.tsx`, `portfolio-grid.tsx`, `brand-images.ts`, `manifest-io.ts`, `manifest-service.ts`, `sitemap-lastmod.ts`, `fallback.ts`, `brand-images.generated.ts`.

### TypeScript

- Fixed `hero-gallery.tsx` missing `EASE` import after lint cleanup.

### npm audit

- `npm audit fix` — resolved `shell-quote` / `concurrently` critical advisories.

### Security / hydration

- Theme logo no longer uses dual hidden images + `useEffect` mount flash.
- Header menus auto-close on route change without effect-based resets.

---

## 2. Files Changed

```
src/components/branding/logo.tsx
src/brand/sections/home/hero-carousel-bg.tsx
src/brand/shell/brand-header.tsx
src/components/effects/universe-loader.tsx
src/components/media/luxury-masonry-gallery.tsx
src/components/media/hero-gallery.tsx
src/components/media/portfolio-grid.tsx
src/components/adaptive/adaptive-theme-provider.tsx
src/app/page.tsx
src/lib/media/brand-images.ts
src/lib/media/manifest-io.ts
src/lib/media/manifest-service.ts
src/lib/media/fallback.ts
src/lib/sitemap-lastmod.ts
src/brand/data/brand-images.generated.ts
scripts/dedupe-images.ts
package-lock.json (root — audit fix)
```

---

## 3. Dead Code (knip) — Not Removed

Knip reported **74 unused files** and **17 unused dependencies**. These are legacy hero v4, stitch, and alternate page-content modules kept for reference or future routes. **Intentionally not deleted** in this pass to avoid breaking dynamic imports or planned features.

**Recommendation:** Run a dedicated cleanup PR to remove `hero-v4.tsx`, `hero-video-background.tsx`, and duplicate `*-page-content.tsx` wrappers after confirming zero dynamic imports.

---

## 4. Bundle Size

No bundle analyzer run in this environment. Existing optimizations in place:

- Below-fold homepage sections: `dynamic()` + `LazySection`
- Live Drive media: server-cached, no client manifest bundle
- Hero: static SSR + lightweight carousel client JS
- Premiere loader: session-scoped, skipped on return visits

**To measure locally:**
```bash
cd apps/web
npm run build
# Inspect .next/static/chunks or add @next/bundle-analyzer
```

---

## 5. Lighthouse (Estimated)

| Metric | Before (reported) | After (expected) | Target |
|--------|-------------------|------------------|--------|
| Performance Mobile | 39 | 65–85 | 95+ |
| Performance Desktop | 49 | 75–90 | 98+ |
| LCP | 13.3s | 2–4s | <2s |
| CLS | 0.818 | 0.02–0.08 | <0.05 |
| Accessibility | — | 95–100 | 100 |
| Best Practices | — | 95–100 | 100 |
| SEO | — | 95–100 | 100 |

**Run on production after deploy:**
```bash
npx lighthouse https://www.nexyyra.com --view
```

Remaining blockers for **95+ mobile Performance:**

1. Seven Google fonts in `layout.tsx` — reduce to Playfair + Manrope
2. Framer Motion + GSAP on below-fold sections
3. Third-party scripts (GA, Sentry, Hotjar, cookie consent)
4. Large remote Google Drive images when sections load

---

## 6. Accessibility / SEO / CLS / LCP

| Area | Status |
|------|--------|
| **Semantic HTML** | `<header>`, `<nav>`, `<main>`, `<footer>`, skip link |
| **ARIA** | Mega menu `aria-expanded`, mobile `aria-modal`, hero `aria-label` |
| **CLS** | Fixed 90px header, 180×60 logo slot, lazy section skeletons |
| **LCP** | Hero preload + live Drive first slide + AVIF logos |
| **SEO** | JSON-LD on homepage, sitemap, `llms.txt`, metadata via `generateSEO()` |

---

## 7. Commands Verified

```bash
npm run lint      # 0 errors, 0 warnings
npm run typecheck # 0 errors
npm run build     # 79 routes, success
npm audit         # 0 vulnerabilities
npx knip          # informational — 74 unused files (not auto-deleted)
```

---

## 8. Vercel Checklist

- [ ] `GOOGLE_DRIVE_API_KEY` + `MEDIA_LIVE_SYNC=1`
- [ ] `CRON_SECRET` for `/api/cron/media-sync`
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- [ ] Run Lighthouse on production URL post-deploy

---

*Generated by production readiness scan.*
