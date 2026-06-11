# Glitz Events & Promotions — Luxury Event Management Platform

Premium black & gold event management website for **Glitz Events & Promotions**, Pune.

**Contact:** +91 9730594753 | [glitzevents.in](https://glitzevents.in)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, GSAP, ShadCN UI |
| Backend | Node.js, Express.js, PostgreSQL, Prisma ORM, Redis |
| Auth | Google OAuth, Email/Password, OTP, JWT |
| Payments | Razorpay, Stripe, PayPal |
| DevOps | Docker, Docker Compose, NGINX, GitHub Actions, Vercel |

## Production Notes (Important)

- **Never commit `.env`**: keep your `OPENAI_API_KEY`, `RAZORPAY_KEY_SECRET`, and other secrets only in environment variables.
- **Auth**: web login/register uses a **httpOnly cookie** (`glitz_token`) set by `apps/web` route handlers (`/api/auth/*`).
- **Payments (Razorpay)**: the API creates a real Razorpay order and verifies the **signature** before confirming bookings.
  - Set: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

## Quick Start

```bash
npm install
cd apps/web && npm install
cd ../../server && npm install
cp .env.example .env
npm run db:generate && npm run db:push && npm run db:seed
npm run dev
```

## Deploy to Vercel

1. Import [aadityapa/EventManagment](https://github.com/aadityapa/EventManagment)
2. **Settings → General → Root Directory** → set to `apps/web` (required)
3. **Settings → Build & Development** → leave Install/Build commands empty (use Next.js defaults)
4. Add env vars: `NEXT_PUBLIC_APP_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_COMPANY_PHONE`, `NEXT_PUBLIC_WHATSAPP_NUMBER`
5. Redeploy

## Docker Production

```bash
docker compose up -d --build
```

## Brand

- **Colors:** Deep Black (#000) + Luxury Gold (#D4AF37)
- **Fonts:** Playfair Display, Cinzel, Montserrat, Poppins
- **Theme:** Dark luxury, glassmorphism, cinematic animations

## License

Proprietary — Glitz Events & Promotions © 2026
