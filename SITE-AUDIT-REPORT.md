# Nexyyra Events — Site Audit & V6 Rebuild (October 2026)

Scope: https://www.nexyyra.com and this repository (`apps/web`, `server`, `prisma`, Docker).
Method (no browser used): an HTTP crawl of all 73 sitemap URLs, probes of the live API, a static code review, and local production builds tested over HTTP. The full design spec for the rebuild is in [`DESIGN.md`](DESIGN.md).

## 1. What was wrong with the live site

| Area | Drawback |
|---|---|
| **Leads lost** | The contact and callback forms were fake: they showed "Message sent!" and threw the data away. The newsletter posted to an endpoint that returned 404 but still claimed success. "Book Consultation" was a 9-step checkout that required an account and a 30% Razorpay payment before any conversation, and it failed completely whenever the API was unreachable. |
| **Fabricated claims** | "12+ years", "1,000+ events across 35+ cities", "Trusted by Tata Group, Reliance", "Licensed & insured", a fictional "TechCorp" client, invented venues and vendors with 4.7–5.0★ ratings and "Verified" badges, and blog authors who don't exist. The company was incorporated in 2026. |
| **Security** | **Backend:** forgeable admin JWTs on Docker; payment amounts set by the client (pay ₹1 and the booking was marked PAID); OTP account takeover. **Web:** stored XSS via the image optimiser; clickjacking via `*.vercel.app` framing; public source maps; open redirects; database and Redis exposed in Docker. |
| **Privacy** | Analytics and Hotjar loaded with no real consent, and the consent choice couldn't be withdrawn. |
| **Performance** | A 3.5 s intro overlay hid the page, and the whole app re-mounted after hydration. A 103 KB logo was preloaded on every page, hero photos were downloaded twice, and a 3D WebGL coin sat in the hero. 5 font families, ~1.3 MB of JS on the home page and ~7,000 lines of overlapping CSS. |
| **Design / UX** | A generic hero, the same trust pillars repeated 5 times, four different price stories and five different response-time promises. Visible developer text, and two competing design languages (v4/glitz vs lux). |

## 2. What the V6 rebuild delivers

**Process:** three independent design directions were judged by three reviewers (creative, conversion, engineering). The winning spec ("The Editorial Issue": a typography-led luxury magazine on royal navy, with real photography as proof) was then built by 20+ parallel work packages. A five-lens adversarial review followed: 73 issues reported, 63 confirmed by independent verifiers, all 63 fixed and re-verified on the final build.

**Design system**
- One token file (`src/styles/tokens.css`).
- 36 server-first primitives (`src/components/ui`): Cover, Section, ServicesIndex with a CSS-only sticky photo frame, ProcessLine with a scroll-drawn rule, PriceTable, Ledger, Accordion, Gallery and Lightbox, InquiryPanel, and more.
- A bespoke "engraved hairline" icon set: 12 service icons and 18 UI glyphs, each with a single gold jewel dot.
- A new favicon and app-icon set, and per-service Open Graph images.

**Real photography**
- All 102 Drive photos were viewed and classified, with descriptive alt text, roles and focal points (`image-curation.ts`).
- 20 local cover sets (1920/1280/768 WebP) keep the hero image (LCP) off Google Drive.
- Seven services have no real photos yet; they get honest venue or staging frames, listed in `NEEDS_REAL_PHOTOGRAPHY`.

**Every page rebuilt:** home, services index and 12 service pages, portfolio (clearly labelled "Concept"), gallery, about, company, pricing, FAQs, `/why-nexyyra` (replaces `/testimonials`, 308 redirect), contact, book-event, blog index and 20 articles, 13 city pages, 6 local-SEO pages, legal pages, sitemap, and 404 ("This page didn't make the guest list.").

**Leads**
- One `InquiryForm` posts to `/api/inquiry` with zod validation, a honeypot, rate limiting and a same-origin check.
- Leads are delivered to a webhook, Resend email or the API.
- Success is shown only after a channel confirms delivery. Otherwise the visitor gets a WhatsApp hand-off with their details already filled in.

