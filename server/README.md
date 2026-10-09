# Nexyyra Events API (Express)

Express 5 + Prisma (PostgreSQL) API used by the Next.js app's `/api/auth`, `/api/bookings` and `/api/payments` route handlers. The public site on Vercel runs without it; it is needed for accounts, bookings, payments, the AI planner and the admin dashboard.

## Run

```bash
# from the repo root
npm run db:generate          # prisma generate
npm run db:push              # create tables
npm run db:seed              # admin user + minimal content (see Seed below)

cd server
npm install
npm run dev                  # nodemon + ts-node on http://localhost:4000
npm run build && npm start   # compiled dist/
```

Docker: `docker compose up` (reads the same env vars; refuses to start without `NEXTAUTH_SECRET`).

## Environment variables

Read from the repo-root `.env` (`server/src/index.ts` loads `../../.env`).

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | yes in production | JWT signing key, **32+ random chars**. Must be the same value in the Next.js app (`src/proxy.ts` verifies tokens with it). In development a random per-process key is used when unset. |
| `NEXT_PUBLIC_APP_URL` | production | Only CORS origin allowed in production |
| `API_PORT` / `API_HOST` | no | Default `4000` / `0.0.0.0` |
| `USE_HTTPS`, `SSL_CERT_PATH`, `SSL_KEY_PATH` | no | Local HTTPS |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | for payments | Payment routes answer 503 when unset |
| `RAZORPAY_WEBHOOK_SECRET` | for webhooks | `/api/payments/razorpay/webhook` |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | for `/api/ai/*` | AI routes answer 503 when the key is unset |
| `OTP_LOGIN_ENABLED` | no | OTP routes are 404 unless `"true"` (see `routes/auth.ts` before enabling) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SEED_ALLOW_PROD` | seed only | See Seed |

## Auth and roles

- `POST /api/auth/register` and `POST /api/auth/login` return `{ user, token }`. The token is an HS256 JWT (`{ id, email, role }`, 7-day expiry) signed with `NEXTAUTH_SECRET`.
- Send it as `Authorization: Bearer <token>`. The Next.js app stores it in the httpOnly `glitz_token` cookie and forwards it from its route handlers.
- Roles (`prisma/schema.prisma` → `UserRole`): `CLIENT`, `VENDOR`, `ADMIN`, `STAFF`. Self-registration can create `CLIENT` or `VENDOR`; `ADMIN`/`STAFF` are created by the seed or directly in the database.
- `authenticate` (`src/middleware/auth.ts`) verifies the token; `requireRole(...)` gates `/api/admin/*` to `ADMIN` and `STAFF`.
- On the web side `apps/web/src/proxy.ts` verifies the same token with `jose`: `/admin/**` needs `ADMIN`/`STAFF`, `/dashboard/vendor` needs `VENDOR`/`ADMIN`/`STAFF`, `/dashboard/**` any valid token. Invalid or expired tokens are cleared and redirected to `/login?next=`.

## Validation and errors

Every body and query is parsed with zod (`src/lib/http.ts`). Validation failures return `400 { error: "Invalid request", fields: { <field>: [messages] } }`. Server errors return a generic message; the real error is logged, never sent to the client.

## Rate limits (per client IP, `trust proxy` = 1)

| Scope | Limit |
|---|---|
| Whole API | 200 / 15 min |
| `/api/auth/login` | 10 failed / 15 min |
| `/api/auth/register` | 5 / hour |
| `/api/auth/otp/*` | 5 / 15 min |
| `/api/leads/*` | 10 / 15 min |
| `/api/ai/*` | 30 / 15 min |
| `/api/bookings/calculate` | 60 / 15 min |
| everything else | 120 / 15 min |

Limits live in `src/lib/rate-limit.ts`. Responses carry `RateLimit-*` headers (draft-7).

## Seed (`prisma/seed.ts`)

- `ADMIN_EMAIL` (default `admin@nexyyra.com`) and `ADMIN_PASSWORD` (8+ chars). When `ADMIN_PASSWORD` is unset and the admin does not exist yet, a random password is generated and **printed once** — copy it from the terminal.
- Refuses to run with `NODE_ENV=production` unless `SEED_ALLOW_PROD=1`.
- Seeds an honest company profile, four services, the `WELCOME10` coupon and three FAQs. No invented venues, vendors or testimonials.

## Coupons

A coupon applies only when `isActive`, not past `expiresAt`, under `maxUses` and the subtotal meets `minAmount`. The discount is clamped so totals never go negative, and `usedCount` is incremented atomically when a booking is created (two concurrent bookings cannot both take the last use).
