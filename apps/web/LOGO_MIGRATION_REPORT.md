# Logo Migration Report — Nexyyra Events

**Date:** 2026-06-24  
**Commit message:** `fix(brand): remove checkerboard PNG, enforce SVG logos in header footer loader`

## Summary

Migrated all in-app logo display to self-contained SVG files with embedded, checkerboard-stripped raster data. Header, footer, loader, and hero now reference SVG paths only. PNG remains for favicon/PWA icons (monogram) and Open Graph (`nexyyra-og.png`).

## Checkerboard removal method

`scripts/generate-brand-assets.mjs` processes masters with **sharp** raw pixel buffers:

1. **Transparent master** (`nexyyra-logo-source.png`) — `stripCheckerboard()` sets `alpha=0` on low-saturation pixels matching studio checkerboard tones (~`#FFFFFF`, `#C0C0C0`, `#808080`).
2. **Dark master** (`nexyyra-logo-dark-source.png`) — `stripDarkBackground()` removes near-black studio backdrops (luminance &lt; 28, or low-saturation dark grays).
3. **Light theme** — modulated charcoal variant from cleaned transparent master (`brightness: 0.38`, `saturation: 0.12`).
4. **SVG output** — cleaned PNGs embedded as **base64 data URIs** inside SVG (`role="img"`, `<title>`, `aria-label`). No external PNG dependency in components.

Regenerate: `node scripts/generate-brand-assets.mjs`

## Old logo references removed

| Removed / deprecated | Notes |
|----------------------|-------|
| `BRAND_LOGO_ASSETS.gold`, `.black`, `.primary`, `.loader`, `.horizontal` | PNG display paths dropped from `logo.tsx` |
| `public/brand/nexyyra-logo.png` | Deleted on regenerate |
| `public/brand/nexyyra-logo-dark.png` | Deleted on regenerate |
| `public/brand/nexyyra-logo-light.png` | Deleted on regenerate |
| SVG wrappers linking to external PNG | Replaced with embedded base64 |
| `hero-brand-reveal.tsx` `Image` + `primary` PNG | Now `img` + `nexyyra-logo-dark.svg` |
| `load-screen.ts` stitch sanitizer | `nexyyra-logo-dark.png` → `.svg` |
| Legacy `public/logo*.png`, `brand/logo-*.svg` | Previously removed |

## New logo references added

| Path | Use |
|------|-----|
| `/brand/nexyyra-logo.svg` | Default / full logo |
| `/brand/nexyyra-logo-dark.svg` | Dark theme — gold luxury (header dark, loader, footer, hero) |
| `/brand/nexyyra-logo-light.svg` | Light theme — charcoal (header light) |
| `/brand/nexyyra-logo-source.png` | Transparent master (build input only) |
| `/brand/nexyyra-logo-dark-source.png` | Dark-bg master (build input only) |
| `/brand/nexyyra-monogram.png` | Favicon / PWA icon source only |
| `/brand/nexyyra-og.png` | SEO / Open Graph only |

## Header fixed

- **File:** `src/components/branding/logo.tsx`, `src/brand/shell/brand-header.tsx`
- **Sizing:** height 56px desktop / 40px mobile (`--brand-logo-height`)
- **Theme swap:** CSS dual-`img` with `brand-logo__img--theme-light` / `--theme-dark`
- **CSS:** removed square 56×56 width clamp that hid horizontal wordmark; header grid column widened; `opacity: 1`, `overflow: visible`, `z-index: 2`

## Footer fixed

- **File:** `src/brand/shell/brand-footer.tsx` — `Logo variant="footer"`
- **Sizing:** width 220px desktop / 160px mobile (`--brand-logo-footer-width`)
- **Theme:** `forceGold` on dark footer background
- **Hover:** gold + purple luxury glow preserved

## Loader fixed

- **File:** `src/components/effects/universe-loader.tsx`
- **Asset:** `BRAND_LOGO_ASSETS.dark` SVG (no checkerboard)
- **Animation:** 2.5s fade · gold/purple glow · tagline reveal · scale/zoom handoff

## Validation

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| `npm run build` | Pass (exit 0) |
| `npm run lint` | Pre-existing errors in `scripts/sync-media.ts`; new `no-img-element` warnings on intentional SVG `<img>` usage |
