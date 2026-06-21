# Nexyyra Events — Logo & UX Fix Report

**Date:** 2026-06-22  
**Scope:** Exit popup removal, loader logo visibility, header logo/layout, loader/header sequencing

---

## Issues Found & Fixed

### 1. Exit-intent / offer popup (removed)

| Issue | Location | Fix |
|-------|----------|-----|
| `ExitIntentPopup` with 10% discount + email capture | `src/components/engagement/exit-intent-popup.tsx` | **Deleted** component file |
| Popup mounted in root layout | `src/app/layout.tsx` | Removed import and `<ExitIntentPopup />` |
| Orphan CSS | `src/app/globals.css` `.exit-intent-popup` | Removed |
| Legacy storage key cleanup | `src/lib/cache-version.ts` | Kept `exit-intent-shown` in `LEGACY_SESSION_KEYS` for cache invalidation |

No other `OfferPopup`, `LeadCaptureModal`, `DiscountPopup`, `useExitIntent`, or `showPopup` implementations existed in the codebase. `LeadMagnetsSection` on `/book-event` is an inline resources section (not a modal) and was left intact.

---

### 2. Loader logo invisible

| Issue | Root cause | Fix |
|-------|------------|-----|
| Tagline visible but logo missing | `BRAND_LOGO_ASSETS.loader` pointed to `/brand/logo-gold.svg`, an SVG wrapper that embeds PNG via `<image href="/brand/logo-primary.png">`. When loaded through Next.js `<Image>`, embedded SVG references fail to render (blank/invisible asset). | Switched loader to **`/brand/logo-primary.png`** directly |
| Loader below header | Loader used `z-[90]`; header used `--z-nav: 9999` | Loader set to **`z-[99999]`**; header `--z-nav` set to **`100`** |
| Animation sequence misaligned | Timings did not match spec | Rebuilt sequence: 0s bg → 0.5s particles → 1.0s logo fade → 1.5s scale → 2.0s brand name → 2.5s tagline → 3.0s glow → 4.0s zoom → 5.0s reveal |
| Skip button overlapped nav area | Position used `--nav-height` while header still visible | Skip button moved to `top-4` |
| Body scroll during loader | Partially handled | Confirmed `CinematicProvider` sets `document.body.style.overflow = "hidden"` while `premiereActive` |

**Loader asset path used:** `/brand/logo-primary.png`  
**Alias path created:** `/logos/nexyyra-gold.svg` (copy of brand SVG for reference; runtime uses PNG)

---

### 3. Header logo invisible + layout

| Issue | Root cause | Fix |
|-------|------------|-----|
| Empty header left column | Same broken SVG-via-`<Image>` pattern as loader | `BrandLogoImage` now loads **`/brand/logo-primary.png`** with `unoptimized` |
| Logo covered by pseudo-element | `.brand-logo::before` shine overlay at `z-index: 2` without img stacking | Added `position: relative; z-index: 1` on `.brand-logo__img` |
| Logo left-aligned in column | Missing center alignment | Logo column: `justify-content: center`; link and img centered |
| Grid not matching spec | Was `220px 1fr 300px` at 1120px | Updated to **`220px 1fr 320px`** at **1024px+** |
| Logo width inconsistent | Variable auto width | Header logo slot fixed at **180px (`11.25rem`)** |
| Nav height | Already correct on desktop | **`--nav-height: 5.5rem` (88px)** at 1024px+ confirmed |

**Header logo paths:**
- Dark / default: `/brand/logo-primary.png`
- Light theme: same PNG + CSS filter (`brightness/contrast/saturate`) via `.brand-logo__img--light-theme`
- Symbol mark: `/brand/logo-symbol.png`

---

### 4. Header visible before loader completes

| Issue | Fix |
|-------|-----|
| Header rendered with opacity animation during handoff (`handoffActive`) while loader still mounted | `BrandHeader` now **returns `null`** until `skipPremiere \|\| premiereComplete` — header not in DOM until loader fully completes |
| Loader z-index vs header | Loader `99999` > header `100` |

---

### 5. Duplicate homepage logo

| Finding | Action |
|---------|--------|
| `HeroBrandReveal` component exists but is **not imported** anywhere | No duplicate logo on homepage; hero uses tagline-only copy in `hero-v4.tsx` |
| Updated `hero-brand-reveal.tsx` asset path to PNG for future use | Preventive fix |

---

## Files Deleted

- `src/components/engagement/exit-intent-popup.tsx`

## Files Modified

- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/components/branding/logo.tsx`
- `src/components/branding/hero-brand-reveal.tsx`
- `src/components/effects/universe-loader.tsx`
- `src/brand/shell/brand-header.tsx`
- `src/styles/responsive-system.css`
- `src/styles/design-system.css`

## Files Added

- `FIX_REPORT.md` (this file)
- `public/logos/nexyyra-gold.svg` (alias copy)

## Logo Asset Inventory

| Path | Purpose |
|------|---------|
| `/brand/logo-primary.png` | **Primary** — loader, header, footer, OG |
| `/brand/logo-symbol.png` | Icon-only / favicon mark |
| `/brand/logo-gold.svg` | Legacy SVG wrapper (not used at runtime) |
| `/brand/logo-light.svg` | Legacy light SVG wrapper (not used at runtime) |
| `/logos/nexyyra-gold.svg` | Alias copy for spec compatibility |
| `/logo.png` | Preload / favicon fallback |

## Verification

Run from `apps/web`:

```bash
npm run build
```

Clear session storage key `glitz-v6-premiere-seen` (or use incognito) to re-test the full loader sequence.
