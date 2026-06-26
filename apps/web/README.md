# Nexyyra Web (Frontend)

Next.js 16 frontend for [Nexyyra Events](https://nexyyra.com). See the [root README](../../README.md) for monorepo layout, backend API, and deployment.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Logo assets

- **Source (not served):** `scripts/assets/nexyyra-logo-raw.png`
- **Generated outputs:** `public/brand/`, `public/favicon*`
- Regenerate: `node scripts/generate-brand-assets.mjs`

## Key paths

| Path | Purpose |
|------|---------|
| `src/app/` | App Router pages and `/api` route handlers |
| `src/brand/` | Brand views, shell, sections, tokens |
| `src/data/` | Static CMS content |
| `src/components/` | Shared UI |
| `public/` | Static files served at `/` |
