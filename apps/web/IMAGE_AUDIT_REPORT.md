# IMAGE_AUDIT_REPORT — Nexyyra Events (2026-06-21)

## Summary
| Category | Before | After |
|----------|--------|-------|
| Placeholder PNGs (4 files) | ~6.7 MB | ~320 KB WebP |
| Logo duplicates | logo.png + logo.jpg + brand copies | logo.png + logo-black.png only |
| Hero LCP | w1920 preload competing with logos | w1200 preload on homepage only |
| Hero world cards | `unoptimized` raw Image | `BrandImage` + next/image optimization |
| Logos in header | `unoptimized` + theme JS swap | next/image + CSS dual-theme (no CLS) |

## Actions taken

### Placeholders → WebP
| File | PNG size | WebP size |
|------|----------|-----------|
| generic-coming-soon | 1177 KB | 27 KB |
| corporate-coming-soon | 1543 KB | 45 KB |
| destination-coming-soon | 1987 KB | 102 KB |
| portfolio-coming-soon | 2037 KB | 146 KB |

Script: `apps/web/scripts/optimize-placeholders.mjs`

### Remote images (103 Drive assets)
- Served via `lh3.googleusercontent.com` with next/image srcset
- Hero poster: `quality={80}`, `fetchPriority="high"`, `sizes="100vw"`, blur placeholder
- `OptimizedMediaImage` / `BrandImage` use default lazy loading except `priority` flag

### Removed
- `public/logo.jpg` (duplicate of logo.png)
- Layout preloads for logo.png + logo.jpg (freed bandwidth for LCP)

### Remaining recommendations
- Run `node scripts/optimize-placeholders.mjs` after any placeholder PNG update
- Consider AVIF variants for local logos via `next/image` automatic format negotiation
- Drive sync could emit `=w1200` default for hero slides in `brand-images.generated.ts`
