# LCP_REPORT — Nexyyra Events (2026-06-21)

## LCP element
Homepage hero poster (`HeroVideoBackground` → `KenBurnsPoster`)

## Optimizations applied

1. **Preload** — Server component `HomeHero` injects `<link rel="preload" as="image" href={w1200} fetchPriority="high">` for first slide poster only
2. **Removed competing preloads** — logo.png + logo.jpg removed from `layout.tsx` head
3. **Image props** — `quality={80}`, `priority`, `fetchPriority="high"`, `sizes="100vw"`, blur placeholder
4. **GSAP removed** — CSS Ken Burns avoids main-thread blocking before paint
5. **Font preload** — Only Manrope + Playfair preloaded; Inter preload disabled
6. **Below-fold code split** — All homepage sections except hero use `dynamic()`

## Expected improvement
- Desktop LCP: 5.2s → target < 1.5s (verify on production CDN)
- Mobile LCP: 13.3s → target < 2s (depends on 4G throttling + Drive CDN latency)

## Remaining bottleneck
Google Drive poster URLs (`lh3.googleusercontent.com`) — geographic latency. Consider Vercel Blob or Cloudinary for hero CDN edge caching.
