# Nexyyra Events — Official Brand Assets

All assets in this folder are **generated** — do not edit by hand.

- **Source (not served):** `apps/web/scripts/assets/nexyyra-logo-raw.png`
  (official logo on a black background)
- **Generator:** `apps/web/scripts/generate-brand-assets.mjs`

Regenerate everything:

```bash
cd apps/web
node scripts/generate-brand-assets.mjs
```

The generator removes the black background to produce a **transparent** master,
then embeds it as base64 inside self-contained SVGs (so they render correctly in
`<img>` tags with no checkerboard and no blocked external references).

| Asset | Use |
|-------|-----|
| `nexyyra-logo.svg` / `nexyyra-logo-dark.svg` | Gold logo — dark theme, loader, hero, OG |
| `nexyyra-logo-light.svg` | Charcoal logo — light theme |
| `nexyyra-monogram.svg` | NX monogram — favicon, app icons |
| `nexyyra-og.png` | Open Graph / Twitter / SEO card (1200×630) |
| `apple-touch-icon.png` | iOS home screen (180) |
| `android-chrome-192/512.png` | Android / manifest |
| `icon-192/512-maskable.png` | PWA maskable icons |
