# CLS_REPORT — Nexyyra Events (2026-06-21)

## Root causes addressed

| Source | Fix |
|--------|-----|
| Header unmount during loader | `brand-header-placeholder` reserves `--nav-height` |
| Logo theme hydration swap | Dual PNG + CSS `html.light` visibility (no JS src change) |
| Below-fold sections lazy load | `min-h-[*vh]` skeleton placeholders in `home-view.tsx` |
| Homepage scroll opacity:0 | ScrollReveal fallback (prior pass) |
| Route curtain height animation | `scaleY` transform only |

## Image dimension discipline
- `BrandImage` / `OptimizedMediaImage`: require `fill` + `sizes` or explicit `width`/`height`
- Logos: fixed `440×160` intrinsic dimensions
- Experience cards: fixed `520px` / `360px` image heights (prior pass)
- Hero: `aspect` container + `fill` poster

## Target
- Desktop CLS < 0.03
- Mobile CLS < 0.05

## Verify post-deploy
Run Lighthouse → Layout Shift culprits on `/` and `/venues`.
