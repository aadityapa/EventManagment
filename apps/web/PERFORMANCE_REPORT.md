# PERFORMANCE_REPORT — Nexyyra Events (2026-06-21)

## Production optimization pass summary

### Phase 1 — Images
- Placeholders: 6.7 MB → 320 KB WebP
- Hero: optimized delivery, no duplicate logo preloads
- See `IMAGE_AUDIT_REPORT.md`

### Phase 2 — CLS
- Header placeholder during loader
- CSS theme logos
- Section skeleton heights
- See `CLS_REPORT.md`

### Phase 3 — LCP
- Hero poster preload w1200
- GSAP → CSS Ken Burns
- See `LCP_REPORT.md`

### Phase 4–7 — JS / animations / DOM
- Dynamic homepage sections
- GPU-only route curtain + spotlight
- See `JS_AUDIT_REPORT.md`

### Phase 8 — Header
- Logo CLS fix, grid layout (prior pass)

### Phase 9 — Scroll blank sections
- ScrollReveal fallback (prior pass)

### Phase 10–11 — A11y + llms.txt
- See `SEO_REPORT.md`

### Phase 14 — CI/CD
- `ci.yml`: lint, tsc, build
- `lighthouse.yml`: 3 runs, added `/venues`

## Build
Next.js 16.2.7 — 79 routes, TypeScript clean.

## Post-deploy validation
Run Lighthouse mobile + desktop on https://nexyyra.com
