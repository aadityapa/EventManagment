# Vercel deployment — Nexyyra Events monorepo

## Recommended (simplest)

In Vercel **Project Settings → General → Root Directory**, set:

```
apps/web
```

Leave Install Command and Build Command as defaults (`npm ci` / `npm run build`).

`apps/web/vercel.json` provides crons, redirects, and security headers.

## Alternative (repo root as Root Directory)

If Root Directory is `./`, the root `vercel.json` routes install/build to `apps/web`:

- Install: `npm ci --prefix apps/web`
- Build: `npm run vercel-build` (runs `apps/web` build)

## Environment variables

Set in Vercel → Settings → Environment Variables (Production + Preview):

| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_APP_URL` | Yes — `https://www.nexyyra.com` |
| `GOOGLE_DRIVE_API_KEY` | Recommended for live media |
| `GOOGLE_DRIVE_FOLDER_ID` | Yes if using Drive |
| `MEDIA_LIVE_SYNC` | `1` |
| `CRON_SECRET` | Yes for cron route |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-5WS115MZ5E` |

See `.env.example` for the full list.

## Media sync on build

If `GOOGLE_DRIVE_API_KEY` is not set on Vercel, `prebuild` uses the committed
`public/media-manifest.json` instead of failing the deploy.

## Cron (media sync)

Hobby plan allows **one cron run per day**. Schedule: `0 6 * * *` (06:00 UTC daily).

For every-5-minute sync, upgrade to Vercel Pro or rely on `MEDIA_LIVE_SYNC` at request time (2-min cache).

Add `nexyyra.com` and `www.nexyyra.com` in Vercel Domains. Apex redirects to www via `vercel.json`.
