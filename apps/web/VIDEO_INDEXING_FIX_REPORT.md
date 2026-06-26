# Google Search Console Video Indexing Fix Report

Date: 2026-06-26

## Issue

Google Search Console validation failed for:

- `/ai`
- `/book-event`
- `/contact`
- `/faqs`
- `/privacy`
- `/terms`
- `/blog`
- `/pricing`
- `/wedding-planner-pune`

Reason: **Video isn't on a watch page**

These URLs are not dedicated video/watch pages, so they must not emit video
structured data or render decorative video elements that cause Google to classify
the page as video-related.

## Audit Coverage

Searched the codebase for:

- `VideoObject`
- JSON-LD / `application/ld+json`
- OpenGraph video metadata (`og:video`)
- Twitter player/video metadata
- HTML5 `<video>`
- `iframe`
- YouTube / Vimeo / ReactPlayer
- hero/background video components
- gallery/video components
- media manifest video data

## Findings

No active page emitted `VideoObject`, `og:video`, or `twitter:player`.

However, several decorative/dormant video render paths existed:

- `BrandHero` supported a decorative background `<video>`.
- `CinematicHero` supported a decorative background `<video>`.
- `/gallery` fetched media videos and could render a highlight `<video>`.
- The tracked `public/videos/.gitkeep` folder implied video delivery support.

The media manifest currently indexes **0 videos**, so these non-watch pages should
use image-only presentation until a dedicated video route exists.

## Fixes Applied

### Non-Watch Pages Cleaned

The following page classes now have no video rendering or video metadata:

- informational pages: `/ai`, `/faqs`, `/privacy`, `/terms`
- conversion pages: `/book-event`, `/contact`, `/pricing`
- listing pages: `/blog`
- landing pages: `/wedding-planner-pune` and other general service/location pages
- gallery landing page: `/gallery`

### Video Signals Removed

- Removed decorative `<video>` branch from `src/brand/primitives/brand-hero.tsx`.
- Removed decorative `<video>` branch from `src/components/shared/cinematic-hero.tsx`.
- Removed `getMediaVideos()` from `src/app/gallery/page.tsx`.
- Removed gallery highlight reel `<video>` from `src/brand/views/gallery-view.tsx`.
- Deleted empty tracked `public/videos/.gitkeep`.

### Structured Data Guard Added

Added `videoObjectSchema()` in `src/lib/seo.ts`.

It returns `null` unless `hasDedicatedVideo` is explicitly true and restricts
valid paths to real watch-page route shapes:

- `/videos/*`
- `/stories/*`
- `/portfolio/video/*`
- `/gallery/video/*`

This prevents future accidental `VideoObject` generation on legal pages, landing
pages, contact pages, FAQs, pricing pages, blog listings, and decorative hero
sections.

`jsonLdScripts()` now safely filters `null` schemas, so guarded schema helpers
can be composed without emitting empty JSON-LD scripts.

## Remaining Allowed Video Infrastructure

The generic media provider still supports video records internally, but no
non-watch page renders videos or emits video schema. This keeps the CMS/media
API future-ready while avoiding Search Console video indexing signals.

Current build media sync output:

- Indexed images: 102
- Indexed videos: 0

## Validation

Commands run:

```bash
npm run lint
npm run typecheck
npm run build
```

Results:

- `npm run lint`: pass
- `npm run typecheck`: pass
- `npm run build`: pass
- Static pages generated: 86

## Google Search Console Next Step

After deployment, start a new validation in:

**Google Search Console -> Video indexing -> Video isn't on a watch page -> Start new validation**

Expected result after Google re-crawls:

- No affected non-watch pages should be reported as video pages.
- `Video URL` should remain absent because these pages no longer contain video
  markup or video structured data.

