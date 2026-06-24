# Nexyyra Events — Logo Migration Report

**Date:** 2026-06-24  
**Commit:** `feat: migrate entire platform to new Nexyyra Events logo system and SVG branding architecture`

## Summary

Migrated the entire platform from legacy logo assets to the new official Nexyyra Events logo (transparent PNG master). Theme-aware SVG wrappers, NX monogram icons, header/footer/loader integration, SEO/OpenGraph updates, and PWA manifest icons are complete.

## 1. Files Replaced / Created

| Asset | Path | Size |
|-------|------|------|
| Master source | `public/brand/nexyyra-logo-source.png` | 186 KB |
| Full logo PNG | `public/brand/nexyyra-logo.png` | 437 KB |
| Dark theme PNG | `public/brand/nexyyra-logo-dark.png` | — |
| Light theme PNG | `public/brand/nexyyra-logo-light.png` | 609 KB |
| SVG wrappers | `nexyyra-logo.svg`, `-dark.svg`, `-light.svg` | ~330 B each |
| NX monogram | `nexyyra-monogram.png` / `.svg` | 370 KB / 281 B |
| OG image | `nexyyra-og.png` (1200×630) | 477 KB |
| Favicon | `favicon.svg`, `favicon-16.png`, `favicon-32.png`, `favicon.ico` | — |
| PWA | `apple-touch-icon.png`, `android-chrome-*.png`, maskable icons | — |
| Generator | `scripts/generate-brand-assets.mjs` | — |

## 2. Files Removed

- `public/logo.png`, `logo-black.png`, `logo-gold.png`
- `public/logo.avif`, `logo-black.avif`, `logo-gold.avif`
- `public/brand/logo-primary.png`, `logo-symbol.png`
- `public/brand/logo-gold.svg`, `logo-light.svg`, `logo-mark-*.svg`
- `public/logos/nexyyra-gold.svg`

## 3. Code Updated

| Area | File |
|------|------|
| Logo component | `src/components/branding/logo.tsx` |
| Header | `src/brand/shell/brand-header.tsx` (via Logo) |
| Footer | `src/brand/shell/brand-footer.tsx` |
| Loader | `src/components/effects/universe-loader.tsx` |
| Layout / icons | `src/app/layout.tsx` |
| SEO / JSON-LD | `src/lib/seo.ts`, `sitemap.ts`, `local-seo-pages.ts`, `location-pages.ts` |
| PWA | `public/manifest.json` |
| Vercel cache | `vercel.json` |
| Stitch | `src/lib/stitch/load-screen.ts` |
| Styles | `src/styles/responsive-system.css` |

## 4. Theme Support

| Theme | Logo asset | Behavior |
|-------|------------|----------|
| Light | `nexyyra-logo-light.svg` | Charcoal/darkened — visible on ivory backgrounds |
| Dark | `nexyyra-logo-dark.svg` | Gold luxury — premium on dark backgrounds |
| Menu overlay | `forceGold` | Always gold variant |

CSS swap via `.brand-logo__img--theme-light` / `--theme-dark` — zero hydration flash.

## 5. Favicon & PWA

- **favicon.svg** — NX monogram only
- **favicon.ico** — 16×16 + 32×32 from monogram
- **apple-touch-icon.png** — 180×180
- **android-chrome-192/512.png** — manifest `any` purpose
- **icon-*-maskable.png** — PWA safe zone

## 6. SEO Updates

- Default OG/Twitter image: `/brand/nexyyra-og.png`
- Organization / LocalBusiness / WebSite schema `logo` and `image` fields updated
- Sitemap image fallbacks updated

## 7. Performance

- SVG wrappers ~330 B — instant parse, embedded PNG cached separately
- Header preloads: `nexyyra-logo-dark.svg`, `nexyyra-logo-light.svg`, `nexyyra-monogram.png`
- Fixed dimensions on logo slot (`--brand-logo-width/height`) — **no CLS**
- Native `<img>` for theme swap (intentional — avoids next/image hydration mismatch)

## 8. Loader Animation (2.5s)

1. Logo fades in  
2. Gold radial glow  
3. Purple accent glow (violet radial)  
4. Tagline letter reveal  
5. Scale-down handoff  
6. Homepage reveal  

## 9. Validation

| Check | Result |
|-------|--------|
| `npm run build` | ✅ Pass |
| `npm run lint` | ⚠️ Pre-existing `sync-media.ts` hook naming warnings (unrelated) |
| TypeScript | ✅ Pass (via build) |

## 10. Regenerate Assets

```bash
cd apps/web
node scripts/generate-brand-assets.mjs
```

Place master PNG at `public/brand/nexyyra-logo-source.png` before running.
