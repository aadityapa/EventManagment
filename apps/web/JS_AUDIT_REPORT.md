# JS_AUDIT_REPORT — Nexyyra Events (2026-06-21)

## Critical path reductions

| Change | Impact |
|--------|--------|
| Removed GSAP from `hero-video-background.tsx` | ~15–25 KB + main-thread Ken Burns |
| CSS `@keyframes hero-ken-burns` replaces GSAP tween | GPU composited |
| `HomeExperienceWorlds` + `HomeSignatureExperiences` → `dynamic()` | Deferred framer-motion chunks |
| All below-fold homepage sections use `dynamic()` + min-height placeholders | Smaller initial JS |
| `HeroCinematicFx`, `HeroWorldCards` already dynamic `ssr: false` | Off critical path |

## Still on initial bundle (acceptable)
- `framer-motion` — layout, header, cinematic provider, hero copy
- `lenis` — loaded via `SmoothScrollProvider` after premiere (`enabled={premiereComplete}`)
- `leaflet` — venues page only (code-split by route)

## Not on homepage
- `three.js` — only `hero-three-canvas.tsx` (unused on home)

## Animation fixes (main thread)
- `hero-cinematic-fx.tsx`: spotlight uses `translateX/Y` not animated `left/top`
- `page-transition.tsx`: route curtain uses `scaleY` not `height`

## Recommendations
- Lazy-load `SmoothScrollProvider` after `premiereComplete` with dynamic import
- Consider `LazyMotion` + `domAnimation` for framer-motion tree-shaking
- Audit `lucide-react` — already in `optimizePackageImports` in next.config.ts
