# Glitz Events — DevOps Guide

**Last updated:** June 12, 2026  
**Stack:** Next.js 16 (`apps/web`) · Express/Prisma API (`server/`) · PostgreSQL · Redis · Vercel

---

## CI/CD — GitHub Actions

Workflow: `.github/workflows/ci.yml`

| Job | Steps |
|-----|-------|
| `lint-and-build` | `npm ci --prefix apps/web` → `npm run lint` → `npm run build` |
| `api-check` | `npm ci --prefix server` → root `npm ci` → `npm run db:generate` → `npx tsc --noEmit --project server/tsconfig.json` |

**Triggers:** push/PR to `master` or `main`

**Build env (CI):**
- `NEXT_PUBLIC_APP_URL=https://glitzevents.in`
- `NEXT_PUBLIC_API_URL=https://api.glitzevents.in/api`

**Prisma generate:** Required before API typecheck. Uses placeholder `DATABASE_URL=postgresql://ci:ci@127.0.0.1:5432/ci` — no live DB needed for client generation.

---

## Vercel Deployment

| App | Path | Framework |
|-----|------|-----------|
| Web | `apps/web` | Next.js |
| API | `server/` (separate project) | Node/Express |

**Deploy preview:** `vercel --cwd apps/web`  
**Production:** merge to `master` → Vercel auto-deploy (or `vercel --prod`)

**Cache headers:** `apps/web/vercel.json` — immutable assets (js/css/fonts), 24h images, security headers.

**Required env vars (Vercel dashboard):**

| Variable | Environment | Notes |
|----------|-------------|-------|
| `NEXT_PUBLIC_APP_URL` | Production | Canonical site URL |
| `NEXT_PUBLIC_API_URL` | All | API base URL |
| `NEXT_PUBLIC_COMPANY_PHONE` | All | Display phone |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | All | WhatsApp CTA |
| `DATABASE_URL` | API only | PostgreSQL connection |
| `UNSPLASH_ACCESS_KEY` | Web (optional) | Hero image API |
| `PEXELS_API_KEY` | Web (optional) | Hero image fallback |
| `SENTRY_DSN` | All (optional) | Error tracking — see below |

Pull local env: `vercel env pull .env.local --cwd apps/web`

---

## Local Development

```powershell
# Infrastructure
docker compose up -d postgres redis

# API
cd server
npm ci
npm run dev

# Web (separate terminal)
cd apps/web
npm ci
npm run dev
```

Full stack with Docker: `docker compose up` (web + api + nginx + postgres + redis)

---

## Docker Compose

File: `docker-compose.yml`

| Service | Port | Purpose |
|---------|------|---------|
| `postgres` | 5432 | Primary database |
| `redis` | 6379 | Cache/sessions |
| `api` | 4000 | Express API |
| `web` | 3000 | Next.js |
| `nginx` | 80/443 | Reverse proxy |

Set `POSTGRES_PASSWORD` in `.env` before first run.

---

## Database Migrations

```powershell
npm run db:generate   # Generate Prisma client (root)
npm run db:migrate    # Apply migrations (requires DATABASE_URL)
npm run db:seed       # Seed data (if configured)
```

---

## Error Tracking (Sentry Placeholder)

Add to Vercel env when ready:

```
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

Install: `@sentry/nextjs` in `apps/web`, `@sentry/node` in `server`. Wrap `next.config` with `withSentryConfig`.

---

## Manual Verification Checklist

- [ ] `npm run lint --prefix apps/web`
- [ ] `npm run build --prefix apps/web`
- [ ] `npx tsc --noEmit --project server/tsconfig.json`
- [ ] Preview URL smoke test: home, book-event, blog, venues
- [ ] Lighthouse: Performance ≥90, Accessibility ≥90

---

*Glitz Events 20-Phase Transformation — Phase 19*
