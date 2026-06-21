# Nexyyra DEPLOYMENT_REPORT — 2026-06-21

## Repository
- **Remote:** `https://github.com/aadityapa/EventManagment.git`
- **Branch:** `master`
- **Production URL:** `https://nexyyra.com`

## Pre-deploy checklist

| Item | Status |
|------|--------|
| `npm run build` passes | ✅ |
| TypeScript clean | ✅ |
| 79 static routes generated | ✅ |
| Media sync (103 Drive images) | ✅ |
| No exit-intent popup | ✅ |
| Theme logos (gold/black SVG) | ✅ |
| Homepage scroll sections visible | ✅ |
| Portfolio layout (prior pass) | ✅ |

## Required Vercel environment variables

```
MEDIA_PROVIDER=google-drive
GOOGLE_DRIVE_FOLDER_ID=1UZR_UhiZfVvcLUNvDJi3Rvw8udkfKgYM
GOOGLE_DRIVE_API_KEY=<optional, improves sync reliability>
```

## CI/CD
- GitHub Actions: push to `master` triggers Vercel production deploy (if linked)
- Prebuild runs `media:sync` automatically

## Custom domain
- `nexyyra.com` → Vercel project (verify DNS A/CNAME in Vercel dashboard)

## Post-deploy verification
1. Hard refresh homepage — scroll all sections (no blank white blocks)
2. Toggle light/dark theme — black logo (light) / gold logo (dark)
3. Check left quick actions on desktop (phone, book, AI, WhatsApp)
4. Verify experience cards equal height on homepage
5. Confirm no offer popup on exit intent
6. Run Lighthouse on production URL

## Google indexing / AEO
- `sitemap.xml` — auto-generated
- `robots.txt` — present
- Schema markup — from prior SEO passes
- AI search optimization — structured content in `lib/seo.ts`, `lib/geo-content.ts`

## Rollback
```bash
git revert HEAD
git push origin master
```
Or promote previous Vercel deployment from dashboard.
