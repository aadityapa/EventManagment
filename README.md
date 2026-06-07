# JIJU Events — Premium Event Management Platform

A world-class, production-ready event management website with premium UI/UX, advanced booking system, lead generation, audience engagement, AI features, and enterprise dashboards.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion, Shadcn UI |
| Backend | Node.js, Express.js, PostgreSQL, Prisma ORM |
| Auth | Google OAuth, Email/Password, OTP Login |
| Payments | Razorpay, Stripe, PayPal |
| Images | Unsplash, Pexels, Pixabay APIs + Sharp optimization |

## Quick Start

```bash
# 1. Install dependencies
npm install
cd apps/web && npm install
cd ../../server && npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database URL and API keys

# 3. Setup database
npm run db:generate
npm run db:push
npm run db:seed

# 4. Fetch event images (optional — requires API keys)
npm run images:fetch

# 5. Start development
npm run dev
```

- **Frontend:** http://localhost:3000
- **API:** http://localhost:4000

## Project Structure

```
jiju-events/
├── apps/web/              # Next.js frontend
│   ├── src/app/           # App Router pages (20+ routes)
│   ├── src/components/    # UI components, layouts, sections
│   ├── src/data/          # CMS content (editable)
│   └── src/lib/           # Utils, SEO, constants, images
├── server/                # Express.js API
│   └── src/routes/        # Auth, bookings, venues, vendors, AI, admin
├── prisma/                # Database schema & seed
├── scripts/               # Image fetch pipeline
└── .env.example           # Environment template
```

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, stats, services, portfolio, testimonials |
| About | `/about` | Company profile, team, awards, partners |
| Services | `/services` | 12 event service categories |
| Portfolio | `/portfolio` | Filterable event showcase |
| Venues | `/venues` | Venue marketplace with search & compare |
| Vendors | `/vendors` | Vendor marketplace by category |
| Gallery | `/gallery` | Masonry image gallery |
| Pricing | `/pricing` | Package comparison |
| Blog | `/blog` | Event planning articles |
| FAQs | `/faqs` | Accordion with schema markup |
| Contact | `/contact` | Lead capture form |
| Book Event | `/book-event` | 9-step booking wizard |
| Client Dashboard | `/dashboard` | Booking tracking, timeline, payments |
| Vendor Dashboard | `/dashboard/vendor` | Vendor management portal |
| Admin Panel | `/admin` | Analytics, leads, revenue reports |

## Booking System (9 Steps)

1. Event Type Selection
2. Date Selection (with availability check)
3. Venue Selection
4. Guest Count
5. Budget Selection
6. Additional Services
7. Review Details (with GST & coupons)
8. Online Payment (Razorpay/Stripe/PayPal)
9. Confirmation (Email/SMS/WhatsApp)

## API Endpoints

```
POST   /api/auth/register        Register user
POST   /api/auth/login           Email login
POST   /api/auth/otp/send        Send OTP
POST   /api/auth/otp/verify      Verify OTP
GET    /api/bookings/availability  Check date availability
POST   /api/bookings/calculate   Dynamic pricing
POST   /api/bookings             Create booking
GET    /api/venues               List venues
GET    /api/vendors              List vendors
POST   /api/leads                Submit lead
POST   /api/leads/newsletter     Newsletter signup
POST   /api/payments/create-order  Create payment
POST   /api/ai/chat              AI chatbot
POST   /api/ai/plan              AI event planner
GET    /api/admin/dashboard      Admin analytics
GET    /api/cms/*                CMS content
```

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Auth encryption key
- `UNSPLASH_ACCESS_KEY` / `PEXELS_API_KEY` — Image APIs
- `RAZORPAY_KEY_ID` / `STRIPE_SECRET_KEY` — Payment gateways
- `OPENAI_API_KEY` — AI chatbot (optional, has fallback)

## SEO Features

- Technical SEO with meta tags, Open Graph, Twitter Cards
- Schema markup: Organization, Event, FAQ, Breadcrumb
- Auto-generated sitemap.xml and robots.txt
- Target keywords optimized across all pages
- Core Web Vitals optimized (lazy loading, image optimization)

## Design System

- **Primary:** Gold `#c9a962` with luxury gradients
- **Typography:** Inter (body) + Playfair Display (headings)
- **Effects:** Glassmorphism, smooth animations, micro-interactions
- **Themes:** Dark + Light mode with system preference detection
- **Accessibility:** WCAG compliant focus states, reduced motion support

## Default Admin Credentials

```
Email: admin@jijuevents.com
Password: admin123
```

Change immediately in production.

## License

Proprietary — JIJU Events © 2026
