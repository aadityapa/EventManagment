# Nexyyra Luxury Redesign Report

Date: 2026-06-26

## Scope Delivered

This pass upgrades the Nexyyra Events experience toward a premium luxury event
brand while preserving the existing Next.js App Router architecture, SEO system,
media sync pipeline, route structure, and build stability.

## Design System

- Added `src/styles/luxury-redesign.css`.
- Introduced the requested luxury palette:
  - Background: `#050814`
  - Gold: `#D4AF37`
  - Rose gold: `#C8A36A`
  - Royal purple: `#6E3CBC`
  - Deep violet: `#3D246C`
  - Glass cards: `rgba(255,255,255,.04)`
  - Borders: `rgba(255,255,255,.08)`
- Added global luxury aurora, spotlight, glass, glow, and premium button styling.
- Upgraded shared section/card surfaces through CSS so existing services,
  portfolio, testimonials, awards, CTA, and footer inherit the refined visual
  language without duplicating components.

## Header

- Preserved existing accessible navigation and mega menu.
- Added shrink-on-scroll treatment through `.brand-site-header.is-scrolled`.
- Added gold underline hover animation for navigation links.
- Retained logo, theme toggle, Book Consultation CTA, sticky positioning, and
  responsive mobile menu.

## Homepage Hero

Replaced the centered hero with a server-rendered luxury split layout:

- Left editorial column:
  - luxury eyebrow
  - large Cormorant-style heading
  - refined descriptive copy
  - three CTA paths: Book Consultation, Explore Portfolio, AI Concierge
  - premium metric cards
- Right visual stage:
  - CSS-powered 3D logo orbit
  - floating image collage from synced event media
  - signature worlds card
  - aurora, grid, spotlight, and vignette layers

The hero remains LCP-conscious:

- Uses existing media sync data.
- Keeps image rendering through Next/Image via `BrandImage`.
- Avoids heavy Spline assets or new runtime-heavy dependencies.

## Loader

- Updated the cinematic intro duration to approximately 2 seconds.
- Bumped the storage key to show the new luxury premiere sequence to returning
  users after deployment.
- Preserved transparent SVG logo, glow, tagline reveal, scale, and handoff.

## Portfolio / Video Cleanup

To avoid conflicting with the current Search Console video validation:

- Removed remaining `showreel` wording.
- Replaced decorative Play icons with Sparkles icons.
- Deleted unused legacy `media-awards.tsx`.
- Confirmed no rendered `<video>`, YouTube/Vimeo embed, ReactPlayer, `og:video`,
  or `twitter:player` remains in TS/TSX source.

Dedicated video support should be added later only under watch-page routes such
as `/videos/*`, `/stories/*`, `/portfolio/video/*`, or `/gallery/video/*`.

## Validation

Commands run:

```bash
npm run lint
npm run typecheck
npm run build
```

Results:

- Lint: pass
- Typecheck: pass
- Production build: pass
- Static pages generated: 86
- Media sync: 102 images, 0 videos

## Notes

This is a production-safe design-system and homepage transformation pass. A full
page-by-page bespoke redesign for every route (dashboard, admin, all service
detail pages, all city pages, every article template, etc.) should be handled as
subsequent smaller passes so each route can be visually reviewed and validated
without risking SEO regressions.

