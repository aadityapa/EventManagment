# Nexyyra PERFORMANCE_REPORT — 2026-06-21

## Build metrics
| Metric | Value |
|--------|-------|
| Framework | Next.js 16.2.7 (Turbopack) |
| Static routes | 79 |
| TypeScript | Clean |
| Media assets | 103 images via Google Drive CDN |
| Build time | ~35s (incl. media sync) |

## Optimizations in this pass

### Animation / scroll performance
- **Removed GSAP ScrollTrigger pin** from `HomePortfolioShowcase` — eliminates layout thrashing and blank pin spacers during Lenis scroll.
- **ScrollReveal fallback** — prevents permanent `opacity: 0` DOM nodes (reduces repaints from invisible sections).
- **ScrollTrigger.refresh()** on loader complete — corrects measurements after Lenis initializes.

### Code splitting (existing)
Homepage heavy sections already use `next/dynamic`:
- `HomePortfolioShowcase`
- `HomeVenueCollection`
- `HomeAwards`
- `HomeTestimonialsV5`
- `HomeMediaCoverage`
- `HomeLuxuryCta`

### Images
- All brand media served from `lh3.googleusercontent.com` (no 103 JPGs in git)
- `outputFileTracingExcludes` for `public/images/**` (prior pass)
- Logo uses lightweight SVG wrappers pointing to single PNG source

### Removed dead weight
- Exit intent popup component + CSS
- `exit-intent-shown` localStorage key from cache migration list
- GSAP ScrollTrigger dependency in portfolio showcase (smaller client bundle for that chunk)

## Lighthouse targets (estimated post-deploy)

| Category | Target | Notes |
|----------|--------|-------|
| Performance | > 95 | Requires live Vercel measurement; pin removal + dynamic imports help LCP/CLS |
| Accessibility | 100 | FAB has aria-labels; header nav preserved |
| Best Practices | 100 | HTTPS via Vercel, no mixed content on logos |
| SEO | 100 | Sitemap, schema, meta from prior passes |

## Recommended follow-up (not blocking deploy)
1. Run Lighthouse CI on preview URL after deploy
2. Add `loading="lazy"` audit on below-fold `BrandImage` instances
3. Consider `priority` only on hero LCP image

## Core Web Vitals expectations
- **LCP:** Hero image + loader gating — header hidden until complete avoids CLS from nav
- **CLS:** Equal-height experience cards reduce layout shift
- **INP:** Removed scroll pin reduces main-thread work during scroll
