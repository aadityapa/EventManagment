# Glitz Events V4 — Sitemap & Information Architecture

> Rule: **keep all existing routes** (local SEO + blog + business). V4 changes presentation and adds a few editorial surfaces; it does not break URLs.

## 1. Route inventory (preserved from V3)

### Marketing / editorial
```
/                                   Home
/about                              About / atelier story
/services                           Services index
/services/[slug]                    Service detail (dynamic)
/portfolio                          Portfolio / case films (V4 centerpiece)
/venues                             Venue marketplace
/vendors                            Vendor atelier
/gallery                            Gallery
/pricing                            Investment philosophy
/testimonials                       Testimonials / reviews
/faqs                               FAQs (+ GEO answer blocks)
/blog                               Blog index (20 posts)
/blog/[slug]                        Blog article (dynamic)
/contact                            Contact / concierge
/book-event                         Book / guided concierge flow
```

### Local SEO landing pages (preserve URLs + schema exactly)
```
/wedding-planner-pune
/corporate-event-management-pune
/destination-wedding-planner-pune
/luxury-wedding-planner-maharashtra
/event-management-company-pune
/exhibition-management-pune
```

### Application (functional — design-only later, no IA change)
```
/login   /register
/dashboard            /dashboard/vendor
/admin
```

### Legal
```
/privacy   /terms   /refund
```

## 2. Hierarchy
```
Home
├── About
├── Services ───────────── Service detail [slug] (8+ services)
├── Portfolio ──────────── Case film [future slug]
├── Venues
├── Vendors
├── Gallery
├── Pricing
├── Stories (Blog) ─────── Article [slug] (20)
├── Company
│   ├── Testimonials
│   ├── FAQs
│   └── Legal (Privacy / Terms / Refund)
├── Local SEO (orphan-by-design, linked from footer + internal context)
└── Convert
    ├── Contact (concierge)
    └── Book Event (guided flow)   ← primary site-wide CTA
```

## 3. Navigation model

### Primary nav (desktop, ≤7 items — restraint)
`Home · About · Services▾ · Portfolio · Venues · Stories · Contact`
- Right cluster: phone (+91 9730594753), theme toggle, **Book Consultation** (single gold primary CTA).
- Vendors, Gallery, Pricing, Testimonials, FAQs move into the **Services mega-menu** secondary column + footer (reduces nav clutter; benchmark sites keep nav ≤7).

### Services mega-menu (V4 — richer than V3's 2-col)
```
┌─────────────────────────── MEGA MENU ───────────────────────────┐
│  SIGNATURE                  ALL SERVICES            EXPLORE       │
│  • Luxury Weddings          • Corporate Events      → Portfolio   │
│    (featured, image)        • Destination Weddings  → Venues      │
│                             • Concerts & Shows      → Vendors     │
│  Standfirst + CTA           • Exhibitions           → Gallery     │
│  "View all services →"      • Brand Promotions      → Pricing     │
└──────────────────────────────────────────────────────────────────┘
```
- Featured signature service with art-directed image (left), full service list (middle), cross-links (right).
- Keyboard navigable, `role="menu"`, hover + focus + click, closes on outside click / Esc.

### Mobile nav
- Full-screen overlay, staggered link reveal (V4 motion), phone + Book CTA pinned, theme toggle, accordion for Services.

### Footer (catch-all for SEO + secondary)
- Columns: Services list · Local pages (Pune/Maharashtra) · Company (About/Portfolio/Stories/Testimonials/FAQs) · Legal · Contact block (phone/WhatsApp/email/address) · newsletter.

## 4. URL strategy
- **No renames, no breaking changes.** All V3 routes stay.
- Future Portfolio case films: `/portfolio/[slug]` (additive, not in this session).
- Keep trailing-slash and casing behavior as-is.

## 5. Redirects
- **None required this session.** If Vendors/Gallery/Pricing are demoted from primary nav, they remain fully routable and linked from mega-menu + footer (no redirect, no SEO loss).

## 6. Crawl / GEO notes
- Maintain existing sitemap.xml + robots + per-route metadata (`generateSEO`).
- Local SEO pages stay individually indexable with their LocalBusiness schema.
- Add answer-engine extractable blocks per key page (additive content, no route change).
