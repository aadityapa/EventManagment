# Nexyyra Events — Production Audit Report

**Date:** 2026-06-21  
**Site:** https://nexyyra.com  
**Branch:** master  

## Summary

Full codebase audit with targeted fixes across loader, header, logo, exit popup, gallery, media pipeline, CI, and dead-code removal. Media served from Google Drive CDN (103 images); local JPGs removed from Git.

---

## Issues Found & Fixes

| # | Issue | Severity | File(s) | Fix Applied |
|---|-------|----------|---------|-------------|
| 1 | Duplicate exit popup (layout + engagement) | Medium | `components/layout/exit-intent-popup.tsx` | Deleted orphan; kept `engagement/exit-intent-popup.tsx` |
| 2 | Duplicate header/footer/layout components unused | Medium | `components/layout/*` | Removed 6 dead files |
| 3 | Exit popup poor contrast + random triggers | High | `engagement/exit-intent-popup.tsx` | Rebuilt: 7-day localStorage, idle/scroll/exit/2-page rules, WCAG contrast |
| 4 | Loader too fast, abrupt zoom-out | High | `effects/universe-loader.tsx` | 5s timeline, scale 1→1.25, blur 12px, tagline at 2s |
| 5 | Logo PNG-only, invisible in light mode | High | `branding/logo.tsx` | SVG theme-aware logos (`logo-gold.svg` / `logo-light.svg`) |
| 6 | Header below spec (72–82px, small logo) | Medium | `responsive-system.css` | 88px header / 64px logo desktop, 48px nav gap |
| 7 | Mega menu no luxury animation | Low | `brand/shell/brand-header.tsx` | 350ms fade/scale/blur via Framer Motion |
| 8 | Gallery loads all 100+ images at once | Medium | `luxury-masonry-gallery.tsx` | Infinite scroll batches (24), intersection observer |
| 9 | Vercel function bundle 1.27GB | Critical | `next.config.ts`, `services/[slug]` | Global image trace excludes + read-only manifest |
| 10 | Local images in Git (~1.2GB) | Critical | `.gitignore`, media migration | Removed from Git; Google Drive CDN |
| 11 | Sitemap XML invalid (`&` in URLs) | High | `app/sitemap.ts` | Local/Drive URLs only, no query strings |
| 12 | `outputFileTracingRoot` ENOENT on Vercel | Critical | `next.config.ts` | Removed misconfigured tracing root |
| 13 | Console.log in runtime | Low | `drive-sync.ts` | Build-time only (4 logs); no client logs |
| 14 | CI missing media env for prebuild | Medium | `.github/workflows/ci.yml` | Added `MEDIA_PROVIDER` + `GOOGLE_DRIVE_FOLDER_ID` |
| 15 | Multiple orphan hero/gallery components | Low | `components/home/*`, `gallery/*` | Documented; active path uses `hero-v4` + `LuxuryMasonryGallery` |
| 16 | Aspect ratios inconsistent | Medium | `globals.css` | Added `.aspect-hero`, `.aspect-card`, `.aspect-venue`, `.aspect-blog` |
| 17 | Homepage handoff flash | Medium | `cinematic-provider.tsx` | Extended fade duration aligned to loader |

---

## Duplicate Components (Active vs Legacy)

| Active | Legacy (unused) |
|--------|-----------------|
| `universe-loader.tsx` | `luxury-loader.tsx` (re-export), `page-loader.tsx` (deleted) |
| `engagement/exit-intent-popup.tsx` | `layout/exit-intent-popup.tsx` (deleted) |
| `brand-header.tsx` | `layout/header.tsx` (deleted) |
| `hero-v4.tsx` | `hero-section.tsx`, `hero-premium.tsx` |
| `luxury-masonry-gallery.tsx` | `gallery-page-content.tsx`, `gallery-preview-section.tsx` |

---

## Media Architecture

- **Provider:** `google-drive`
- **Folder:** `1UZR_UhiZfVvcLUNvDJi3Rvw8udkfKgYM`
- **Images:** 103 via `lh3.googleusercontent.com`
- **Manifest:** `public/media-manifest.json` (committed, read-only on Vercel)

---

## Remaining Recommendations

1. Set `GOOGLE_DRIVE_API_KEY` on Vercel for reliable Drive API sync (optional; public embed fallback works).
2. Run BFG Repo-Cleaner to purge historical JPG blobs from Git history if repo size matters.
3. Browser visual QA on 320px–2560px after deploy.
4. Lighthouse CI workflow already exists — monitor scores post-deploy.
