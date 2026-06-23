# Vercel deployment — Nexyyra Events

## Required dashboard settings

In **Vercel → Project → Settings → General**:

| Setting | Value |
|---------|--------|
| **Root Directory** | `apps/web` |
| **Framework Preset** | Next.js |
| **Node.js Version** | 22.x |
| **Install Command** | Leave **empty** (uses `npm ci` from `vercel.json`) |
| **Build Command** | Leave **empty** (uses `npm run build` from `vercel.json`) |
| **Output Directory** | Leave **default** |

If Install Command was set to `npm ci --prefix apps/web`, **clear it** — that breaks when Root Directory is `apps/web`.

## Environment variables (Production)

```
NEXT_PUBLIC_APP_URL=https://www.nexyyra.com
NEXT_PUBLIC_API_URL=https://www.nexyyra.com/api
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-5WS115MZ5E
NEXT_PUBLIC_COMPANY_PHONE=+91 9730594753
NEXT_PUBLIC_COMPANY_EMAIL=hello@nexyyra.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+919730594753
MEDIA_PROVIDER=google-drive
GOOGLE_DRIVE_FOLDER_ID=1UZR_UhiZfVvcLUNvDJi3Rvw8udkfKgYM
GOOGLE_DRIVE_API_KEY=<your-key>
MEDIA_LIVE_SYNC=1
MEDIA_REVALIDATE_SECONDS=120
CRON_SECRET=<random-32-char-secret>
```

See `.env.example` for the full list.

## Build flow

1. `npm ci` — installs from `apps/web/package-lock.json`
2. `prebuild` — cache clean + media sync (falls back to committed manifest without Drive key)
3. `next build` — 86 static/SSG routes

## Cron (Hobby plan)

One run per day: `0 6 * * *` (06:00 UTC). Live media also refreshes via `MEDIA_LIVE_SYNC` on requests.

## Domain

Add `nexyyra.com` and `www.nexyyra.com`. Apex → www redirect is in `apps/web/vercel.json`.

## CLI deploy

```bash
cd apps/web
vercel login
vercel link
vercel --prod
```

## Troubleshooting

| Error | Fix |
|-------|-----|
| `npm ci --prefix apps/web` failed | Set Root Directory to `apps/web`, clear Install Command override |
| Cron Hobby limit | Already set to daily schedule |
| Media sync failed | Set `GOOGLE_DRIVE_API_KEY` or rely on committed `media-manifest.json` |
| 404 / wrong app | Root Directory must be `apps/web`, not `./` |
