# Nexyyra Events

Luxury event experience platform for **Nexyyra Events**, Pune.

**Contact:** +91 9730594753 · hello@nexyyra.com · https://nexyyra.com

## Repository layout

| Path | Role |
|------|------|
| `apps/web/` | **Frontend** — Next.js 16 app (pages, UI, brand, static CMS data) |
| `server/` | **Backend** — Express API (auth, bookings, payments, CMS, AI) |
| `prisma/` | Shared database schema and seed |
| `scripts/` | Monorepo tooling (Stitch, images, Prisma sync) |
| `nginx/` | Docker reverse-proxy config |

### Frontend (`apps/web`)

```
apps/web/
├── public/              # Static assets, brand icons, SEO/AI files
├── scripts/
│   └── assets/          # Logo source (not served): nexyyra-logo-raw.png
├── src/
│   ├── app/             # Routes + Next.js API handlers
│   ├── brand/           # Brand shell, views, sections, design tokens
│   ├── components/      # Shared UI components
│   ├── data/            # Static CMS content (services, blog, FAQs)
│   ├── hooks/
│   ├── lib/             # Client + server utilities
│   └── styles/
```

Regenerate brand assets from the logo master:

```bash
cd apps/web && node scripts/generate-brand-assets.mjs
```

### Backend (`server`)

```
server/
└── src/
    ├── index.ts         # Express entry
    ├── routes/          # REST API routes
    ├── middleware/
    └── lib/
```

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, GSAP |
| Backend | Node.js, Express, PostgreSQL, Prisma, Redis |
| Auth | Google OAuth, email/password, OTP, JWT (httpOnly `glitz_token` cookie) |
| Payments | Razorpay (signature-verified), Stripe, PayPal |
| Deploy | Vercel (frontend), Docker Compose (full stack) |

## Quick start

```bash
npm install
cd apps/web && npm install
cd ../../server && npm install
cp .env.example .env
npm run db:generate && npm run db:push && npm run db:seed
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:4000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Web + API concurrently |
| `npm run build` | Production build (web) |
| `npm run lint` | ESLint (web) |
| `npm run media:sync` | Sync Google Drive media manifest |

From `apps/web`:

| Command | Description |
|---------|-------------|
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run build` | Next.js production build |

## Deploy to Vercel

1. Import the GitHub repo.
2. **Settings → General → Root Directory** → `apps/web`
3. Leave Install/Build commands empty (uses `vercel.json` defaults).
4. Set production env vars: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_COMPANY_PHONE`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `MEDIA_PROVIDER`, `GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_DRIVE_API_KEY`.
5. Never commit `.env` — keep secrets in Vercel environment variables only.

## Docker (full stack)

```bash
docker compose up -d --build
```

## Security

- Never commit `.env` or API secrets.
- Razorpay: set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.

## License

Proprietary — Nexyyra Events Private Limited © 2026
