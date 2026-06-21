# SEO_REPORT — Nexyyra Events (2026-06-21)

## Implemented
- `public/llms.txt` — AI/agent discovery file
- `layout.tsx` — `<link rel="author" href="/llms.txt">`
- JSON-LD global graph in layout
- Homepage FAQ, Review, Speakable, Breadcrumb schemas
- `sitemap.xml`, `robots.txt`, `manifest.json`
- Semantic landmarks: `<main id="main-content">`, `<header role="banner">`, `<footer role="contentinfo">`
- `aria-labelledby` on Signature Experiences section

## Accessibility tree (agentic browsing)
- Skip link to `#main-content`
- Header nav `aria-label="Main navigation"`
- FAB `aria-label` per action
- Destination map `role="region"` + `aria-label`

## Target scores
- SEO: 100
- Accessibility: 100
- Best Practices: 100

## Verify
Lighthouse SEO + Accessibility on production after deploy.
