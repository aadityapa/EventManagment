# Glitz Events V5 — Information Architecture & Sitemap

> **Model:** Cinematic Event Universe — persistent shell with **worlds**, **chapters**, and **portals**  
> **Rule:** All V4/V3 business URLs preserved (local SEO, blog slugs, APIs, auth, booking)  
> **Phone:** +91 9730594753 · **Live:** https://event-managment-mocha.vercel.app/

---

## 1. IA philosophy

Traditional hierarchy:
```
Home → Services → Service Detail → Contact
```

V5 universe model:
```
Premiere (/) ──portal──► Experience Worlds ──portal──► World Chapters
       │                        │
       └── persistent shell ────┴──► Archive · Destinations · Commission · Oracle
```

**Navigation mental model:** Visitor holds a **passport** to the Glitz universe. The shell (header/footer/FAB) is the transport layer; worlds are destinations; chapters are scenes.

---

## 2. Universe structure

```
                    ┌─────────────────────────────────┐
                    │         UNIVERSE SHELL          │
                    │  Logo · Worlds · Phone · Book   │
                    └─────────────────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
  THE PREMIERE                   EXPERIENCE WORLDS              UTILITY ORBITS
  (Home 9 chapters)              (themed portals)              (always reachable)
        │                             │                             │
        ├─ Welcome                    ├─ Wedding World              ├─ The Commission (/book-event)
        ├─ Who We Are                 ├─ Corporate World            ├─ The Concierge (/contact)
        ├─ Experience Worlds ◄────────┤─ Destination World          ├─ The Oracle (/ai — new)
        ├─ Signature Experiences      ├─ Celebration World          └─ Phone / WhatsApp FAB
        ├─ Portfolio Universe         └─ Concert & Culture World
        ├─ Venue Universe
        ├─ Testimonials
        ├─ Media & Awards
        └─ Book Journey
```

---

## 3. Experience Worlds (portal layer)

Worlds are **themed entry points** — not separate domains. Each world has:
- Distinct adaptive atmosphere preset
- Curated service subset
- Portfolio row filter
- Venue destination focus
- World-specific CTA copy

| World ID | Portal label | Primary routes | Atmosphere preset |
|----------|--------------|----------------|-------------------|
| `wedding` | Wedding World | `/services/wedding-planning`, `/portfolio?world=wedding`, `/venues?world=destination` | Warm champagne glow |
| `corporate` | Corporate World | `/services/corporate-events`, `/portfolio?world=corporate` | Cool sand, sharper gold |
| `destination` | Destination World | `/services/destination-weddings`, `/venues?city=Udaipur` | Deep dune radial |
| `celebration` | Celebration World | Birthdays, launches, awards services | Bright ivory lift |
| `culture` | Concert & Culture | Concerts, fashion, exhibitions | Dramatic obsidian depth |

**URL strategy:** Worlds use **query params** on existing routes (`?world=wedding`) for Phase 1–7; optional pretty routes (`/worlds/wedding`) additive in Phase 10 if SEO warrants.

---

## 4. Full route map (preserved + additive)

### Marketing chapters (URL preserved, experience renamed)

| URL | V5 chapter | Shell label | Index |
|-----|------------|-------------|-------|
| `/` | The Premiere | Home | ✅ |
| `/about` | The Atelier | About | ✅ |
| `/services` | The Craft (index) | Services ▾ | ✅ |
| `/services/[slug]` | Craft chapter | (in mega-menu) | ✅ |
| `/portfolio` | The Archive | Portfolio | ✅ |
| `/venues` | The Destinations | Venues | ✅ |
| `/vendors` | Atelier of Partners | (mega-menu/footer) | ✅ |
| `/gallery` | The Gallery | (mega-menu/footer) | ✅ |
| `/pricing` | Investment Philosophy | (footer) | ✅ |
| `/testimonials` | Voices | (footer) | ✅ |
| `/faqs` | Knowledge | (footer) | ✅ |
| `/blog` | The Journal | Stories | ✅ |
| `/blog/[slug]` | Journal entry | — | ✅ |
| `/contact` | The Concierge | Contact | ✅ |
| `/book-event` | The Commission | Book Consultation | ✅ |

### Additive routes (V5)

| URL | Purpose | Phase | Redirect |
|-----|---------|-------|----------|
| `/ai` or `/experience-ai` | AI Experience hub (The Oracle) | Phase 9 | — |
| `/portfolio/[slug]` | Case film detail (optional) | Phase 6 | — |
| `/worlds/[id]` | Pretty world portal (optional) | Phase 10 | 302 → `/?world=` if deprecated |

### Local SEO (unchanged)

```
/wedding-planner-pune
/corporate-event-management-pune
/destination-wedding-planner-pune
/luxury-wedding-planner-maharashtra
/event-management-company-pune
/exhibition-management-pune
```

Each page gains world context block linking to relevant Experience World portal.

### Application (unchanged)

```
/login                    /register
/dashboard                /dashboard/vendor
/admin
```

### Legal (unchanged)

```
/privacy                  /terms                  /refund
```

### APIs (unchanged)

```
/api/auth/login           /api/auth/logout        /api/auth/register    /api/auth/me
/api/bookings             /api/bookings/my
/api/payments/razorpay/create-order    /api/payments/razorpay/verify
/api/leads
/api/hero-images
```

---

## 5. Navigation model — Universe Nav