**Modern technique**
- Native CSS: scroll-driven animations (`animation-timeline: view()`), `@property`, container queries, `:has()`, `<details name>`, `<dialog closedby>`, popover, `@starting-style`.
- React View Transitions (`photo-{id}`, `concept-{id}`, `service-title-{slug}`), Speculation Rules (prerendering), `content-visibility`.
- No framer-motion, GSAP, Lenis or three.js.

**Honesty:** a single price story, applied everywhere:
- Collections from ₹10 Lakhs, ₹35 Lakhs and ₹1 Crore+, each including everything in the tier below.
- Single services from ₹2 Lakhs.
- "Prices exclude 18% GST".

One reply commitment everywhere ("same day, Mon–Sat 9am–9pm IST"). No stats, logos, reviews or awards. Concepts are always tagged "Concept".

**Security**
- **Web:** `proxy.ts` with jose JWT role checks, a CSP and frame protections, no source maps, safe redirects.
- **API:** zod validation on every route, per-route rate limits, a coupon fix, and no vendor PII exposure.
- **Payments:** server-computed amounts, Razorpay capture verification and timing-safe signature checks.
- **OTP login:** off by default.
- **Seeding:** the seed reads credentials from env.

**Privacy:** Accept/Decline consent with withdrawal through "Cookie settings" in the footer. Hotjar is named in the banner and gated by the same consent.

**SEO**
- Structured data matches what each page shows: starting prices use `minPrice`, and there are no Review, Rating or Person nodes.
- Real 404s for unknown slugs and parameters.
- Noindex on filter and pagination URLs, with canonicals to the base page.
- Sitemaps list only indexable routes.

### Before / after (measured)
| Metric | Live site | V6 build |
|---|---|---|
| Home JS | 1.31 MB raw (measured on the live site) | 0.75 MB raw · **178 KB gzipped** for modern browsers (budget 180 KB) |
| Home CSS | ~200 KB raw (noted in the old `next.config.ts`) | 118 KB raw · **21 KB gzipped** |
| CSS source lines | ~7,000 | **3,744** |
| Runtime dependencies (`apps/web`) | 39 | **12** |
| Files changed | — | 246 (+8,971 / −22,024 lines) |
| `tsc` / `eslint` / `next build` | — | clean / clean / 93 pages, no warnings |

## 3. Owner actions before going live

1. **Lead delivery (required):** set `INQUIRY_WEBHOOK_URL`, or `RESEND_API_KEY` together with `INQUIRY_EMAIL_TO`, in Vercel. Without one of these, leads go only to WhatsApp.
2. **Required secrets:**
   - `NEXTAUTH_SECRET`: 32+ characters, the same value in Vercel and the API. Protected pages fail closed without it.
   - `CRON_SECRET`
   - For the seed: `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
3. **Real proof is what separates a top agency:**
   - 3–6 real case studies with client permission
   - photography for the 7 services in `NEEDS_REAL_PHOTOGRAPHY`
   - named Google reviews
   - team photos, only with verified names
4. **Confirm with a lawyer:**
   - refund/cancellation tiers (Terms now defer to the Refund Policy)
   - the Mumbai jurisdiction clause
   - the cookie section of the Privacy Policy
5. **Business facts to confirm:**
   - blog dates start 2026-01-02; adjust if incorporation was later in 2026
   - Mon–Sat reply hours
   - add social profiles to `SITE_CONFIG.social` only once they exist (only Instagram is listed)
6. **Commit and deploy:** the work is uncommitted in the working tree. Review `git status`, commit, and deploy. The root `scripts/stitch-*.mjs` tools still write to `src/lib/stitch/exports/`, but the runtime that read those files was removed as dead code.

## 4. V7 — Living Editorial

- **Motion preference:** a site-level "Motion: On / Off" control (footer legal row + phone menu) overrides the OS `prefers-reduced-motion` via `html[data-motion]` set before paint; "reduced" keeps the 3D scenes as still frames and stops loops, tilt, Lenis and the marquee instead of removing them (DESIGN.md §9.6).
