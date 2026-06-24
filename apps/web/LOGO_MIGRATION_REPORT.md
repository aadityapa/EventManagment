# Nexyyra Events — Logo System Fix Report

**Date:** 2026-06-24
**Commit:** `fix: rebuild Nexyyra logo system with transparent SVGs (header/footer/loader/theme)`

## Root Causes (why the previous migration failed)

1. **Source PNG was not transparent.** `nexyyra-logo-source.png` had `hasAlpha: false` — the
   "transparent" original had the checkerboard pattern **baked into its pixels**. Every surface
   that rendered it (loader) showed the checkerboard.
2. **SVGs referenced external PNGs** via `<image href="/brand/...png">`. When an SVG is loaded
   through an HTML `<img src>` tag, browsers run it in restricted mode and **block external
   resource references** — so the header and footer logos rendered blank ("missing").

## Fix

1. Took the new official logo (on a black background) as the raw master.
2. **Removed the black background** programmatically (luminance key with soft anti-aliased edges)
   → a genuinely transparent master (782×784).
3. **Embedded the transparent raster as base64 inside self-contained SVGs.** These render
   correctly inside `<img>` (no blocked external references) and are fully transparent
   (no checkerboard, no white/opaque box).

## Old logo references removed

- `nexyyra-logo-source.png` (opaque, baked checkerboard) — deleted
- `nexyyra-logo.png`, `nexyyra-logo-dark.png`, `nexyyra-logo-light.png` (opaque rasters) — deleted
- `nexyyra-monogram.png`, `nexyyra-logo-master.png`, `nexyyra-logo-dark-source.png` (strays) — deleted
- Raw source moved **out of `/public`** to `scripts/assets/nexyyra-logo-raw.png` (not served)
- `BRAND_LOGO_ASSETS` keys `primary / gold / black / horizontal / monogram` removed (unused)

## New logo references added

| Asset | Path | Size |
|-------|------|------|
| Gold logo (dark theme/loader/hero/OG) | `/brand/nexyyra-logo.svg`, `nexyyra-logo-dark.svg` | 156 KB |
| Charcoal logo (light theme) | `/brand/nexyyra-logo-light.svg` | 144 KB |
| NX monogram (favicon/PWA) | `/brand/nexyyra-monogram.svg`, `/favicon.svg` | 196 KB |
| OG card 1200×630 | `/brand/nexyyra-og.png` | 270 KB |
| App icons | `apple-touch-icon`, `android-chrome-192/512`, `icon-*-maskable` | — |
| Favicons | `favicon.svg`, `favicon-16/32.png`, `favicon.ico` | — |

All logos served are `.svg` (transparent). No `.png`/`.jpg`/`.webp` logo is rendered in the UI.

## Header fixed

- Height-driven square slot: **56px desktop / 40px mobile** (`--brand-logo-height`).
- Removed the broken `width: 11.25rem` override that letterboxed/hid the logo.
- Theme images stacked with opacity swap — visible on every page, no z-index/overflow/opacity traps.

## Footer fixed

- Fluid width-driven slot: **220px desktop / 160px mobile** (`--footer-logo-width`).
- Luxury hover glow: gold + purple `drop-shadow`.
- Always renders (self-contained transparent SVG).

## Loader fixed

- Uses the transparent gold SVG (`BRAND_LOGO_ASSETS.loader`) — **no checkerboard, no image background**.
- 2.5s sequence: logo fade-in → gold glow → purple glow → tagline reveal → scale-down → homepage reveal.

## Theme switching

- Light theme → charcoal logo; Dark theme → gold logo.
- Pure CSS opacity swap keyed off `html.dark` — instant, zero hydration flash, no CLS.

## Validation

| Check | Result |
|-------|--------|
| `npm run lint` | ✅ 0 errors, 0 warnings |
| `npm run typecheck` | ✅ Pass |
| `npm run build` | ✅ Pass (86 pages) |

Also fixed a pre-existing lint/type error in `scripts/sync-media.ts`
(`useCommittedManifest` → `fallbackToCommittedManifest`).

## Regenerate

```bash
cd apps/web
node scripts/generate-brand-assets.mjs
```
