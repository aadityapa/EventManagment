# Nexyyra Events — Image Library

Drop source images (JPG, PNG, WebP) into category folders. The media system auto-generates:

- WebP master + responsive variants (`640w`, `828w`, `1200w`, `1920w`)
- Blur placeholders for Next.js Image
- `public/media-manifest.json` index

## Folders

| Folder | Used on |
|--------|---------|
| `hero/` | Homepage hero, hero gallery |
| `weddings/` | Wedding services |
| `corporate/` | Corporate events |
| `destination/` | Destination weddings |
| `celebrity/` | Celebrity events |
| `venues/` | Venue pages |
| `portfolio/` | Portfolio grid |
| `stories/` | Story gallery |
| `gallery/` | Main gallery page |

## Optional metadata sidecar

`my-photo.jpg.meta.json`:

```json
{
  "category": "award-ceremony",
  "title": "Tata Awards Night",
  "alt": "Luxury awards ceremony by Nexyyra Events",
  "featured": true,
  "sortOrder": 1
}
```

## Categories

`wedding`, `corporate`, `destination`, `celebrity`, `brand-activation`, `venue`, `award-ceremony`, `fashion-show`

## Commands

```bash
npm run media:sync    # Rebuild manifest + WebP variants
```

## Admin upload

Visit `/admin/media` (requires ADMIN/STAFF login, or `MEDIA_ADMIN_BYPASS=1` in dev).
