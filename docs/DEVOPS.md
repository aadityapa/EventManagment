# Glitz Events â€” DevOps Guide

**Last updated:** June 12, 2026  
**Stack:** Next.js 16 (`apps/web`) Â· Express/Prisma API (`server/`) Â· PostgreSQL Â· Redis Â· Vercel

---

## CI/CD â€” GitHub Actions

Workflow: `.github/workflows/ci.yml`

| Job | Steps |
|-----|-------|
| `lint-and-build` | `npm ci --prefix apps/web` â†’ `npm run lint` â†’ `npm run build` |
| `api-check` | `npm ci --prefix server` â†’ root `npm ci` â†’ `npm run db:generate` â†’ `npx tsc --noEmit --project server/tsconfig.json` |

**Triggers:** push/PR to `master` or `main`

**Build env (CI):**
- `NEXT_PUBLIC_APP_URL=https://glitzevents.in`
- `NEXT_PUBLIC_API_URL=https://api.glitzevents.in/api`

**Prisma generate:** Required before API typecheck. Uses placeholder `DATABASE_URL=postgresql://ci:ci@127.0.0.1:5432/ci` â€” no live DB needed for client generation.

---

## Vercel Deployment


### Vercel project settings (dashboard)

Configure under **Project → Settings → General**:

| Setting | Recommended value |
|---------|-------------------|
| **Root Directory** | `apps/web` |
| **Framework Preset** | Next.js |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | *(leave default — Next.js)* |
| **Install Command** | `npm ci` |
| **Node.js Version** | 20.x |

**Live production URL (known):** https://event-managment-mocha.vercel.app/

With **Root Directory** = `apps/web`, `apps/web/vercel.json` applies (security + cache headers only — no SPA rewrites). App Router must not use a catch-all rewrite to `index.html`.

**Alternative (repo root as Vercel root):** Install `npm ci`, Build `npm run build` (root script runs `cd apps/web && npm run build`). Vercel sets `VERCEL=1` so root `postinstall` skips Prisma generate (frontend-only deploy).

| App | Path | Framework |
|-----|------|-----------|
| Web | `apps/web` | Next.js |
| API | `server/` (separate project) | Node/Express |

**Deploy preview:** `vercel --cwd apps/web`  
**Production:** merge to `master` â†’ Vercel auto-deploy (or `vercel --prod`)

**Cache headers:** `apps/web/vercel.json` â€” immutable assets (js/css/fonts), 24h images, security headers.

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
| `SENTRY_DSN` | All (optional) | Error tracking â€” see below |

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

## Error Tracking (Sentry)

Lightweight client-side integration via `@sentry/browser`. Gracefully no-ops when DSN is unset.

Add to Vercel env when ready:

```
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

**Wiring:**
- `lib/monitoring/sentry.ts` â€” conditional init and `captureException`
- `components/monitoring/sentry-init.tsx` â€” client bootstrap in root layout
- `components/shared/error-boundary.tsx` â€” reports React render errors

No `next.config` wrapper required. Install is scoped to `apps/web` only.

---

## Manual Verification Checklist

- [ ] `npm run lint --prefix apps/web`
- [ ] `npm run build --prefix apps/web`
- [ ] `npx tsc --noEmit --project server/tsconfig.json`
- [ ] Preview URL smoke test: home, book-event, blog, venues
- [ ] Lighthouse: Performance â‰¥90, Accessibility â‰¥90

---

## V5 Addendum (Phases 2â€“12)

| Workflow | Purpose |
|----------|---------|
| `.github/workflows/ci.yml` | Lint, web `tsc`, build, API typecheck |
| `.github/workflows/lighthouse.yml` | Lighthouse CI on Home, Portfolio, Book |

**V5 routes:** `/ai`, `/portfolio/[slug]`

**Lighthouse budgets:** `apps/web/lighthouse-budget.json` â€” Performance â‰¥85, A11y â‰¥95 (warn)

**Monitoring:** Vercel deploy alerts Â· Sentry release tags Â· uptime on production URL

---

*Glitz Events V5 â€” Phases 2â€“12 DevOps*