### Desktop persistent shell

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [G] GLITZ          Worlds ▾   Archive   Destinations   Journal   Contact │
│                                    +91 9730594753   ◐   ● Book Consultation│
└──────────────────────────────────────────────────────────────────────────┘
```

**Changes from V4:**
- "Services ▾" becomes **"Worlds ▾"** — spatial mega-menu with portal cards (image + atmosphere swatch + enter CTA)
- "Portfolio" → **"Archive"** (display label; URL stays `/portfolio`)
- "Venues" → **"Destinations"** (URL stays `/venues`)
- "Stories" → **"Journal"** (URL stays `/blog`)
- Phone always visible
- Single gold **Book Consultation** → `/book-event`

### Worlds mega-menu (spatial)

```
┌──────────────────────────── UNIVERSE MAP ────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ ▓ Wedding   │  │ ▓ Corporate │  │ ▓ Destin.   │  │ ▓ Culture   │ │
│  │   World     │  │   World     │  │   World     │  │   World     │ │
│  │  [ Enter → ]│  │  [ Enter → ]│  │  [ Enter → ]│  │  [ Enter → ]│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│  ────────────────────────────────────────────────────────────────────  │
│  ALL CRAFT → /services    PARTNERS → /vendors    GALLERY → /gallery   │
└────────────────────────────────────────────────────────────────────────┘
```

**Interaction:** Hover/focus expands portal card with subtle parallax; Enter triggers **portal transition** (curtain) to world landing (filtered view or home anchor).

### Mobile universe nav
- Full-screen obsidian overlay
- Worlds as large portal tiles (2-col grid)
- Staggered link reveal (V5 motion)
- Phone + Book pinned bottom
- Theme toggle

### Footer (SEO catch-all)
Columns unchanged in URLs; labels updated:
- **Craft** — service links
- **Destinations** — venue + local SEO links
- **Universe** — About, Archive, Journal, Voices, Knowledge
- **Legal** — Privacy, Terms, Refund
- **Concierge** — phone, WhatsApp, email, address

---

## 6. Home chapter anchors (in-page IA)

For deep linking and portal handoff:

| Chapter | `#anchor` | Content |
|---------|-----------|---------|
| 1 Welcome | `#welcome` | Hero / premiere frame |
| 2 Who We Are | `#atelier` | Editorial split |
| 3 Experience Worlds | `#worlds` | Portal grid |
| 4 Signature Experiences | `#craft` | Ranked services |
| 5 Portfolio Universe | `#archive` | Horizontal case row |
| 6 Venue Universe | `#destinations` | Destination teaser |
| 7 Testimonials | `#voices` | Single-focus quotes |
| 8 Media & Awards | `#recognition` | Press wall |
| 9 Book Journey | `#commission` | Concierge CTA |

External campaigns can link: `https://glitzevents.in/#worlds`, `/#commission`.

---

## 7. Services IA — cinematic chapters

Each `/services/[slug]` follows chapter spine:

```
1. Prologue (hero frame + world tag)
2. Vision (what this craft means)
3. Process film (pinned scroll or step reveal)
4. Proof (case + testimonial)
5. Investment hint (philosophy, not price table)
6. Commission CTA
```

**Slug inventory** (preserve from `data/cms`):
- wedding-planning, destination-weddings, corporate-events, celebrity-management, award-functions, product-launches, exhibitions, brand-promotions, concert-management, fashion-shows, birthday-celebrations, event-production

---

## 8. Portfolio IA — Netflix model

```
/archive (portfolio page)
├── Hero row: "Featured Premiere" (1 large + autopreview)
├── Row: "Wedding Worlds" (horizontal scroll)
├── Row: "Corporate Moments"
├── Row: "Destination Dreams"
├── Row: "Culture & Scale"
└── Case film modal or /portfolio/[slug]
```

Filters map to rows; "All" shows hero + all rows.

---

## 9. Booking IA — Event Architect

Replace 9-step mental model with 5 commissions:

| Step | Name | Maps to wizard steps (API preserved) |
|------|------|--------------------------------------|
| 1 | **Vision** | Event type + date |
| 2 | **Scale** | Guests + budget |
| 3 | **Atmosphere** | Venue + services |
| 4 | **Partners** | Review + contact details |
| 5 | **Handshake** | Payment + confirmation |

URL stays `/book-event`. Step state in query: `?step=vision` (optional, progressive enhancement).

---

## 10. Redirect & migration plan (V4 → V5)

| Action | Detail |
|--------|--------|
| **No breaking redirects** | All existing URLs return 200 with new experience |
| **Nav label changes** | Display only; no URL changes |
| **New `/ai` route** | Additive; link from Book Journey + FAB secondary |
| **World pretty URLs** | Optional Phase 10; if added, canonical to primary routes |
| **Loader replay** | No route impact |
| **Deprecated V3 sections** | Already consolidated in V4; no orphan URLs |
| **Session 4 WIP** | Merge before V5 Phase 0 to avoid IA drift |

### Canonical & SEO
- `metadataBase` must use production URL in env
- Sitemap updated when `/ai` and `/portfolio/[slug]` ship
- `hreflang` not required (single locale en_IN)

---

## 11. Crawl budget & internal linking

```
Home (#worlds) ──► /services?world=* ──► /services/[slug]
       │                    │
       ├─► /portfolio ──────┴──► case films
       ├─► /venues?city=*
       ├─► /blog/[slug]
       ├─► local SEO pages (footer)
       └─► /book-event (primary convert)
```

Every world portal links to ≥3 internal targets (service, portfolio row, venue): **GEO + SEO mesh**.

---

## 12. Dashboard IA (unchanged, noted)

Marketing shell hidden on `/dashboard*`, `/admin`, `/login`, `/register` — existing `brand-header` logic preserved. V5 tokens applied in Phase 11 for cohesion only.
