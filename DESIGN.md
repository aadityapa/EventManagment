# Nexyyra Events — V6 Design Spec ("The Editorial Issue")

> Agent-readable, implementable spec for the V6 rebuild of `apps/web`.
> Direction: **FOLIO (typography-led editorial luxury on royal navy)** as the base, with the judge-selected grafts from PREMIÈRE NOIR (sticky photo frame on the services index, scroll-drawn process line, curation schema, delegated analytics, z-index/Save-Data gating, photography-gap report) and Midnight Atelier (data-only price table, breadcrumbs, "What happens next" steps, three-button action bar with from-price, platform hygiene, the "guest list" 404 line).
> Every "mustAvoid" from the three judgements is binding (see §2.1). Where a judge's "best element" collided with another judge's "mustAvoid" (the QuickInquiry chip sheet), the mustAvoid wins.
> Brief: `scratchpad/V6-BRIEF.md`. Repo: `C:\Users\Admin\Desktop\JIJU`, web app `apps/web` (Next.js 16.2.7, React 19.2, Tailwind v4). Never run `next build`/`next dev`; verify with `npx tsc --noEmit` and `npx eslint <files>`.

---

## 1. Brand facts and honesty rules (condensed from the brief — binding)

### 1.1 The only facts you may state
| Fact | Value |
|---|---|
| Legal name | Nexyyra Events and Promotions Private Limited · CIN U70200ME2026PTC476014 · incorporated **2026** |
| Trade name / tagline | Nexyyra Events · "Creating Experiences That Last Forever" (orchestrator aligns `SITE_CONFIG.tagline`, which currently reads "The Next Era of Celebrations") |
| Contact | +91 7020640157 (phone + WhatsApp) · Info.Events@nexyyra.com · https://www.nexyyra.com |
| Registered address | Aaditya Seva Sadan, Hiwarkhed–Telhara Rd, Gajanan Nagar, Telhara, Maharashtra 444108 |
| Second office | "Delivery & Coordination Office — Pune". **No Pune street address exists. Never invent one, never embed a Pune map pin.** |
| Service areas | Pune, Mumbai, Delhi, Bangalore, Hyderabad, Jaipur, Indore, Nashik, Nagpur, Ahmedabad, Surat, Goa, Udaipur, pan-India, international (`ENTITY_FACTS.serviceAreas`) |
| Languages | English, Hindi, Marathi |
| Commitments (business-controlled policies — allowed, and the site's trust block) | free no-obligation consultation · same-day planner reply (9am–9pm IST) · itemised proposal within 48 hours of consultation · one dedicated event director · 30% advance secures the date, balance in milestones · Razorpay / bank transfer / UPI |
| Price story (single source) | `BRAND_INVESTMENTS` in `src/brand/data/content.ts`: Boutique Experience from ₹10 Lakhs (50–150 guests) · Signature Gala from ₹35 Lakhs (150–500) · Grand Masterpiece from ₹1 Crore+ (500+). Single-service production from `services[].basePrice` in `src/data/cms.ts` (₹2L–₹20L). Bands = `BUDGET_RANGES` in `src/lib/constants.ts`. |
| 12 services (slugs) | wedding-planning, destination-weddings, corporate-events, celebrity-management, birthday-events, conferences, fashion-shows, concert-management, exhibitions, brand-promotions, product-launches, event-production |

### 1.2 Honesty rules (non-negotiable)
- No invented statistics (events, years, cities count, clients, team size, ratings), no client names/logos, no awards, press, testimonials, quotes, "trusted by", "licensed & insured", "India's #1 / leading / premier", no invented venues/vendors/partners, no fake team photos.
- `BRAND_CASE_STUDIES` are **illustrative concepts**: the word "Concept" is rendered wherever one is shown (the `ConceptTag` primitive cannot be omitted via props). Their `venue` strings ("Heritage Palace, Udaipur", "The Grand Ballroom, Mumbai", "Beachfront Paradise, Goa") are invented names → render only the venue *type* ("Heritage palace", "Hotel ballroom", "Beachfront"). The copy agent rewrites "military-precision", "broadcast-quality", "120-person on-ground team", "2,000 virtual guests" as capability statements without numbers.
- Describe capability and process, never track record. Banned words: trusted, award-winning, industry-leading, premier, leading, #1, NDA-bound, museum standards, military-precision, broadcast-grade.
- Confirmed hazards V6 must remove: founder names/story in `about-view` and `src/data/team.ts` (render only if verified against the MCA filing, and never with photos); the pricing "Annual Retainer ₹30 Lakhs/yr · save 15%" toggle and any "Most Popular/Most requested" badge; "Our Films" / "Live Archive" labels; the "Editorial pipeline" of unpublished briefs on /blog; `portfolioItems`, `venues`, `vendors` (with 4.9 ratings) in `cms.ts` — never rendered on indexable pages (the /vendors and /venues pages stay `noIndex` and are out of V6 scope; recommend deletion); "Premier" in `local-seo-pages.ts` H1s; venue "partnership" highlights in `location-pages.ts`; blog author names (Sneha Reddy, Raj Mehta, Ananya Kapoor, Vikram Singh) → "Nexyyra Events" unless a real staff member is confirmed; the Pune map iframe on /contact; `role="menu"` on link lists.
- Decks (editorial intro lines) are house copy: no quotation marks, no attribution, roman not italic — nothing on the site may read as a testimonial.
- Captions and alt text describe what is in frame; they never name a client, guest, venue or city the owner has not confirmed in writing.
- Copy voice: premium, cinematic, confident, warm, specific. Short sentences. British/Indian English. ₹ with Indian grouping (₹35,00,000 in ledgers, ₹35 Lakhs in prose) via `formatCurrency`. No developer jargon and **no design-metaphor jargon** visible to users (see §2.1).

---

## 2. Design principles

1. **Navy is the paper, photography is the proof.** One continuous `--lux-bg` surface; the 102 real photographs run as full-bleed spreads, diptychs, split covers and a sticky frame — shown straight, true-colour, with captions beneath, never with copy on top (the lightbox counter is the only exception).
2. **Type does the talking.** Oversized Cormorant display, a 12-column asymmetric grid, numbered chapters separated by hairlines, decks and standfirsts instead of slogans. Cormorant never below 1.375rem; Manrope for everything a visitor reads to act.
3. **Gold is furniture, purple is action.** Gold only as labels, folios, numerals, hairlines, drop caps, link underlines, the focus ring and the icon jewel — never a fill. Purple only on the single primary action per viewport and the one accent word in an H1.
4. **Proof without claims.** Prices, commitments, the five-step method, the twelve-service index and honest "Concept" tags are the trust layer. No stats, no quotes, no logos.
5. **Warmth in every chapter.** No chapter is hairlines alone: each carries one photographic moment or one piece of gold typographic furniture (drop cap, oversized numeral, drawn rule). Indian wedding colour stays saturated.
6. **Motion is scroll-linked, short and transform-only.** Nothing autoplays or loops; one still cover per page; reveals and photo scale ride `animation-timeline: view()` and degrade to static.
7. **Server by default, islands by exception.** Every view is a server component; the only client islands are enumerated in §11. No framer-motion, GSAP or Lenis in any V6 file.

### 2.1 Binding "must avoid" list (merged from the three judgements)
- Metaphor in user-facing copy: no "In this issue", "This page isn't in this issue", "Back to the index", "End credits", "Intermission", "Concept to curtain call", "The Programme", "Act I", "Production stills", "Concierge". Nav and chapter labels are plain words: Services · About · How we work · Concepts · Commitments · Investment · Questions · Contact.
- SaaS/dev-tool vocabulary and patterns: ⌘K / command palette, "Plan ⌘K", bento grids, section rail with progress marker, scroll progress bar, comparison tables against "doing it yourself" or mechanically derived from feature lists, animated conic "spotlight" borders, magnetic buttons, five-item docks.
- Cinzel anywhere except the chapter folio numeral, the 404 numeral and the wordmark lock-up; at most one Cinzel element per viewport; never a heading face, never on service names, ledger heads or eyebrows.
- Film-studio/advertising icon motifs (clapperboard, megaphone, lightning bolt). Icons say "event house".
- Ambient or looping motion: Ken Burns, crossfade carousels, marquees/tickers, drifting numerals, aurora orbs, grain, vignette, parallax backdrops under text. Loops longer than 5s with no visible pause control fail WCAG 2.2.2 on touch.
- Text over photographs outside the lightbox counter. Captions beneath, copy beside. No veils/slates on 4:5 mobile crops.
- `filter: saturate(.94)` or any desaturation/duotone on photographs. No CSS `filter` on gallery tiles at all.
- Glass cards in the reading flow; "Most Popular" badges; the retainer toggle; a Pune map pin; unverified founders; duotone texture backdrops; captions naming unconfirmed venues/clients/cities.
- Three different labels for one action. The primary label site-wide is **"Get a Free Proposal"**; WhatsApp and Call are the only other CTAs.
- Stacking fixed chrome on phones: header plus one bottom bar only (≤ 128px total); no sticky chip rails.
- Photo-first mobile covers that push the H1 and CTA below the first screen.
- Hover-only thumbnails as the only photographic scent for services on phones.
- Mixing Concept cards with real photographs in one strip or grid without a visible divider.
- Italic decks/manifesto lines styled like pull-quotes.
- Keeping `/testimonials` as a path (308 → `/why-nexyyra`).
- Technical: `position:absolute` popovers (top layer ignores ancestors); server CTAs that "call analytics" without the delegated handler; forcing `<details>` open with CSS alone; `priority` images served from lh3.googleusercontent.com; animating header `height` on a scroll timeline; `grid-auto-flow: dense` on grids of links; renaming shared classes mid-flight; adding required props to `InquiryForm` from a page package; Speculation Rules without `document.prerendering` gating; mounting 12 backdrop photos on the home page; a second inquiry entry flow (the "QuickInquiry" chip sheet is **not** built — the action bar scrolls to the on-page `InquiryPanel` or links to `/book-event`).

---

## 3. Tokens — `src/styles/tokens.css` (the ONE token file)

Created by the foundation package; imported first in `globals.css` (after `@import "tailwindcss"`). `src/brand/design-system/{tokens,v4-tokens,v5-tokens}.css` are deleted once their aliases below are moved here; the `:root` block in `luxury-redesign.css` is removed (its values live here). All V6 CSS uses `--lux-*` only; legacy aliases exist solely so unmigrated files keep rendering and are deleted at the end of the rebuild.

```css
:root {
  color-scheme: dark;

  /* ── Colour: base palette (unchanged hexes) ───────────────────────── */
  --lux-bg: #050816;
  --lux-bg-secondary: #081226;      /* legacy band colour; V6 uses --lux-surface-* */
  --lux-section: #0d1730;           /* legacy; kept for unmigrated CSS */
  --lux-card-solid: #101b35;        /* legacy; kept for unmigrated CSS */
  --lux-gold: #d8b26a;
  --lux-gold-metal: #f4d08d;        /* ≤2px highlights only */
  --lux-rose: #d9a47b;              /* legacy alias target only; unused in V6 */
  --lux-purple: #8b4dff;
  --lux-purple-bright: #b47cff;
  --lux-violet: #6f42ff;
  --lux-white: #f7f7f7;
  --lux-muted: #b6b8c6;             /* running copy, 10.1:1 on navy */
  --lux-subtle: #98a0b5;            /* meta/captions, 6.6:1 — the minimum text tone */
  --lux-danger: #ff9b9b;            /* 7.4:1 */
  --lux-success: #9fd8b4;
  --lux-whatsapp: #25d366;          /* icon stroke only — never a fill behind white text */

  /* ── Colour: surfaces (three levels, derived — no new hexes) ─────── */
  --lux-surface-1: color-mix(in oklab, var(--lux-bg), white 3.5%);  /* plates, ledgers, action bar, scrolled header */
  --lux-surface-2: color-mix(in oklab, var(--lux-bg), white 7%);    /* inputs, mobile menu, popover panel, lightbox chrome */
  --lux-surface-3: color-mix(in oklab, var(--lux-bg), white 11%);   /* toasts, row hover tint */
  --lux-card: rgba(16, 27, 53, 0.55);  /* glass — allowed only over photography (header over cover, lightbox counter, action bar) */
  --lux-border: rgba(255, 255, 255, 0.08);
  --lux-border-strong: rgba(255, 255, 255, 0.14);
  --lux-border-gold: rgba(216, 178, 106, 0.28);
  --lux-gold-12: color-mix(in srgb, var(--lux-gold) 12%, transparent);
  --lux-gold-55: color-mix(in srgb, var(--lux-gold) 55%, transparent);   /* oversized numerals */
  --lux-scrim: linear-gradient(to top, rgb(5 8 22 / .94) 0%, rgb(5 8 22 / .55) 45%, transparent 75%); /* lightbox counter only */
  --lux-gradient-purple: linear-gradient(135deg, var(--lux-violet) 0%, var(--lux-purple) 55%, var(--lux-purple-bright) 100%);
  --lux-gradient-accent: linear-gradient(120deg, var(--lux-purple-bright), #c79bff); /* .lux-accent-purple text */
  --lux-gradient-gold-line: linear-gradient(90deg, transparent, var(--lux-gold), transparent);

  /* ── Shadows / glows ─────────────────────────────────────────────── */
  --lux-glow: 0 24px 80px rgba(0, 0, 0, 0.42), 0 0 42px rgba(216, 178, 106, 0.14);
  --lux-glow-purple: 0 18px 50px rgba(139, 77, 255, 0.4);
  --lux-shadow-plate: 0 30px 90px -30px rgba(0, 0, 0, 0.9);   /* dialogs, popover panel */
  --lux-ring: 0 0 0 2px var(--lux-gold);                       /* focus */

  /* ── Typography ──────────────────────────────────────────────────── */
  --lux-font-display: var(--font-cormorant), "Cormorant Garamond", Georgia, serif;
  --lux-font-body: var(--font-manrope), Manrope, system-ui, sans-serif;
  --lux-font-accent: var(--font-playfair), "Playfair Display", Georgia, serif;   /* drop cap + <em> inside Cormorant headings only */
  --lux-font-folio: var(--font-cinzel), Cinzel, serif;                           /* folio numerals + 404 numeral only */

  --lux-text-display-xl: clamp(2.875rem, 1.9rem + 4.9vw, 7.5rem);   /* home H1, 404 numeral */
  --lux-text-display: clamp(2.5rem, 1.75rem + 3.4vw, 5.25rem);      /* page H1 */
  --lux-text-h2: clamp(2rem, 1.45rem + 2.1vw, 3.5rem);
  --lux-text-h3: clamp(1.5rem, 1.25rem + 0.95vw, 2.125rem);         /* index-row titles, ledger terms, case titles */
  --lux-text-deck: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);           /* one deck per page, roman */
  --lux-text-lead: clamp(1.0625rem, 1rem + 0.4vw, 1.3125rem);       /* standfirst */
  --lux-text-body: clamp(1rem, 0.96rem + 0.2vw, 1.0625rem);
  --lux-text-small: 0.8125rem;                                       /* captions, meta, ledger cells, action-bar labels */
  --lux-text-label: 0.72rem;                                         /* .lux-label eyebrow */
  --lux-text-folio: 0.75rem;                                         /* Cinzel chapter numeral */
  --lux-text-numeral: clamp(3rem, 2rem + 4vw, 6rem);                 /* oversized ledger numerals */
  --lux-text-price: clamp(1.375rem, 1.2rem + 0.8vw, 2rem);           /* "From ₹8,00,000" in ledgers */
  --lux-text-ui: 0.78rem;                                            /* buttons, nav */

  --lux-leading-display: 0.94;
  --lux-leading-heading: 1.04;
  --lux-leading-h3: 1.12;
  --lux-leading-deck: 1.22;
  --lux-leading-lead: 1.55;
  --lux-leading-body: 1.72;
  --lux-tracking-display: -0.015em;
  --lux-tracking-label: 0.32em;
  --lux-tracking-folio: 0.24em;
  --lux-tracking-ui: 0.16em;

  /* ── Layout ──────────────────────────────────────────────────────── */
  --lux-container: 90rem;           /* .brand-container / content rail */
  --lux-wide: 72rem;                /* ledgers, indexes, forms, price table */
  --lux-measure: 44rem;             /* articles, legal, FAQs (≈62ch body) */
  --lux-gutter: clamp(1rem, 4vw, 2.5rem);   /* 16px floor at phone width */
  --lux-grid-gap: clamp(1rem, 2vw, 2rem);
  --lux-nav-h: 4.25rem;             /* desktop header 68px */
  --lux-nav-h-mobile: 4rem;         /* 64px */
  --lux-actionbar-h: 4rem;          /* 64px + safe-area */

  /* ── Spacing ─────────────────────────────────────────────────────── */
  --lux-space-1: 0.25rem;  --lux-space-2: 0.5rem;  --lux-space-3: 0.75rem;
  --lux-space-4: 1rem;     --lux-space-5: 1.5rem;  --lux-space-6: 2rem;
  --lux-space-7: 3rem;     --lux-space-8: 4rem;    --lux-space-9: 6rem;
  --lux-space-tight: clamp(1.25rem, 3vw, 2rem);
  --lux-space-block: clamp(2rem, 5vw, 4rem);
  --lux-space-section: clamp(4.5rem, 10vw, 10rem);
  --lux-space-cover: clamp(3rem, 8vw, 7rem);      /* cover top padding under the header */

  /* ── Radii ───────────────────────────────────────────────────────── */
  --lux-radius-xs: 0.25rem;   /* inline frames, thumbnails */
  --lux-radius-sm: 0.5rem;    /* inputs, chips */
  --lux-radius-md: 1rem;      /* plates, popover panel, dialogs */
  --lux-radius-lg: 1.5rem;    /* legacy; mobile menu sheet */
  --lux-radius-xl: 2rem;      /* legacy */
  --lux-radius-pill: 999px;   /* buttons */
  /* spreads, covers, diptychs, gallery tiles: radius 0 */

  /* ── Motion ──────────────────────────────────────────────────────── */
  --lux-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --lux-ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --lux-dur-fast: 160ms;     /* chips, checks, underline */
  --lux-dur-ui: 240ms;       /* hover lift, popover, details */
  --lux-dur-open: 280ms;     /* dialog, mobile menu, action bar */
  --lux-dur-morph: 320ms;    /* view-transition shared elements */
  --lux-dur-image: 900ms;    /* hover scale on photos */
  --lux-reveal-rise: 24px;

  /* ── Z-index (top-layer elements need none) ──────────────────────── */
  --lux-z-content: 1;
  --lux-z-sticky: 10;        /* on-page contents, sticky photo frame */
  --lux-z-actionbar: 800;
  --lux-z-consent: 850;      /* consent sheet sits above the action bar in stacking AND in position (bottom offset) */
  --lux-z-header: 900;
  --lux-z-toast: 950;

  /* ── Icons ───────────────────────────────────────────────────────── */
  --icon-stroke: 1.5;
  --icon-jewel: var(--lux-gold);

  /* ── Legacy aliases — keep until the last unmigrated file is gone ─── */
  --glitz-bg: var(--lux-bg);
  --glitz-surface: var(--lux-card);
  --glitz-surface-elevated: var(--lux-card-solid);
  --glitz-card: var(--lux-card);
  --glitz-glass: var(--lux-card);
  --glitz-border: var(--lux-border);
  --glitz-gold: var(--lux-gold);
  --glitz-gold-light: var(--lux-gold-metal);
  --glitz-gold-metallic: var(--lux-gold);
  --glitz-gold-shine: var(--lux-gold-metal);
  --glitz-dune: var(--lux-rose);
  --glitz-dune-glow: var(--lux-gold-metal);
  --glitz-ivory: var(--lux-white);
  --glitz-text: var(--lux-white);
  --glitz-text-secondary: var(--lux-muted);
  --glitz-muted: var(--lux-subtle);
  --glitz-glow: var(--lux-glow);
  --glitz-glow-strong: var(--lux-glow);
  --glitz-gradient-gold: linear-gradient(135deg, var(--lux-gold), var(--lux-gold-metal));
  --glitz-gradient-gold-hover: linear-gradient(135deg, var(--lux-gold-metal), var(--lux-gold));
  --gold: var(--lux-gold);
  --gold-light: var(--lux-gold-metal);
  --text-primary: var(--lux-white);
  --text-secondary: var(--lux-muted);
  --text-muted: var(--lux-subtle);
  --background: var(--lux-bg);
  --surface: var(--lux-bg-secondary);
  --card: var(--lux-card-solid);
  --border: var(--lux-border-gold);
  --footer-bg: var(--lux-bg);
  --footer-card: var(--lux-card);
  --footer-border: var(--lux-border);
  --footer-accent: var(--lux-gold);
  --nav-height: var(--lux-nav-h);
  --header-height: var(--lux-nav-h);
  --mobile-nav-height: var(--lux-nav-h-mobile);
  --v4-obsidian: var(--lux-bg);      --v5-obsidian: var(--lux-bg);
  --v4-dark-surface: var(--lux-bg-secondary);  --v5-dark-surface: var(--lux-bg-secondary);
  --v4-gold-luxury: var(--lux-gold); --v5-gold-luxury: var(--lux-gold);
  --v4-gold-metallic: var(--lux-gold); --v5-gold-metallic: var(--lux-gold);
  --v4-champagne: var(--lux-gold-metal); --v5-gold-champagne: var(--lux-gold-metal);
  --v4-ivory: var(--lux-white);      --v5-ivory: var(--lux-white);
  --v4-dune: var(--lux-rose);        --v5-dune: var(--lux-rose);
  --v4-radius-sm: var(--lux-radius-sm); --v4-radius: var(--lux-radius-md);
  --v4-radius-lg: var(--lux-radius-lg); --v4-radius-xl: var(--lux-radius-xl);
  --v5-radius-sm: var(--lux-radius-sm); --v5-radius-md: var(--lux-radius-md);
  --v5-radius-lg: var(--lux-radius-lg); --v5-radius-xl: var(--lux-radius-xl);
  --v4-glow-gold: var(--lux-glow);
  --v4-ease-luxe: var(--lux-ease);   --v5-ease-luxe: var(--lux-ease);
  --v4-dur-fast: var(--lux-dur-ui);  --v5-dur-fast: var(--lux-dur-ui);
  --v4-dur-base: 0.6s;               --v5-dur-base: 0.6s;
  --v4-section: var(--lux-space-section); --v5-section: var(--lux-space-section);
  --v4-measure: var(--lux-measure);  --v5-measure: var(--lux-measure);
  --v4-text-body: var(--lux-text-body);   --v5-text-body: var(--lux-text-body);
  --v4-text-title: var(--lux-text-h2);    --v5-text-title: var(--lux-text-h2);
  --v4-text-display: var(--lux-text-display); --v5-text-display: var(--lux-text-display);
  --v4-grain-opacity: 0;             --v5-grain-opacity: 0;   /* grain retired */
}

@media (min-width: 1024px) { :root { --lux-nav-h-current: var(--lux-nav-h); } }
@media (max-width: 1023.98px) { :root { --lux-nav-h-current: var(--lux-nav-h-mobile); } }
```

Tailwind: `globals.css` `@theme inline` maps `--color-*`, `--font-*` and `--text-*` to these (`--color-lux-gold: var(--lux-gold)` etc.) so utilities like `text-lux-gold`, `bg-lux-surface-1` exist; page agents never add new `@theme` entries. The light-mode `:root` block in `globals.css` (`--background: #fdfbf5` …) is deleted: the site is dark-only (`color-scheme: dark`, `theme-color #050816`).

---

## 4. Typography system

| Role | Class | Face / weight | Size | Leading / tracking | Rules |
|---|---|---|---|---|---|
| Home H1 | `.lux-heading--display-xl` | Cormorant 500 | `--lux-text-display-xl` | 0.94 / −0.015em | `text-wrap: balance`; one `.lux-accent-purple` word allowed |
| Page H1 | `.lux-heading--display` | Cormorant 500 | `--lux-text-display` | 0.98 / −0.01em | balance |
| Chapter H2 | `.lux-heading--h2` | Cormorant 500 | `--lux-text-h2` | 1.04 | balance; one per chapter |
| H3 / index titles / ledger terms | `.lux-heading--h3` | Cormorant 600 | `--lux-text-h3` | 1.12 | balance |
| Deck | `.lux-deck` | Cormorant 400 **roman** | `--lux-text-deck` | 1.22, max 26ch | ≤ 1 per page; no quotes, no attribution; `hanging-punctuation: first` |
| Standfirst | `.lux-lead` | Manrope 400 | `--lux-text-lead` | 1.55, max 54ch | `text-wrap: pretty`; colour `--lux-muted` |
| Body | `.lux-prose` | Manrope 400 | `--lux-text-body` | 1.72, max 62ch (`.lux-measure` = 44rem) | `text-wrap: pretty`; `p + p { margin-block-start: 1lh }` |
| Small / caption / meta | `.lux-small` | Manrope 500 | `--lux-text-small` | 1.5 | colour `--lux-subtle` (minimum tone) |
| Eyebrow | `.lux-label` | Manrope 700 uppercase | `--lux-text-label` | 0.32em | gold; existing class; single leading rule on phones (`.lux-label--rule-leading`), both rules from md |
| Folio numeral | `.lux-folio` | **Cinzel** 400 uppercase | `--lux-text-folio` | 0.24em | gold, `aria-hidden`; the only Cinzel on a page (404 numeral aside) |
| Oversized numeral | `.lux-numeral` | Cormorant 300 | `--lux-text-numeral` | 1 | `--lux-gold-55`, `font-variant-numeric: lining-nums tabular-nums`; sits **beside** text, never behind it |
| Price | `.lux-price` | Manrope 600 | `--lux-text-price` | 1.1 | `tabular-nums`; "From ₹8,00,000" (ledger) / "From ₹8 Lakhs" (prose); always from data via `formatCurrency` |
| UI (buttons, nav) | `.luxury-button`, `.lux-nav__link` | Manrope 700 uppercase | `--lux-text-ui` | 0.16em (buttons) / 0.08em (nav, 600) | existing button class |
| Drop cap | `.lux-dropcap::first-letter` | Playfair 500 | 3.2em, float left, lh 0.8 | padding-right .12em | gold; first `<p>` of essays/articles only |
| Inline emphasis in headings | `em.lux-em` | Playfair 400 italic | inherit | | e.g. "planned *end-to-end*" |

Rules: Cormorant never below 1.375rem (its hairlines fail contrast small). Playfair only for the drop cap and `em.lux-em`. All headings `text-wrap: balance`, all prose `text-wrap: pretty`. `font-feature-settings: "liga","dlig","kern"` on Cormorant. Links in prose: `text-decoration: underline; text-decoration-color: var(--lux-gold); text-underline-offset: .2em; text-decoration-thickness: 1px`. Inputs ≥ 16px. Contrast guarantees on navy: white 17.6:1, muted 10.1:1, subtle 6.6:1, gold 9.0:1, white on `#8b4dff` 4.9:1.

---

## 5. Layout

### 5.1 Page frame and containers
- `.lux-page` (root of every view): named-line grid so any child bleeds without negative margins or `100vw` tricks —
  `grid-template-columns: [full-start] minmax(var(--lux-gutter), 1fr) [content-start] min(100% - 2 * var(--lux-gutter), var(--lux-container)) [content-end] minmax(var(--lux-gutter), 1fr) [full-end]`. Children default to `grid-column: content`; `.lux-bleed { grid-column: full }`. `main { overflow-x: clip }` (clip, not hidden — keeps sticky working). No `transform` on `.lux-page` or `main`.
- Reading widths: `.lux-measure` 44rem (articles, legal, FAQ answers), `.lux-wide` 72rem (ledgers, indexes, forms, price table), `.brand-container` 90rem (grids, spreads inside content). Max line length is enforced by these classes, never by padding.
- Existing `.brand-container` keeps `padding-inline: var(--lux-gutter)` for pages not yet migrated.

### 5.2 Grid
- `.lux-grid`: `display:grid; grid-template-columns: repeat(var(--lux-cols, 6), minmax(0,1fr)); gap: var(--lux-grid-gap)`; `--lux-cols: 12` at ≥ 768px.
- Span utilities (desktop → phone full width): `.lux-col-text` (1 / span 6), `.lux-col-media` (7 / span 6), `.lux-col-wide` (2 / span 10), `.lux-col-measure` (3 / span 8), `.lux-col-aside` (9 / span 4), `.lux-col-offset` adds `margin-top: clamp(2rem, 8vw, 7rem)` at ≥ 1024 for the magazine stagger.
- `.lux-grid--ruled > * + *` at ≥ 1024: `border-left: 1px solid var(--lux-border); padding-left: 2rem` (side-by-side text columns divided by a hairline).
- The split cover is a `.lux-bleed` child with its own rails + 12 columns (it cannot mix `.lux-grid` columns with the page rails): `.lux-cover { grid-template-columns: [full-start] minmax(var(--lux-gutter),1fr) [content-start] repeat(12, minmax(0, calc((min(100% - 2*var(--lux-gutter), var(--lux-container)) - 11*var(--lux-grid-gap)) / 12))) [content-end] minmax(var(--lux-gutter),1fr) [full-end] }` with `.lux-cover__text { grid-column: content-start / span 6 }` and `.lux-cover__media { grid-column: 7 / full-end }` at ≥ 1024.

### 5.3 Section rhythm
- Chapters (`.lux-section`) are separated by a 1px hairline (`border-top: 1px solid var(--lux-border)`) with the folio numeral sitting on the rule, never by coloured bands. Padding-block `--lux-space-section`; `.lux-section--tight` uses `--lux-space-block`; a chapter opening with a spread (`.lux-section:has(> .lux-spread:first-child)`) drops its top padding so the photo touches the rule.
- Every chapter head: folio + eyebrow + H2 (+ optional deck/lead) in `.lux-col-text`, left-aligned (centred heads only on 404 and the inquiry success state); ≥ `--lux-space-block` between head and body. Spreads are preceded and followed by `--lux-space-section`.
- Surface alternation: none. The page is one `--lux-bg` surface; `--lux-surface-1` plates appear only for ledgers, the inquiry plate, the price table and the action bar. The body aurora gradient in `luxury-redesign.css` is removed.
- Below-fold chapters: `content-visibility: auto; contain-intrinsic-size: auto 48rem`.
- All `[id]` targets: `scroll-margin-top: calc(var(--lux-nav-h-current) + 1rem)`.

### 5.4 "Bento" rules
Bento grids are banned by the judges and are not built. The only mixed-span grids are the gallery (`.lux-gallery`, spans from curation: wide 8 / standard 4 / tall 4 columns, **no** `grid-auto-flow: dense` — spans are assigned from data in DOM order so focus order equals visual order, gaps are accepted) and the diptych. Services on phones are an **icon-and-price card grid** (`.lux-index--cards`, 2-up, no photos), not a bento.

### 5.5 Breakpoints
Tailwind defaults: sm 640 · md 768 (12-col grid on, diptych side-by-side, commitments 4-up) · lg 1024 (split cover, sticky photo frame, desktop header, ruled columns, on-page contents sticky) · xl 1280 · 2xl 1536. Phone baseline 360px wide: 16px gutters, no horizontal scroll, header 64px + action bar 64px (+ safe area) as the only fixed chrome.

---

## 6. Shared primitives — `src/components/ui/` (server components unless marked)

Files are flat in `src/components/ui/`; a barrel `src/components/ui/index.ts` re-exports the V6 set. The existing `button.tsx`, `input.tsx`, `form-input.tsx` stay for admin/dashboard only. Class names are BEM-ish and prefixed `lux-`; page-local CSS uses `pg-<area>-` and lives in `src/styles/pages/<area>.css` inside `@layer components` (so Tailwind utilities still win). Page packages must never redefine a `lux-*` class.

| Primitive | File | Props (TypeScript) | Classes / behaviour |
|---|---|---|---|
| `Section` | `section.tsx` | `{ id: string; number?: string; eyebrow?: string; title?: ReactNode; titleAs?: "h2"\|"h3"; deck?: ReactNode; lead?: ReactNode; actions?: ReactNode; tone?: "page"\|"plate"; space?: "section"\|"block"\|"tight"; bleed?: boolean; lazy?: boolean; className?; children }` | `<section class="lux-section [lux-section--plate] [lux-bleed]" aria-labelledby="{id}-title">`; renders `SectionHead` when `title` given; `lazy` adds `content-visibility:auto`. Hairline top rule; `number` renders `.lux-folio` on the rule (top-right ≥ lg, above the eyebrow below). The gold rule under the head draws in via `@property --lux-rule` (see §9). |
| `SectionHead` | `section-head.tsx` | `{ id; number?; eyebrow?; title; titleAs; deck?; lead?; actions? }` | `.lux-section__head` → `.lux-folio`, `Eyebrow`, `Heading`, `.lux-deck`, `.lux-lead`, `.lux-section__actions` (text links only). Left-aligned; `.lux-col-text`. |
| `Eyebrow` | `eyebrow.tsx` | `{ as?: "p"\|"span"; rule?: "leading"\|"both"\|"none"; children }` | existing `.lux-label` + modifiers `.lux-label--rule-leading`/`--rule-none`. Gold Manrope caps. |
| `Heading` | `heading.tsx` | `{ as: "h1"\|"h2"\|"h3"; size?: "display-xl"\|"display"\|"h2"\|"h3"; accent?: string; id?; viewTransitionName?: string; className?; children }` | `.lux-heading .lux-heading--{size}`; `accent` wraps that word in `.lux-accent-purple` (allowed once per page, H1 only); `viewTransitionName` wraps in `<ViewTransition name>`. |
| `Deck` | `deck.tsx` | `{ children }` | `<p class="lux-deck">`; roman Cormorant; no quote marks; one per page (lint rule: the page package asserts it). |
| `Prose` | `prose.tsx` | `{ measure?: "text"\|"wide"; size?: "body"\|"lead"; dropcap?: boolean; as?: "div"\|"article"; children }` | `.lux-prose [lux-measure\|lux-wide] [lux-dropcap] [lux-prose--lead]`; gold link underlines; `h2`/`h3` inside get folio numerals via `counter`. |
| `Button` | `lux-button.tsx` (export `Button`) | `{ variant?: "primary"\|"ghost"\|"text"; size?: "md"\|"compact"\|"full"; href?: string; asChild?: boolean; arrow?: boolean; icon?: ReactNode; cta: string; location: string; external?: boolean; type?; disabled?; children }` | Renders `<Link>` when `href`, `<button>` otherwise, Radix `Slot` when `asChild` (stateless → stays a server component). Classes: existing `.luxury-button` + `--purple` (primary) / `--ghost` / `--text` / `--compact` / `--full`; `--arrow` translates the arrow glyph 6px on hover. Emits `data-cta={cta} data-cta-location={location}` — analytics fire from the delegated handler in `AnalyticsProvider` (no onClick). `--gold` is retired from site pages (admin only). Min-height 48px (44px compact). The "primary per viewport" rule is a page responsibility. |
| `Card` | `card.tsx` | `{ level: 1\|2\|3; glass?: boolean; interactive?: boolean; as?: "div"\|"article"\|"li"; padding?: "sm"\|"md"\|"lg"; className?; children }` | `.lux-card--l1/l2/l3` solid surfaces with hairline border; `.lux-card--glass` (`--lux-card` + `backdrop-filter: blur(16px)`) is permitted **only** when the card sits over photography (lightbox counter) — never in the reading flow; `--interactive` adds hover border → gold, translateY(−2px). Radius `--lux-radius-md`. |
| `Reveal` | `reveal.tsx` | `{ as?: keyof JSX.IntrinsicElements; index?: number; range?: "entry"\|"cover"; className?; children }` | `.lux-reveal` with `style={{"--i": index}}`; pure CSS scroll-driven (see §9). No JS, no IntersectionObserver fallback: without support the element is simply visible. |
| `Marquee` → built as `Strand` | `strand.tsx` | `{ as?: "ul"\|"div"; ariaLabel: string; itemWidth?: string; snap?: "mandatory"\|"proximity"; nav?: boolean; children }` | `.lux-strand`: horizontal, **user-driven**, `scroll-snap-type: x {snap}`, `scroll-padding-inline: var(--lux-gutter)`, `overscroll-behavior-x: contain`, items `min-width: var(--lux-strand-item, 78vw)` on phones, becomes `.lux-grid` at ≥ 768 unless `nav`. It never auto-scrolls (looping marquees are banned); `nav` mounts the `StrandNav` island (prev/next buttons) only under `@media (hover:hover)`. |
| `MediaFrame` | `media-frame.tsx` | `{ asset?: CurationId; src?; alt?; width?; height?; ratio: "3:2"\|"4:5"\|"3:4"\|"1:1"\|"21:9"\|"16:10"\|"4:3"; sizes: string; priority?: boolean; focal?: {x:number;y:number}; caption?: string; index?: string; frame?: boolean; viewTransitionName?: string; className? }` | `<figure class="lux-frame lux-frame--{ratio} [lux-frame--gilt]">` with `aspect-ratio` reserved (zero CLS), `BrandImage` inside (`object-position` from `focal`), `loading="lazy" decoding="async" fetchpriority="low"` unless `priority`; `caption`/`index` render `.lux-caption` **beneath** the image (`<figcaption>`, `--lux-text-small`, top hairline, `justify-content: space-between`, index "No. 034" right). `frame` draws the 1px inset gold hairline ("gilt frame": `box-shadow: inset 0 0 0 1px var(--lux-border-gold)`). When `asset` is given, `src/alt/width/height/focal/caption` come from `image-curation.ts`. No overlays except `data-overlay="counter"` used by the lightbox. |
| `Badge` / `ConceptTag` | `badge.tsx` | `Badge { tone?: "neutral"\|"gold"; children }`; `ConceptTag {}` (no props) | `.lux-badge`, `.lux-badge--gold`; `ConceptTag` renders existing `.lux-concept-tag` with the fixed text "Concept" and `title="Illustrative concept, not a delivered event"` — it cannot be renamed via props. |
| `Accordion` | `accordion.tsx` | `{ name: string; items: { id: string; question: string; answer: ReactNode\|string }[]; schema?: boolean; headingLevel?: 2\|3; className? }` | `<div class="lux-faq">` of `<details name={name} class="lux-faq__item" id={id}>`; `<summary>` ≥ 44px (Cormorant `--lux-text-h3` question, plus/close glyph rotates 45° when open); answer in `.lux-measure`; `interpolate-size: allow-keywords` height transition where supported. `schema` emits `faqSchema(items)` JSON-LD for exactly these items. Native semantics only (no aria-expanded hand-rolling). |
| `Tabs` | `tabs.tsx` | `{ items: { href: string; label: string; count?: number }[]; current: string; ariaLabel: string }` + `TabsRadio { name; items: { value; label }[]; defaultValue }` | `Tabs`: server-rendered link tabs (`<nav><ul>` of `<a aria-current="page">`) for crawlable filters (`?f=`, `?c=`) — active tab gold underline. `TabsRadio`: radio inputs + labels for zero-JS in-page filtering via `:has()` (`.lux-gallery:has(#f-weddings:checked) [data-cat]:not([data-cat="weddings"]) { display:none }`), used only where the URL need not change. Neither animates. |
| `Commitments` | `commitments.tsx` | `{ variant?: "row"\|"grid"\|"cover"; expanded?: boolean; items?: Commitment[] }` | `<dl class="lux-commit lux-commit--{variant}">` from `BRAND_COMMITMENTS` (new array in `content.ts`: four policies; `cover` renders the first three). `dt` Cormorant `--lux-text-h3` white, `dd` muted; each cell marked by the gold jewel dot, no icons; 2×2 at ≥ 640, 4-up at ≥ 1024 (`grid`), single hairline row (`row`), `cover` = 3 cells on the cover's bottom hairline. **No statistics, ever.** |
| `Breadcrumbs` | `breadcrumbs.tsx` | `{ items: { name: string; href: string }[]; schema?: boolean }` | `<nav aria-label="Breadcrumb" class="lux-crumbs"><ol>`; 0.78rem subtle, gold "·" separators, middle items truncated on phones, last item `aria-current="page"`; `schema` emits `breadcrumbSchema`. On every inner route. |
| `Pagination` | `pagination.tsx` | `{ page: number; pageCount: number; hrefFor: (p:number)=>string; ariaLabel?: string }` | `<nav class="lux-pagination">` with prev/next (`rel="prev/next"`) and numbered links, `aria-current="page"`; 44px targets. Blog index and gallery (page size 24). |
| `InquiryPanel` | `inquiry-panel.tsx` | `{ id?: string; source: InquirySource; variant?: "full"\|"compact"\|"callback"; defaultEventType?: string; eyebrow?: string; title?: string; lead?: string; contacts?: boolean; priceLine?: string }` | `.lux-inquiry` plate (`--lux-surface-1`, gold hairline frame): copy + contact lines (phone, WhatsApp, email — `data-cta`) in cols 1–5, existing `InquiryForm` in cols 6–12; stacked on phones (contacts as a 3-button row above the form). Includes the `InquirySentinel` island (IntersectionObserver → `document.body.dataset.inquiryVisible`) so the action bar hides while the form is on screen **without touching InquiryForm**. Inputs restyled in `src/styles/pages/inquiry.css`: labels always visible above, bottom-hairline fields (gold on focus), 16px font, 48px min-height, `.lux-field:has(:user-invalid)` red hairline + message, `field-sizing: content` on the textarea. Never a second form. |

Additional V6 primitives (same folder, same rules):

| Primitive | File | Props | Notes |
|---|---|---|---|
| `Cover` | `cover.tsx` | `{ eyebrow; title: ReactNode; titleAccent?; lead; primary: { href; label?: "Get a Free Proposal"; cta }; secondary?: { href; label; cta }; asset?: CurationId; commitments?: boolean; entityLine?: boolean; breadcrumbs?: BreadcrumbItem[]; size?: "xl"\|"l"\|"text"; icon?: ReactNode; folio?: string; priceLine?: string; viewTransitionName? }` | `.lux-cover`. **Mobile order:** breadcrumbs → eyebrow → H1 → lead → primary CTA + text link → `Commitments variant="cover"` → **then** the 4:5 `MediaFrame` → entity line. The offer and CTA are inside the first phone screen. **Desktop (≥ 1024):** text in cols 1–6, photo bleeds cols 7 → right page edge at 4:5, `min-height: 72svh`; text never overlays the photo. `size="text"` = no photo. Cover photo is the LCP: `priority`, local WebP only (`/images/covers/*`), `sizes="(min-width:1024px) 50vw, 100vw"`; scroll-driven scale 1.04 → 1. |
| `ServicesIndex` | `services-index.tsx` | `{ items: ServiceSlug[] \| "all"; variant?: "full"\|"compact"\|"related"; grouped?: boolean; frame?: "none"\|"groups"\|"all" }` | `.lux-index` (desktop) / `.lux-index--cards` (phones). Desktop ≥ 1024: rows left (cols 1–7: numeral · `ServiceIcon` · Cormorant title · one-line narrative from `BRAND_SERVICE_CATEGORIES[].narrative` · `From ₹basePrice` · long arrow), separated by hairlines, each a `<li><a>` with `container-type: inline-size`; a **sticky 4:5 photo frame** right (cols 8–12, `position: sticky; top: calc(var(--lux-nav-h) + 1.5rem)`) holding stacked images swapped by `:has()`: `.lux-index:has([data-slug="x"]:is(:hover,:focus-within)) img[data-slug="x"] { opacity:1 }` — pure CSS. `frame="groups"` (home) mounts **3** images (one per group) at ≤ 828px; `frame="all"` (/services) mounts 12 at ≤ 828px, lazy, only one opaque. Title wrapped in `<ViewTransition name="service-title-{slug}">`. **Phones:** 2-up icon-and-price cards (icon 32, title, From ₹, arrow; no photos). `grouped` inserts hairline sub-heads: Celebrations / Corporate & brand / Production & talent. |
| `Ledger` | `ledger.tsx` | `{ as: "ol"\|"dl"\|"table"; rows; columns?: 1\|2\|4; numerals?: boolean; caption?: string }` | `.lux-ledger`: hairline rows, numeral/term in gold Cormorant, body Manrope; ≥ 768 2- or 4-column grid, phones single column with the numeral left. `table` renders `<caption>`, `<th scope>`. Replaces every glass card. |
| `ProcessLine` | `process-line.tsx` | `{ steps?: typeof BRAND_PROCESS_STEPS; variant?: "full"\|"compact"; columns?: 1\|2 }` | `.lux-process`: `<ol>` of steps with oversized numerals; a 1px gold line (pseudo-element) **draws down** the rail as the list scrolls (`transform: scaleY(0→1)`, `animation-timeline: view()`, range `entry 20% exit 80%`), numerals turn gold at entry; fully drawn without support / reduced motion. Phones: line left, 1.25rem gutter; desktop: numeral column + two text columns. (NOIR's graft, without the metaphor.) |
| `PriceTable` | `price-table.tsx` | `{ collections?: typeof BRAND_INVESTMENTS; services?: boolean }` | `.lux-pricetable`: `<table>` with `<caption>`, columns Boutique / Signature / Grand, rows From · Guests · then the **union of `includes`** ticked only where present (no synthetic ticks); featured column = gold top rule, no badge; `tabular-nums`; under 640px `display: block` parts via container query → stacked cards with the same data. `services` appends the 12-row single-service ledger (icon · service · `From ₹basePrice` · link). |
| `Spread` / `Diptych` | `spread.tsx` | `{ asset: CurationId; caption?: boolean }` / `{ left: CurationId; right: CurationId }` | `.lux-spread` (`.lux-bleed`, 21:9 ≥ 1024, 3:2 below) and `.lux-diptych` (panels 3:4 ≥ 768, 4:5 stacked below); always followed by captions beneath; `sizes="100vw"` / `(min-width:768px) 50vw, 100vw`; scroll-driven scale 1.06 → 1. |
| `Gallery` + `Lightbox` | `gallery.tsx`, `lightbox.tsx` (client) | `Gallery { assets: CurationAsset[]; filter?: string }`; `Lightbox` island | `.lux-gallery` 12-col grid, spans from curation (`wide` 8 / `standard` 4 / `tall` 4 with 3:4 crop), `aspect-ratio` reserved, lazy, `content-visibility`. Tiles are `<a href="#photo-{id}">` so the grid works without JS; `Lightbox` is a native `<dialog closedby="any">` with `@starting-style` fade, arrow keys, swipe via an inner scroll-snap strip (current ±1), focus returned to the tile, counter in a glass `Card` over the image, `<ViewTransition name="photo-{id}">` shared with the tile; dialog image = 1920 variant. |
| `ConceptCard` + `ConceptBanner` | `concept-card.tsx` | `{ study: CaseStudy; viewTransition?: boolean }` / `{}` | `.lux-concept`: 3:2 `MediaFrame`, `ConceptTag` (mandatory), category, Cormorant title, one-line story, specs line (venue type · guests · days · budget band); image in `<ViewTransition name="concept-{id}">`. `ConceptBanner` = the standing line "Illustrative concepts showing the scale we plan. Ask for references at your consultation." Concept cards never share a strip or grid with real photographs (hairline + heading between). |
| `ServiceIcon` / `UiIcon` | `src/components/icons/*` | see §7 | |
| `OnThisPage` | `on-this-page.tsx` | `{ items: { href; label }[] }` | `<nav aria-label="On this page" class="lux-contents">`: plain sticky list (cols 1–3 at ≥ 1024, `top: calc(var(--lux-nav-h) + 1.5rem)`), `<details>` on phones; current item via `:target` only — **no progress marker, no observer.** Articles, legal, FAQs only. |
| ~~`Skeleton`~~ | — | — | **Removed in the review pass.** See §10.0 Loading states. |
| `DetailsOpenAtDesktop` | `details-open-at-desktop.tsx` (client, ~20 lines) | `{ children; minWidth?: 1024 }` | Wraps server-rendered `<details>` groups (footer, FAQ contents): at ≥ minWidth sets `open` and removes `name` so all groups show; restores below. Needed because CSS cannot force `open` (and `::details-content` support is too new). |

### 6.1 Reference CSS for the structural classes (`src/styles/primitives.css`, foundation package)
The sketch below is normative for selectors, custom properties and breakpoints; values come from `tokens.css`. Page packages extend with `pg-*` classes only.

```css
@layer components {
  /* Page frame */
  .lux-page { display: grid; grid-template-columns: [full-start] minmax(var(--lux-gutter), 1fr) [content-start] min(100% - 2 * var(--lux-gutter), var(--lux-container)) [content-end] minmax(var(--lux-gutter), 1fr) [full-end]; }
  .lux-page > * { grid-column: content; }
  .lux-page > .lux-bleed { grid-column: full; }

  /* Chapter */
  .lux-section { position: relative; padding-block: var(--lux-space-section); border-top: 1px solid var(--lux-border); }
  .lux-section--tight { padding-block: var(--lux-space-block); }
  .lux-section--plate { background: var(--lux-surface-1); }
  .lux-section--lazy { content-visibility: auto; contain-intrinsic-size: auto 48rem; }
  .lux-section:has(> .lux-spread:first-child) { padding-top: 0; }
  .lux-section__head { display: grid; gap: 0.75lh; max-width: 38rem; margin-bottom: var(--lux-space-block); }
  .lux-section__head::after { content: ""; height: 1px; background: linear-gradient(90deg, var(--lux-gold) var(--lux-rule, 100%), transparent 0); }
  .lux-folio { position: absolute; top: -0.5em; right: 0; padding-inline: .5rem; background: var(--lux-bg); font: 400 var(--lux-text-folio)/1 var(--lux-font-folio); letter-spacing: var(--lux-tracking-folio); text-transform: uppercase; color: var(--lux-gold); }
  @media (max-width: 1023.98px) { .lux-folio { position: static; display: block; margin-bottom: .75rem; } }

  /* Cover: its own rails + 12 columns; text never overlays the photo */
  .lux-cover { display: grid; gap: var(--lux-space-block); padding-top: calc(var(--lux-nav-h-current) + var(--lux-space-cover)); }
  .lux-cover__text { display: grid; gap: 1lh; align-content: center; }
  .lux-cover__media { aspect-ratio: 4 / 5; }
  @media (min-width: 1024px) {
    .lux-cover { grid-template-columns: [full-start] minmax(var(--lux-gutter), 1fr) [content-start] repeat(12, minmax(0, 1fr)) [content-end] minmax(var(--lux-gutter), 1fr) [full-end]; column-gap: var(--lux-grid-gap); min-height: 72svh; }
    .lux-cover__text { grid-column: content-start / span 6; }
    .lux-cover__media { grid-column: 7 / full-end; min-height: 72svh; }
  }

  /* Services index: rows left, sticky frame right, :has() swap */
  .lux-index { display: grid; gap: var(--lux-grid-gap); }
  .lux-index__row { container-type: inline-size; border-top: 1px solid var(--lux-border); }
  .lux-index__row > a { display: grid; grid-template-columns: 2.5rem 2rem 1fr auto; gap: 1rem; align-items: baseline; min-height: 56px; padding-block: 1.1rem; color: inherit; text-decoration: none; }
  @container (min-width: 40cqi) { .lux-index__row > a { grid-template-columns: 2.5rem 2rem minmax(0, 4fr) minmax(0, 4fr) auto auto; } }
  .lux-index__frame { display: none; }
  @media (min-width: 1024px) {
    .lux-index { grid-template-columns: 7fr 5fr; }
    .lux-index__frame { display: block; position: sticky; top: calc(var(--lux-nav-h) + 1.5rem); z-index: var(--lux-z-sticky); aspect-ratio: 4 / 5; overflow: hidden; box-shadow: inset 0 0 0 1px var(--lux-border-gold); }
    .lux-index__frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity var(--lux-dur-ui) var(--lux-ease); }
    .lux-index__frame img:first-child { opacity: 1; }
    .lux-index:has(.lux-index__row:is(:hover, :focus-within)) .lux-index__frame img:first-child { opacity: 0; }
    /* generated once per slug by the component: */
    .lux-index:has([data-slug="wedding-planning"]:is(:hover, :focus-within)) .lux-index__frame img[data-slug="wedding-planning"] { opacity: 1; }
  }
  @media (max-width: 1023.98px) {
    .lux-index--cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; }
    .lux-index--cards .lux-index__row { border-top: 0; }
    .lux-index--cards .lux-index__row > a { grid-template-columns: 1fr; gap: .5rem; padding: 1rem; min-height: 9.5rem; border: 1px solid var(--lux-border); border-radius: var(--lux-radius-sm); }
  }

  /* Media frame + caption beneath */
  .lux-frame { margin: 0; display: grid; }
  .lux-frame__box { position: relative; overflow: hidden; }
  .lux-frame--3-2 .lux-frame__box { aspect-ratio: 3 / 2; }   /* one modifier per ratio in §6 */
  .lux-frame--gilt .lux-frame__box { box-shadow: inset 0 0 0 1px var(--lux-border-gold); }
  .lux-frame img { width: 100%; height: 100%; object-fit: cover; }
  .lux-caption { display: flex; justify-content: space-between; gap: 1rem; padding-top: .6rem; border-top: 1px solid var(--lux-border); font: 500 var(--lux-text-small)/1.5 var(--lux-font-body); color: var(--lux-subtle); }

  /* Ledger */
  .lux-ledger__row { display: grid; grid-template-columns: 3.5rem 1fr; gap: 1rem; padding-block: 1.25rem; border-top: 1px solid var(--lux-border); }
  @media (min-width: 768px) { .lux-ledger--2 .lux-ledger__row { grid-template-columns: 3.5rem 1fr 1fr; } .lux-ledger--4 .lux-ledger__row { grid-template-columns: 3.5rem repeat(4, 1fr); } }

  /* Action bar (phones) */
  .lux-actionbar { position: fixed; inset: auto 0 0 0; z-index: var(--lux-z-actionbar); display: grid; grid-template-columns: auto auto 1fr; gap: .5rem; padding: .6rem var(--lux-gutter) calc(.6rem + env(safe-area-inset-bottom)); background: color-mix(in srgb, var(--lux-surface-1) 92%, transparent); border-top: 1px solid var(--lux-border); backdrop-filter: blur(16px); transition: translate var(--lux-dur-open) var(--lux-ease); }
  body[data-inquiry-visible="true"] .lux-actionbar, html:has(dialog[open]) .lux-actionbar { translate: 0 110%; }
  @media (min-width: 768px) { .lux-actionbar { display: none; } }
  @media (prefers-reduced-transparency: reduce) { .lux-actionbar, .lux-header.is-scrolled { backdrop-filter: none; background: var(--lux-surface-1); } }

  /* FAQ */
  .lux-faq__item { border-top: 1px solid var(--lux-border); interpolate-size: allow-keywords; }
  .lux-faq__item > summary { display: flex; justify-content: space-between; align-items: center; gap: 1rem; min-height: 44px; padding-block: 1rem; cursor: pointer; list-style: none; font: 600 var(--lux-text-h3)/var(--lux-leading-h3) var(--lux-font-display); color: var(--lux-white); }
  .lux-faq__item > summary::-webkit-details-marker { display: none; }
  .lux-faq__item > summary .lux-icon-plus { transition: rotate var(--lux-dur-ui) var(--lux-ease); }
  .lux-faq__item[open] > summary .lux-icon-plus { rotate: 45deg; }
}
```

### 6.2 Shared TypeScript contracts (`src/components/ui/types.ts`)
```ts
import type { services } from "@/data/cms";
export type ServiceSlug = (typeof services)[number]["slug"];
export type CurationId = string;                 // manifest id; MediaFrame throws at render if unknown (caught by tsc test in curation package)
export type Ratio = "3:2" | "4:5" | "3:4" | "1:1" | "21:9" | "16:10" | "4:3";
export type BreadcrumbItem = { name: string; href: string };
export type Commitment = { id: "reply" | "proposal" | "director" | "advance"; term: string; detail: string };
export type InquirySource = "home" | "contact" | "book_event" | "callback" | "service" | "footer";
export type CtaProps = { cta: string; location: string };   // every clickable primitive takes these and renders data-cta attributes
```

Shell components (in `src/brand/shell/`, rewritten; see §10 for layouts): `Header` (server shell + `HeaderIsland`), `MobileMenu` (dialog island), `ActionBar` (server), `Footer` (server).

Retired after migration (orchestrator deletes when no import remains): `brand-section.tsx`, `glass-panel.tsx`, `brand-hero.tsx`, `brand-button.tsx`, `brand-faq-accordion.tsx`, `brand-lightbox.tsx`, `src/lib/motion/*` (scroll-reveal, parallax, portal-transition, lenis), `components/stitch/*`, `hero-carousel-bg.tsx`, `brand-fab.tsx`, `providers/smooth-scroll-provider.tsx`, `providers/cinematic-provider.tsx`, `shared/page-hero.tsx`.

---

## 7. Icon system — `src/components/icons/`

**Style: "Engraved hairline."** 24×24 viewBox, 2px safe margin, single-weight stroke `var(--icon-stroke, 1.5)` (1.5 at 24, 1.75 at 20, 1.25 at 48), round caps and joins, no fills, geometry from arcs and straight lines only (compass-and-rule, matching Cormorant's engraved quality), plus **exactly one 2px solid "jewel" dot** per icon in `var(--icon-jewel)` (gold) at the focal point. Stroke is `currentColor` (white in headings, muted in rows, gold on hover — a 300ms `stroke` transition is the only animation). Server components: `<ServiceIcon name={slug} size={20|24|32|48} title? />` and `<UiIcon name size title? />`; `aria-hidden` unless `title` (then `<title>` + `role="img"`); the 48px cover variant adds a thin outer ring (`circle r=22`). `src/components/icons/index.ts` exports `SERVICE_ICONS: Record<ServiceSlug, Component>`. Lucide stays for admin/dashboard only; `DynamicIcon` is no longer used on site pages.

### 7.1 The twelve service icons
| Slug | Motif (set path) | Jewel |
|---|---|---|
| wedding-planning | two interlocking rings beneath a scalloped mandap arch line | at the rings' overlap |
| destination-weddings | palace dome silhouette on a horizon line with a small sun arc | the sun |
| corporate-events | lectern in profile on a tiered stage line, slim mic stroke | at the mic |
| celebrity-management | five-point star drawn as one open line inside a velvet-rope arc on two posts | star centre |
| birthday-events | tall tapered candle on a single cake-tier line | the flame |
| conferences | lanyard badge (rounded rectangle, loop, two text lines) | at the clip |
| fashion-shows | one-point-perspective runway (two converging lines) under a spotlight arc | vanishing point |
| concert-management | stage truss (horizontal bar, three hangers) with one beam cone | the fixture |
| exhibitions | isometric booth plan (three walls, open front) with a small flag | flag tip |
| brand-promotions | scalloped pop-up awning over a counter line with two ripple arcs | awning peak |
| product-launches | draped veil lifted from a pedestal (curved cloth line, pedestal rectangle) | the lift point |
| event-production | Fresnel lantern in profile with two beam lines | the lens |

### 7.2 UI glyphs (same stroke, 20/24px)
arrow-right (long: 14-unit shaft, small head — the CTA arrow) · arrow-up-right · plus/close (two strokes; rotates 45° for `details[open]`) · chevron-down · phone (handset outline) · whatsapp (speech bubble with a handset inside, drawn in-house; green only as `stroke` colour) · mail · map-pin · clock · calendar · menu (two 14-unit lines — the mobile Menu glyph) · external-link · check (sparingly in ledgers; jewel dots preferred) · play · social marks redrawn at 1.5px: instagram, linkedin, youtube, facebook.

### 7.3 Component skeleton (normative API)
```tsx
// src/components/icons/service-icons.tsx — server component, no "use client"
import type { ServiceSlug } from "@/components/ui/types";
export type IconProps = { size?: 20 | 24 | 32 | 48; title?: string; className?: string };
const strokeFor = (size: number) => (size >= 48 ? 1.25 : size <= 20 ? 1.75 : 1.5);

export function WeddingPlanningIcon({ size = 24, title, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth={strokeFor(size)} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={title ? undefined : true} role={title ? "img" : undefined} className={className}>
      {title ? <title>{title}</title> : null}
      {size >= 48 ? <circle cx="12" cy="12" r="11" strokeWidth="0.75" opacity="0.4" /> : null}
      <path d="M4 9c2-4 14-4 16 0" />                                            {/* mandap arch */}
      <circle cx="9.5" cy="14.5" r="3.5" /><circle cx="14.5" cy="14.5" r="3.5" /> {/* rings */}
      <circle cx="12" cy="14.5" r="1" fill="var(--icon-jewel)" stroke="none" />  {/* the one jewel */}
    </svg>
  );
}
export const SERVICE_ICONS: Record<ServiceSlug, (p: IconProps) => React.JSX.Element> = { "wedding-planning": WeddingPlanningIcon /* … 11 more */ };
export function ServiceIcon({ name, ...p }: IconProps & { name: ServiceSlug }) { const C = SERVICE_ICONS[name]; return <C {...p} />; }
// ui-icons.tsx exports UiIcon({ name: UiIconName, ...IconProps }) with the same conventions; `lux-icon-plus` class on the plus/close glyph.
```
Rules enforced in review: no `fill` other than the jewel; no `<animate>`; paths from arcs/lines only; every icon has exactly one `fill="var(--icon-jewel)"` circle of r=1.

Brand assets (icons package): wordmark lock-up SVG under `/public/brand/` (existing `nexyyra-logo-160/320.webp` stay for header/footer), favicon set unchanged, `og-default.png` 1200×630 (recipe §8.7).

---

## 8. Imagery system

### 8.1 Inventory (from `public/media-manifest.json`)
102 photos, all landscape 3:2 (6000×4000 / 8192×5464 / 6016×4016 / 6720×4480 / 5088×3392); folders hero 19 · weddings 21 · gallery 19 · venues 42 · celebrity 1; categories wedding 59 / venue 42 / celebrity 1; served from lh3.googleusercontent.com with 640/828/1200/1920 variants; `blurDataURL` empty; alts are camera filenames. **No portrait originals** — every 4:5, 3:4 and 1:1 is a CSS crop of a 3:2 frame, made safe by a curated focal point. No photography exists for conferences, fashion shows, concerts, exhibitions, brand promotions, product launches (and celebrity beyond one frame).

### 8.2 Curation file — `src/brand/data/image-curation.ts` (curation package)
```ts
export type CurationAsset = {
  id: string;                       // manifest id, e.g. "hero-4F1A8526"
  roles: CurationRole[];            // see 8.3
  focal: { x: number; y: number };  // 0–1 → object-position
  cropSafe: ("4:5" | "3:4" | "1:1")[];
  people: "none" | "distant" | "close";   // close faces: gallery + lightbox only
  busy: boolean;                    // high-detail frame — never beside small text
  span: "wide" | "standard" | "tall";     // gallery grid
  service: ServiceSlug[];           // which service pages may use it
  city?: string;                    // only if the owner confirmed it
  alt: string;                      // descriptive, what is in frame
  caption: string;                  // "Floral mandap at dusk · Wedding décor"
  local?: string;                   // "/images/covers/cover-services" when exported
};
export const IMAGE_CURATION: CurationAsset[];
export function assetsByRole(role: CurationRole): CurationAsset[];
export const NEEDS_REAL_PHOTOGRAPHY: ServiceSlug[]; // surfaced in the final report for the owner
```
Rules: every photo gets a descriptive alt and caption written from what is visible ("Candle-lit table setting with gold chargers, evening reception"), never promotional, never naming a client, guest, venue or city unless `city` is owner-confirmed. A photo may hold several roles, but **no photo appears twice on one page** (page packages check ids). The single celebrity frame is held back until the owner confirms consent.

### 8.3 Roles, ratios and delivery
| Role | Used by | Ratio | Source | Notes |
|---|---|---|---|---|
| `cover-home` | `/` Cover | 4:5 crop (desktop right half and phone) | **local** `/images/covers/cover-home-{1920,1280,768}.webp` (re-export of `public/images/hero/hero-poster.webp`) | LCP; `priority`; `sizes="(min-width:1024px) 50vw, 100vw"` |
| `cover-services`, `cover-about`, `cover-portfolio`, `cover-why` | page covers | 4:5 crop | **local** `/images/covers/{role}-{1920,1280,768}.webp` | LCP per page; no faces (`people: none\|distant`) |
| `service-cover-{slug}` ×12 | `/services/[slug]` Cover | 4:5 crop | **local** `/images/covers/service-{slug}-…webp` | venue/décor-led frame matched to the service; the 7 services without real photography use a staging/lighting/venue frame whose alt says exactly what it shows and whose page copy never implies the service is pictured |
| `index-frame-{slug}` ×12 | `ServicesIndex` sticky frame | 4:5 crop | Drive 828 variant, lazy | same asset as `service-cover-{slug}` so the morph and the mental model match |
| `spread-home`, `spread-services`, `spread-about`, `spread-why` | `Spread` | 21:9 ≥ 1024 / 3:2 | Drive 1920 | `sizes="100vw"`, lazy |
| `diptych-home-l/r`, `case-{id}-l/r` ×3 | `Diptych` | 3:4 / 4:5 | Drive 1200 | `(min-width:768px) 50vw, 100vw` |
| `house-portrait` | `/` chapter About, `/about` | 4:5 offset frame | Drive 1200 | `cropSafe` must include 4:5 |
| `concept-{id}` ×3 | `ConceptCard`, case cover | 3:2 | Drive 1200 (card) / local export for case covers | category-matched real photo; ConceptTag always visible |
| `editorial-band` (pool of 10) | locations, local-SEO, book-event, contact (below fold) | 3:2 | Drive 1200, lazy | shared pool so 19 pages don't show one photo |
| `blog-lead-{category}` | `/blog`, `/blog/[slug]` | 3:2 lead figure | Drive 1200, lazy on index; `priority` **not** used (text-only cover above) | replaces `EVENT_IMAGES` mapping |
| `gallery-*` (all 102) | `/gallery`, `/portfolio` archive, service galleries | 3:2 / tall 3:4 | Drive 640/828 | `sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"`; lightbox 1920 |
| `thumb` | index hover thumbs (desktop related rows) | 4:3 | Drive 640 | `sizes="320px"` |

Delivery rules: local WebP for every above-the-fold cover (`cover-*`, `service-cover-*` = 17 frames × 3 widths, exported by the curation package with `scripts/export-covers.mjs` using sharp); if an export slips, the page falls back to `cover-home` — **never a Drive URL with `priority`**. All other photos go through `BrandImage` with the manifest variants, never wider than 1920, always with `sizes`, lazy below the fold, `decoding="async"`. Blur placeholders generated by `npm run optimize-placeholders` into the curation file (`blur` field) — until then `BRAND_BLUR`.

### 8.4 Treatment
Photographs are shown straight: **no desaturation, no duotone, no tint, no blur, no grain, no vignette.** Harmony with navy comes from composition (curation picks frames with deep shadows or warm-on-dark palettes for covers), the navy caption bar and the optional 1px gold "gilt frame" inset (`MediaFrame frame`), used on covers, the sticky index frame and diptychs — not on gallery tiles. Radius 0 on spreads/covers/tiles, `--lux-radius-xs` on inline thumbs. Hover (hover-capable only): `scale(1.03)` over `--lux-dur-image`; never brightness changes.

### 8.5 Overlay recipe
Only one: the lightbox counter sits in a glass `Card` over `--lux-scrim` in the bottom 20% of the dialog image. Nothing else overlays a photo; captions live in the `.lux-caption` bar beneath, pattern "What is in frame · Category" left, "No. 034" right.

### 8.6 Hero poster treatment
`cover-home` is the existing local poster (keeps the current LCP win). Re-exported true-colour at 1920/1280/768 WebP (q 78) + a 24px blur. Rendered by `Cover` at 4:5 via `object-position` from `focal`; `priority` + `fetchpriority="high"`; preload emitted by next/image. No carousel, no slides, no Ken Burns.

### 8.7 OG image recipe
`src/app/opengraph-image.tsx` (default) and `src/app/services/[slug]/opengraph-image.tsx`, `src/app/blog/[slug]/opengraph-image.tsx` via `ImageResponse` (1200×630): navy `#050816` field; left 60%: wordmark (SVG), eyebrow in Manrope gold caps, title in Cormorant 500 at 72px white (max 2 lines), a 1px gold rule, entity line "Nexyyra Events · Pune" in Manrope 20px muted; right 40%: the page's cover photo (local file) at 3:2 with a 1px gold inset frame. Fonts loaded from `/public/fonts/*.ttf` subset copies (Cormorant 500, Manrope 400/700) — no runtime Google fetch. Static `og-default.png` is the fallback in `generateSEO`.

---

### 8.8 Caption and alt-text patterns
| Frame type | Alt (what is in frame) | Caption bar (left · right) | Never |
|---|---|---|---|
| Ceremony décor | "Floral mandap with marigold strands and hanging lanterns, evening ceremony" | "Floral mandap at dusk · Wedding décor" · "No. 012" | "luxury wedding by Pune's leading planner"; couple or family names |
| Reception / table | "Candle-lit long table with gold chargers and white florals" | "Candle-lit table setting · Reception" | the venue's name |
| Venue walkthrough | "Hotel ballroom with crystal chandeliers set for a seated dinner" | "Ballroom set for dinner · Venue" | hotel name or city unless `city` is owner-confirmed |
| Stage / lighting (covers for the 7 services without photography) | "Stage truss with warm wash lighting at an evening reception" | "Stage lighting at a reception · Production" | any wording implying a concert, runway or exhibition took place |
| Guests (gallery + lightbox only, `people: close`) | "Guests on a dance floor under string lights" | "Sangeet night · Wedding" | use as a cover, spread or index frame |
| Concept card (real photo under a Concept) | alt describes the photo, not the concept: "Palace courtyard lit for an evening function" | "Illustrative concept · Destination wedding" | treating the photo as evidence of the concept |

### 8.9 Export script (`scripts/export-covers.mjs`, curation package)
Reads every `IMAGE_CURATION` entry carrying a `cover-*` or `service-cover-*` role, fetches the 1920 Drive variant once into `.cache/media/`, writes `/public/images/covers/{role}-{1920,1280,768}.webp` with sharp (quality 78, effort 5, no sharpening, no colour or saturation change), sets `local` on the entry and writes a 24px-wide base64 `blur`. Idempotent; `--force` re-exports. The home poster is copied from `public/images/hero/hero-poster.webp`. Output budget: ≤ 90 KB at 768w, ≤ 220 KB at 1920w; the script fails the run if a file exceeds it.

---

## 9. Motion system

**Principle:** the page is a printed object the reader scrolls through. Motion is scroll-linked, short and transform/opacity-only; nothing autoplays, loops or drives via JavaScript. framer-motion, GSAP and Lenis are imported by no V6 file; `html.smooth-scroll` and `data-scroll-behavior` go.

**Durations / easings:** UI 160–240ms, open/close 280ms, shared-element morph 320ms, image hover 900ms; `--lux-ease` for entrances, `--lux-ease-exit` for exits, `linear` for scroll timelines.

### 9.1 Scroll-driven (CSS only, inside `@supports (animation-timeline: view())`)
```css
@keyframes lux-rise { from { opacity: 0; translate: 0 var(--lux-reveal-rise) } to { opacity: 1; translate: 0 0 } }
@keyframes lux-settle { from { scale: 1.06 } to { scale: 1 } }
@property --lux-rule { syntax: "<percentage>"; inherits: false; initial-value: 0%; }
@keyframes lux-draw { to { --lux-rule: 100% } }
@supports (animation-timeline: view()) {
  .lux-reveal { animation: lux-rise linear both; animation-timeline: view(); animation-range: entry 0% entry 35%; }
  .lux-reveal[style*="--i"] { animation-range: entry calc(var(--i) * 4%) entry calc(35% + var(--i) * 4%); } /* per-row ranges keep stagger scroll-linked */
  .lux-spread img, .lux-cover__media img { animation: lux-settle linear both; animation-timeline: view(); animation-range: cover 0% cover 100%; }
  .lux-section__head::after { background: linear-gradient(90deg, var(--lux-gold) var(--lux-rule), transparent 0); animation: lux-draw linear both; animation-timeline: view(); animation-range: entry 0% entry 40%; }
  .lux-process::before { animation: lux-draw-y linear both; animation-timeline: view(); animation-range: entry 20% exit 80%; }
}
```
Without support everything renders in its final state (no IntersectionObserver polyfill). `.lux-reveal` is applied to chapter heads, ledger rows, index rows and concept cards; never to page wrappers.

### 9.2 Hover and state (only under `@media (hover: hover)`)
Link underline draws via `background-size` 240ms; index-row arrow translates 6px; photos `scale(1.03)` 900ms; buttons keep the existing shine sweep (`@property --lux-shine`) + translateY(−2px); `:active` scale .98 120ms. No magnetic buttons, no spotlight borders.

### 9.3 Open/close
`<dialog>` (mobile menu, lightbox) and `[popover]` (desktop services panel) enter via `@starting-style` + `transition-behavior: allow-discrete` (opacity + 12px rise, 280ms); the mobile menu rises from the bottom (`translate: 0 100%` → 0). `<details>` content animates height with `interpolate-size: allow-keywords` where supported, instant elsewhere. Header gains its `--lux-surface-1` background + hairline + `backdrop-filter` over 240ms when `.is-scrolled` (class toggled by one passive scroll listener — no height animation). The action bar slides up once after the cover (`@starting-style`).

### 9.4 View Transitions (React `<ViewTransition>`, `experimental.viewTransition: true` set by the technical package)
Shared-element morphs (320ms, `::view-transition-group(.lux-morph)`): gallery tile → lightbox image (`photo-{id}`), concept card → case cover (`concept-{id}`), services index title → service H1 (`service-title-{slug}`). `layout.tsx` wraps `{children}` in `<ViewTransition default="lux-crossfade">` = 200ms root crossfade; no slides, no curtains, no transform on page wrappers (fixed header/action bar keep working). Names are unique per page (one `photo-{id}` per tile).

### 9.5 Reduced-motion matrix
| Trigger | Default | `prefers-reduced-motion: reduce` | `prefers-reduced-data: reduce` / Save-Data | `prefers-reduced-transparency` |
|---|---|---|---|---|
| `.lux-reveal`, rule draw, process line | scroll-driven | `animation: none` (final state) | unchanged | unchanged |
| cover/spread photo settle | scroll-driven scale | none | unchanged | unchanged |
| hover photo scale, arrow, underline | transitions | opacity-only ≤ 150ms | unchanged | unchanged |
| dialog/popover/menu | 280ms starting-style | instant | unchanged | `backdrop-filter: none`, solid `--lux-surface-2` |
| `<details>` height | interpolate-size | instant | unchanged | unchanged |
| View Transitions | 320/200ms | `::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none }` | unchanged | unchanged |
| header glass | 240ms fade | instant | unchanged | solid surface, no blur |
| skeleton pulse | 1.4s while loading | none | none | unchanged |
| Speculation Rules prerender | moderate | unchanged | **off** | unchanged |
| `html { scroll-behavior }` | smooth for in-page links | auto | unchanged | unchanged |

The existing global `prefers-reduced-motion` duration collapse in `luxury-redesign.css` stays.

---

## 10. Page blueprints

Conventions: every page = `<div class="lux-page">` → `Cover` → numbered `Section`s → `InquiryPanel` → (FAQ) → footer. One `<h1>` per page, heading order enforced, every `Section` `aria-labelledby`. Every inner route renders `Breadcrumbs` (with schema) at the top of its cover. Primary CTA label everywhere: **Get a Free Proposal**. Chapter eyebrows are plain words. Each chapter carries one warm photographic moment or gold typographic furniture. JSON-LD is emitted only for content rendered. "Data" column names the source file.

### 10.0 Shell
**Header (desktop ≥ 1024, `src/brand/shell/brand-header.tsx` server + `HeaderIsland` client ~40 lines):** 68px bar: wordmark left (160/320 webp), nav centre (`NAV_LINKS`: Home · About · Services · Portfolio · Pricing · Blog · Contact, Manrope 600 0.82rem, `aria-current="page"` → gold underline drawn via `background-size`), phone link + `Button variant="primary" size="compact"` "Get a Free Proposal" (→ `/book-event`) right. Transparent over the home cover; `.is-scrolled` after 24px (passive listener in the island) → `--lux-surface-1` at .92 + hairline + `backdrop-filter: blur(16px)` (one of the three glass sites). **Services** is a `<button popovertarget="services-panel">`; the panel is `<div id="services-panel" popover>` rendered as a **full-width fixed panel under the nav** (`position: fixed; inset: var(--lux-nav-h) 0 auto 0; margin: 0`) — never `position: absolute` under the trigger (top-layer elements ignore ancestor containing blocks; CSS anchor positioning is deliberately not used). Contents: the 12 services in three hairline-ruled columns with `ServiceIcon` 20 + title + `From ₹`, plus `MEGA_EXPLORE_LINKS` (Portfolio · Gallery · Pricing · Why Nexyyra (→ `/why-nexyyra`) · FAQs) as plain `<ul>`/`<a>` (no `role="menu"`), and one 4:5 `MediaFrame` (`cover-services`, lazy). Light-dismiss/ESC native; `HeaderIsland` adds hover-intent open (120ms, `hover:hover` only), close on route change, and a Safari 16.4 fallback (`"togglePopover" in HTMLElement.prototype` else toggle `hidden` + outside-click/ESC). Hidden on `/dashboard`, `/admin`, `/login`, `/register` as today. `safe-top` padding.
**Header (mobile < 1024, `mobile-navbar.tsx` server):** 64px bar: wordmark (40px) left, "Call" glyph link (`data-cta="call_header"`) and a 44px "Menu" text button with the two-line glyph right. Opens `MobileMenu`.
**MobileMenu (`mobile-menu.tsx`, dialog island ~60 lines):** native `<dialog closedby="any">` (`showModal()`; browser focus trap, inert background), full-screen `--lux-surface-2` sheet rising from the bottom (280ms); numbered oversized Cormorant links 01 Home … 07 Contact (numerals in gold Cormorant, not Cinzel), Services as `<details name="menu">` with the 12 icon rows, then contact lines (phone, WhatsApp, email) and the primary `Button size="full"`. Closes on route change; `html:has(dialog[open]) { overflow: hidden }`. Replaces the framer-motion portal drawer and its focus trap.
**ActionBar (`brand-action-bar.tsx`, server, replaces `brand-fab.tsx`):** phones < 768: `position: fixed; bottom: 0; height: var(--lux-actionbar-h); padding-bottom: env(safe-area-inset-bottom)`; `--lux-surface-1` + top hairline + `backdrop-filter` (glass site 2 of 3; solid under reduced-transparency); **three labelled buttons ≥ 44px, labels `--lux-text-small`:** WhatsApp (ghost, green stroke icon, `getWhatsAppUrl`), Call (ghost), **Get a Free Proposal** (purple, `flex-grow`). On service pages the purple label reads "Proposal · From ₹8 L" (from `basePrice`). Target: the page's `InquiryPanel` anchor when present (`#plan`, `#inquire`), else `/book-event`. Hidden while `body[data-inquiry-visible="true"]` or `html:has(dialog[open])` (`translate: 0 100%`). `main { padding-bottom: calc(var(--lux-actionbar-h) + env(safe-area-inset-bottom)) }` on phones. Desktop ≥ 768: a quiet corner stack of WhatsApp + Call only. All buttons carry `data-cta` (`action_whatsapp`, `action_call`, `action_proposal`). The cookie consent sheet sits at `bottom: calc(var(--lux-actionbar-h) + env(safe-area-inset-bottom))` on phones (never stacked under the bar) with Accept and Decline at equal weight.
**Footer (`brand-footer.tsx`, server — no client JS):** colophon on a hairline: legal name, CIN, registered address, "Delivery & Coordination Office — Pune", phone/WhatsApp/email, languages, service areas as a prose line; then link groups (Quick links · Services (12) · Locations (13) · Guides) as `<details name="footer">` on phones wrapped in `DetailsOpenAtDesktop` (open columns ≥ 1024); social links as text + glyph only for profiles the owner confirms exist; legal row (`FOOTER_LEGAL`) + "Company information" (`/company`) + HTML sitemap; year server-rendered. `prefetch={false}` on every discovery link (100+). No newsletter, no claims, no tagline beyond the one approved line.
**Loading states (revised after review):** there are **no** `loading.tsx` files. Every route is static or SSG, so a Suspense skeleton only hid the prerendered content behind an inline script (bad for LCP and no-JS visitors) and turned `notFound()` into HTTP-200 soft 404s. Navigation keeps the current page until the next one is ready. Do not reintroduce `loading.tsx` on a static route.

### 10.1 `/` (Home) — `src/brand/views/home-view.tsx` (server; `home-below-fold.tsx` merged in)
| # | Section | Purpose | Data | Primitives | Mobile |
|---|---|---|---|---|---|
| 0 | Cover `size="xl"` | the offer: eyebrow "Nexyyra Events · Pune"; H1 "Luxury weddings and corporate events, planned *end-to-end*" (accent "end-to-end"); lead (Pune to destinations across India, one accountable team); primary → `#plan`; text link "WhatsApp a planner"; `Commitments variant="cover"`; entity line (legal name · Pune) | `SITE_CONFIG`, `BRAND_COMMITMENTS` | Cover, Commitments, Button | H1 + lead + CTA + 3 commitments in the first screen, 4:5 photo below |
| 1 | Section 01 "Services" | all 12 services with price | `services` (cms), `BRAND_SERVICE_CATEGORIES` narratives | ServicesIndex `frame="groups"` (3 lazy frame images), text link "All services" | 2-up icon-and-price cards |
| 2 | Spread | warm photographic moment | `spread-home` | Spread + caption | 3:2 |
| 3 | Section 02 "About" | what the house is: incorporated 2026, in-house design + production, languages, cities | `companyProfile` (cms), `ENTITY_FACTS` | the page's one Deck, Prose `dropcap` in cols 1–6, `MediaFrame` 4:5 `house-portrait` cols 8–12 offset, link "About the house" | photo after the copy |
| 4 | Section 03 "How we work" | the five-step method | `BRAND_PROCESS_STEPS` | ProcessLine `full` | line left |
| 5 | Diptych | venue interior + table detail | `diptych-home-l/r` | Diptych + captions | stacked 4:5 |
| 6 | Section 04 "Concepts" | three illustrative concepts | `BRAND_CASE_STUDIES` | ConceptBanner + 3 ConceptCards (row of three ≥ 1024) → `/portfolio` | Strand (snap) |
| 7 | Section 05 "Commitments" | trust block + one price line "Collections from ₹10 Lakhs · Single services from ₹2 Lakhs" → `/pricing` | `BRAND_COMMITMENTS`, `BRAND_INVESTMENTS`, `services` | Commitments `grid`, Prose | 2×2 |
| 8 | InquiryPanel `id="plan"` | lead capture | — | InquiryPanel `source="home" variant="compact"` | contacts as 3-button row |
| 9 | Section 06 "Questions" | 6 FAQs + "All questions" link | `HOME_FAQ_ITEMS` | Accordion `name="home-faq" schema` | — |
Removed: hero carousel, aurora, `ai-planner.tsx`, `featured-work.tsx`, `services-explorer.tsx`, counters/testimonials remnants. The home ships ≤ 180 KB gzipped JS (§11).

### 10.2 `/services` — `services-view.tsx`
| # | Section | Purpose | Data | Primitives | Mobile |
|---|---|---|---|---|---|
| 0 | Cover (`cover-services`, breadcrumbs Home · Services) | eyebrow "Services"; H1 "Twelve ways to celebrate, one accountable team"; lead; primary → `/book-event` | curation, `SITE_CONFIG` | Cover, Breadcrumbs | offer first, 4:5 photo below |
| 1 | Section 01 "The index" | all 12 services grouped Celebrations / Corporate & brand / Production & talent, each with narrative + From ₹ | `services` (cms), `BRAND_SERVICE_CATEGORIES` | ServicesIndex `grouped frame="all"` (12 lazy frame images ≤ 828px, one opaque) | icon-and-price cards, one `editorial-band` spread between groups |
| 2 | Spread | photographic moment | `spread-services` | Spread + caption | 3:2 |
| 3 | Section 02 "How we work" | the method, condensed | `BRAND_PROCESS_STEPS` | ProcessLine `compact columns=2` | single column |
| 4 | Section 03 "Investment" | three collections in one line each → `/pricing` | `BRAND_INVESTMENTS` | Ledger `as="dl"` (name · from · guest band) | stacked |
| 5 | InquiryPanel | lead capture | — | InquiryPanel `source="service" variant="compact"` (no `defaultEventType`) | contacts row above form |
| 6 | Section "Questions" | 3 service FAQs → `/faqs` | `GLITZ_FAQS` (category Services) | Accordion `name="services-faq" schema` | — |

### 10.3 `/services/[slug]` — `templates/service-chapter.tsx` (server)
| # | Section | Purpose | Data | Primitives | Mobile |
|---|---|---|---|---|---|
| 0 | Cover (`service-cover-{slug}` local; breadcrumbs Home · Services · {title}) | folio "{index} / 12"; `ServiceIcon` 48 with ring; H1 = `service.title` in `<ViewTransition name="service-title-{slug}">`; lead = `service.description`; price line "From ₹{basePrice}"; primary → `#inquire` | `services` (cms), curation | Cover `folio icon priceLine viewTransitionName`, Breadcrumbs | H1, price, CTA in first screen |
| 1 | Section 01 "The brief" | what this engagement is; "What to expect" commitments beside it | `getServicePageIntro(slug)` (`wedding-internal-links.ts`), `BRAND_COMMITMENTS` | Prose `dropcap` cols 1–7; Commitments `grid` cols 9–12 offset | commitments after copy |
| 2 | Section 02 "What's included" | the four `features` as a two-column hairline list with jewel dots | `service.features` | Ledger `as="dl" columns=2` | single column |
| 3 | Section 03 "How we deliver" | the method with the drawing line | `BRAND_PROCESS_STEPS` | ProcessLine `compact` cols 1–7 | line left |
| 4 | Gallery strand | only real photographs for this service (3–6) | `getServiceMediaFromManifest(slug)` ∩ curation `service[]` | Strand of MediaFrame → Lightbox | swipe; **section omitted** when no assets (never a repeated cover) |
| 5 | Section 04 "Questions" | service FAQs | `getServiceFaqs(slug)` | Accordion `name="service-faq" schema` | — |
| 6 | Section "Related" | 3 related services + contextual links | `services`, `getServiceContextualLinks(slug)` | ServicesIndex `variant="related" frame="none"`, small-type links | cards |
| 7 | InquiryPanel `id="inquire"` | lead capture pre-filled | `SERVICE_EVENT_TYPE[slug]` (`src/lib/inquiry.ts`) | InquiryPanel `source="service" variant="compact" defaultEventType priceLine` | action bar label "Proposal · From ₹…" |
Services in `NEEDS_REAL_PHOTOGRAPHY` get the honest venue/staging cover, no gallery, and copy that never implies the service is pictured.

### 10.4 `/portfolio` — `portfolio-view.tsx`
| # | Section | Purpose | Data | Primitives | Mobile |
|---|---|---|---|---|---|
| 0 | Cover (`cover-portfolio`, breadcrumbs) | eyebrow "Portfolio"; H1 "Concepts and the archive"; lead stating plainly that the three studies are illustrative concepts and the archive is real photography from Nexyyra productions (no "Our Films") | curation | Cover, Breadcrumbs | offer first |
| 1 | ConceptBanner | the standing honesty line | fixed copy (Appendix) | ConceptBanner | — |
| 2 | Section 01 "Concepts" | three concept spreads: 3:2 photo cols 1–7 in `<ViewTransition name="concept-{id}">`, text cols 8–12 (ConceptTag, category, title, story, specs) → `/portfolio/[id]` | `BRAND_CASE_STUDIES` (venue **type** only) | MediaFrame, ConceptTag, Ledger `as="dl"` | photo then text, stacked |
| 3 | Section 02 "The archive" (hairline + heading = visible divider from concepts) | real photography, filterable in place | `assetsByRole("gallery")`, manifest categories present (All · Weddings · Venues) | TabsRadio (`:has()` filter, no JS), Gallery, Lightbox | 2-col tiles |
| 4 | InquiryPanel | references on request | — | InquiryPanel `source="contact" variant="compact"` lead "Ask for references from recent productions at your consultation" | — |

### 10.5 `/portfolio/[slug]` — case page (server)
Cover (local concept cover, breadcrumbs): `ConceptTag` before the eyebrow, H1 = title, lead = story, image in `<ViewTransition name="concept-{id}">`; desktop split. · Specs `Ledger as="dl"`: venue type, guests, days, budget band, category (never the invented venue name). · Section 01 "The brief" (story) · 02 "The challenge" · 03 "The approach" (solution) · 04 "What this shows" (result) — each a measure column with folio numerals; the page's single Deck between 02 and 03. · `Diptych case-{id}-l/r`. · Section "Other concepts": the other two `ConceptCard`s. · InquiryPanel `source="book_event" variant="compact" defaultEventType` by category (Wedding → WEDDING, Corporate → CORPORATE, Destination → DESTINATION_WEDDING).

### 10.6 `/gallery` — `gallery-view.tsx`
Cover `size="text"`: eyebrow "Gallery", H1 "The archive", lead "Photographs from Nexyyra productions and venue walkthroughs". · `Tabs` (server links `?f=weddings|venues|all`) with counts "N photographs". · `Gallery` (page size 24, `Pagination` `?page=`) with `content-visibility`; `Lightbox` with `photo-{id}` morph. · InquiryPanel compact `source="contact"`. Data: `public/media-manifest.json` via `src/lib/media/query-readonly.ts` + curation spans.

### 10.7 `/about` — `about-view.tsx`
| # | Section | Purpose | Data | Primitives | Mobile |
|---|---|---|---|---|---|
| 0 | Cover (`cover-about`, no faces; breadcrumbs) | eyebrow "About"; H1 "A house built for the next era of celebrations"; lead = `companyProfile.introduction` rewritten to facts | `companyProfile` (cms) | Cover, Breadcrumbs | offer first |
| 1 | Section 01 "The house" | the page's one Deck + two-column essay with drop cap: incorporated 2026 as Nexyyra Events and Promotions Private Limited, what it does, in-house design + production, languages | `SITE_CONFIG`, `ENTITY_FACTS` | Deck, Prose `dropcap`, `.lux-grid--ruled` | single column |
| 2 | Section 02 "Vision, mission, philosophy" | three ruled columns, Cormorant H3 + Manrope | `companyProfile` | `.lux-grid--ruled`, Heading h3, Prose | stacked with hairlines |
| 3 | Spread | photographic moment | `spread-about` | Spread + caption | 3:2 |
| 4 | Section 03 "How we work" | the method | `BRAND_PROCESS_STEPS` | ProcessLine | line left |
| 5 | Section 04 "Where we work" | typographic list of 13 cities → `/locations/[city]`, pan-India, international | `LOCATION_PAGES`, `ENTITY_FACTS.serviceAreas` | Ledger `as="dl" columns=4` of links | 2 columns |
| 6 | Section 05 "The people" | **only** if `src/data/team.ts` names are verified against the MCA filing: text ledger (name · role), no photos; otherwise omitted and `team.ts` deleted | `team.ts` (verified) | Ledger | — |
| 7 | Commitments + CTA | trust block, text link → `/book-event` | `BRAND_COMMITMENTS` | Commitments `grid`, Button `variant="text"` | 2×2 |
Removed: the founder story ("began as an intimate wedding studio"), "NDA-bound", "museum standards", stock team photos.

### 10.8 `/company` — `app/company/page.tsx`
Cover `size="text"`: eyebrow "Company information", H1 "Nexyyra Events and Promotions Private Limited", lead "Registered facts about the company". · Facts `Ledger as="dl"`: legal name, trade name, CIN, incorporated 2026, registered address (Telhara), Delivery & Coordination Office — Pune, phone/WhatsApp, email, website, languages, service areas, payment methods (Razorpay / bank transfer / UPI), booking terms (30% advance, milestones). · Section "Policies": `Commitments grid expanded`. · Links row: Privacy · Terms · Refund · Contact. Data: `SITE_CONFIG`, `ENTITY_FACTS`, `BRAND_COMMITMENTS`.

### 10.9 `/pricing` — `pricing-view.tsx`
| # | Section | Purpose | Data | Primitives | Mobile |
|---|---|---|---|---|---|
| 0 | Cover `size="text"` (breadcrumbs) | eyebrow "Investment"; H1 "Published starting prices, itemised proposals"; lead "One price story: three collections, single services quoted from their starting price" | — | Cover, Breadcrumbs | — |
| 1 | Section 01 "Collections" | the three collections as a comparison table; ticks only from `includes`; featured column = gold top rule; **no retainer toggle, no "₹30 Lakhs/yr", no badge**; per-column `Button` → `/book-event?collection=slug` | `BRAND_INVESTMENTS` | PriceTable | stacked cards < 640 (container query) |
| 2 | Section 02 "Single services" | 12-row ledger: icon · service · From ₹basePrice · link | `services` (cms) | PriceTable `services` | single column |
| 3 | Section 03 "How billing works" | consultation → itemised proposal in 48h → 30% advance, milestones via Razorpay / bank transfer / UPI | `BRAND_COMMITMENTS` | Ledger `as="ol" numerals` | — |
| 4 | "Which collection fits" | guests + event type → recommended collection and budget band; **no invented add-on prices** (`ADDITIONAL_SERVICES` removed from the calculator) | `BUDGET_RANGES`, `BRAND_INVESTMENTS`, `EVENT_TYPES` | `InlineBudgetCalculator` (existing island, ledger-styled inputs) | full width |
| 5 | Section "Questions" | Packages + Payment FAQs | `GLITZ_FAQS` | Accordion `name="pricing-faq" schema` | — |
| 6 | InquiryPanel | lead capture | — | InquiryPanel `source="book_event" variant="compact"` | — |

### 10.10 `/faqs` — `faqs-view.tsx`
Cover `size="text"`: eyebrow "Questions", H1 "Before you inquire", lead. · `OnThisPage` (groups = `GLITZ_FAQS` categories: Getting started · Packages · Payment · Services · Trust & privacy · Planning) sticky cols 1–3, `<details>` on phones. · One `Accordion name="faq-{category}" schema` per group in cols 4–12 (FAQPage JSON-LD mirrors exactly the rendered items). · InquiryPanel compact `source="contact"`.

### 10.11 `/why-nexyyra` (new route; `/testimonials` → 308 via `redirects()` in `next.config.ts`; nav label in `MEGA_EXPLORE_LINKS` updated; sitemaps updated) — `why-view.tsx` (replaces `testimonials-view.tsx`)
Cover (`cover-why`, breadcrumbs): eyebrow "Why Nexyyra", H1 "What working with us is like", lead stating plainly the page describes commitments and process, not reviews. · Section 01 "Our commitments": `Commitments grid expanded` (a sentence each). · Section 02 "One accountable team": essay with drop cap — in-house design + production, one event director, itemised proposals, no hidden fees. · Section 03 "How we work": `ProcessLine`. · Spread `spread-why`. · Section 04 "What we don't do": short ruled list rendered **only** from policy statements the owner approves in writing (e.g. no hidden fees; no payment before a conversation). · "References": line "Ask for references from recent events during your consultation" + InquiryPanel `source="contact" variant="compact"`.

### 10.12 `/contact` — `contact-view.tsx`
| # | Section | Purpose | Data | Primitives | Mobile |
|---|---|---|---|---|---|
| 0 | Cover `size="text"` (breadcrumbs) | eyebrow "Contact"; H1 "Talk to a planner"; lead "Same-day reply, 9am–9pm IST" | — | Cover | — |
| 1 | Contact ledger (cols 1–5) | phone, WhatsApp, email, registered office (Telhara), "Delivery & Coordination Office — Pune" (no street), hours, languages, service areas as a prose line | `SITE_CONFIG`, `ENTITY_FACTS` | Ledger `as="dl"`, links with `data-cta` | **after** the form |
| 2 | InquiryPanel (cols 6–12) | the full form | — | InquiryPanel `source="contact" variant="full" contacts={false}` | first on phones |
| 3 | Commitments | trust block | `BRAND_COMMITMENTS` | Commitments `row` | 2×2 |
| 4 | Editorial band (below fold) | one warm photographic moment | `editorial-band` pool | MediaFrame 3:2 + caption, lazy | 3:2 |
**The Google Maps iframe is removed** (no published Pune address). No "At a glance" duplicate block. `contactPageSchema` unchanged.

### 10.13 `/book-event` — `book-view.tsx`
| # | Section | Purpose | Data | Primitives | Mobile |
|---|---|---|---|---|---|
| 0 | Cover `size="text"` (breadcrumbs) | eyebrow "Free consultation"; H1 "Tell us about your event"; lead (same-day reply → consultation → itemised proposal in 48h) | — | Cover | — |
| 1 | InquiryPanel (cols 1–7) | the full form; `?service=` pre-selects the event type; `?collection=` shown as a read-only note above the form | `SERVICE_EVENT_TYPE`, `BRAND_INVESTMENTS` | InquiryPanel `source="book_event" variant="full" defaultEventType` | first |
| 2 | "What happens next" (cols 8–12, sticky ≥ 1024) | three steps: same-day reply · free consultation · itemised proposal in 48 hours | `BRAND_COMMITMENTS` | Ledger `as="ol" numerals` | after the form |
| 3 | Commitments + WhatsApp | trust block and "Prefer WhatsApp?" text link | `BRAND_COMMITMENTS`, `getWhatsAppUrl` | Commitments `grid`, Button `variant="text"` | 2×2 |
The budget estimator is not repeated here.

### 10.14 `/blog` — `blog-view.tsx`
| # | Section | Purpose | Data | Primitives | Mobile |
|---|---|---|---|---|---|
| 0 | Cover `size="text"` (breadcrumbs) | eyebrow "Journal"; H1 "Planning notes"; lead | — | Cover | — |
| 1 | Category tabs | crawlable filter `?c=` | categories from `blogPosts` (cms) | Tabs | horizontal scroll row (not sticky) |
| 2 | Featured post | split row: 3:2 lead figure cols 1–7, category/title/excerpt/date/read time cols 8–12 | `blogPosts[0]`, `blog-lead-{category}` | MediaFrame, Heading h2, `.lux-small` meta | stacked |
| 3 | Post index | rows: date + category folio, Cormorant title, excerpt, 4:3 thumb on hover ≥ 1024 | `blogPosts` | `.lux-index--posts` rows, Pagination (12 per page, `?page=`) | rows without thumbs |
| 4 | InquiryPanel | lead capture | — | InquiryPanel `source="contact" variant="compact"` | — |
**"Editorial pipeline" removed; `blog-topics.ts` unpublished briefs are not rendered.** Author shown as "Nexyyra Events" unless a real staff member is confirmed.

### 10.15 `/blog/[slug]` — article (server)
Cover `size="text"` (breadcrumbs): category eyebrow, H1, lead = excerpt, meta line (author per rule, date, read time). · Lead figure 3:2 `MediaFrame` with caption. · `OnThisPage` cols 1–3 + `Prose as="article" dropcap` cols 4–11 with numbered H2s, figures with captions, the page's one Deck between sections; `articleSchema`. · Related: 3 index rows in the same category + `getBlogContextualLinks`. · InquiryPanel compact with `defaultEventType` inferred from category (Wedding Planning/Destination → WEDDING/DESTINATION_WEDDING, Corporate → CORPORATE, else undefined).

### 10.16 `/locations/[city]` ×13 — `templates/local-page.tsx` (server; data `src/lib/location-pages.ts`)
| # | Section | Purpose | Data | Primitives | Mobile |
|---|---|---|---|---|---|
| 0 | Cover `size="text"` (breadcrumbs Home · Locations · {city}) | eyebrow "{City}"; H1 "Event planning in {city}"; lead unique to the city (logistics, travel from Pune, venue *types* — no invented venue names) | `LOCATION_PAGES[city]` | Cover, Breadcrumbs | — |
| 1 | Editorial band | one photographic moment (lazy, below fold) | `editorial-band` pool of 10 (rotated by city index) | MediaFrame 3:2 + caption | 3:2 |
| 2 | Section 01 "How we work in {city}" | materially unique copy per city (copy agent); partnership/track-record claims stripped | `LOCATION_PAGES[city].intro/highlights` rewritten | Prose `dropcap` | — |
| 3 | Section 02 "Services in {city}" | the 6 most relevant services with From ₹ | `services`, per-city subset in data | ServicesIndex `items frame="none"` | cards |
| 4 | Section 03 "Questions" | city FAQs | `getExpandedLocationFaqs(page)` | Accordion `name="faq-{city}" schema` | — |
| 5 | "Other cities" | links to the 12 remaining cities | `LOCATION_PAGES` | Ledger `as="dl" columns=4` of links | 2 columns |
| 6 | InquiryPanel | lead capture | — | InquiryPanel `source="contact" variant="compact"` | — |
A `defaultCity` prop on `InquiryForm` is **requested from its owner** in the package report, never added by the page package. `locationBusinessSchema` and `speakableWebPageSchema` unchanged.

### 10.17 Six local-SEO pages (`/event-management-company-pune`, `/wedding-planner-pune`, `/corporate-event-management-pune`, `/luxury-wedding-planner-maharashtra`, `/exhibition-management-pune`, `/destination-wedding-planner-pune`) — `templates/local-page.tsx variant="service"` (data `src/lib/local-seo-pages.ts`)
Cover `size="text"` with the matching `ServiceIcon` 48, H1 from data **with "Premier" removed** ("Event Management Company in Pune"), lead. · `editorial-band` frame. · Section 01 "The brief": unique intent copy with drop cap. · Section 02 "Relevant services": 3–6 `ServicesIndex` rows. · Section 03 "Commitments": `Commitments grid`. · Section 04 "Questions": `Accordion schema` from `getExpandedLocalFaqs`. · Contextual links (`getLocalPageContextualLinks`) in small type. · InquiryPanel `source="service"` with `defaultEventType` mapped from `serviceType`.

### 10.18 `/privacy`, `/terms`, `/refund` — `templates/legal-page.tsx`
Cover `size="text"`: eyebrow "Legal", H1, "Last updated" folio line. · `OnThisPage` + `Prose as="article"` measure with numbered H2s. · Company facts `Ledger as="dl"` (legal name, CIN, registered address, email). · Links to the other legal pages.

### 10.19 `/sitemap` (HTML sitemap) — restyled with the legal template: Cover text, link groups as ruled columns. `/ai`, `/vendors`, `/venues` remain `noIndex` and are **not** redesigned (header/footer still wrap them); recommend removal in the final report.

### 10.20 404 — `app/not-found.tsx`
Centred text cover: "404" in Cinzel at `--lux-text-display-xl` in `--lux-gold-55` (the one Cinzel element), H1 **"This page didn't make the guest list."**, lead "The link may have moved. The services index and a planner are one tap away.", links "Services" (`/services`) and "Talk to a planner" (`/contact`), ghost WhatsApp. · `ServicesIndex variant="compact"` of 6 flagship services. `noindex`. Action bar still present on phones.

---

## 11. Technical appendix

### 11.1 Techniques and where they live
| Technique | Where | Notes |
|---|---|---|
| Named-line page grid (`.lux-page`, `.lux-bleed`) | every view, Cover, Spread | no `100vw`, no negative margins, no overflow at 360px |
| `clamp()` type scale, `lh` units, `text-wrap: balance/pretty`, `hanging-punctuation` | tokens, Heading, Prose, Deck | |
| `color-mix(in oklab)` surfaces and gold tints | tokens | no new hexes |
| `@property --lux-rule`, `--lux-shine` | section head rule, buttons | |
| Scroll-driven animations (`animation-timeline: view()`, `animation-range`) | `.lux-reveal`, photo settle, rule draw, ProcessLine | all inside `@supports`; static fallback |
| Container queries (`container-type: inline-size`, `@container (min-width: 40cqi)`) | ServicesIndex rows, ConceptCard, Ledger, PriceTable (table → cards) | same markup lays out as row or stack |
| `:has()` | sticky frame swap, `.lux-section:has(> .lux-spread:first-child)`, `.lux-field:has(:user-invalid)`, `html:has(dialog[open])`, TabsRadio filters, action-bar hide | |
| `content-visibility: auto` + `contain-intrinsic-size` | below-fold Sections, gallery rows, footer groups | |
| `aspect-ratio` on every media box | MediaFrame | CLS 0 |
| `<details name>` exclusive groups + `interpolate-size` | Accordion, footer groups (phones), mobile menu services, OnThisPage (phones) | |
| `<dialog>` (`showModal`, `closedby="any"`, `@starting-style`, `transition-behavior: allow-discrete`) | MobileMenu, Lightbox | native focus trap/inert; no hand-rolled traps |
| `popover` + `popovertarget` | desktop services panel | full-width fixed panel; JS toggle fallback for Safari 16.4 |
| `scroll-snap` | Strand, lightbox strip, concept strand on phones | |
| React `<ViewTransition>` (`experimental.viewTransition: true`) | layout crossfade, `photo-{id}`, `concept-{id}`, `service-title-{slug}` | no transform on page wrappers |
| Speculation Rules | `layout.tsx`: `<script type="speculationrules">` prerender `/services`, `/book-event`, `/contact`, `/pricing` (`eagerness: "moderate"`), prefetch `/services/*`, `/portfolio/*` (`conservative`) | skipped under Save-Data; `AnalyticsProvider` and `CookieConsent` wait for `document.prerendering === false` (`prerenderingchange`) so prerendered documents never count a pageview or stamp consent |
| `fetchpriority="high"` / `priority` | each page's cover only (local WebP) | everything else lazy + `decoding="async"` |
| Delegated analytics | `AnalyticsProvider`: one `click` listener on `document` for `[data-cta]` → `analytics.ctaClick(cta, ctaLocation)` | lets Button, ActionBar, Footer, index rows stay server components |
| `proxy.ts` (not `middleware.ts`) | security headers only if needed; the `/testimonials` redirect uses `redirects()` | `cacheComponents` stays off |
| `field-sizing: content`, `:user-invalid`, labels above fields | InquiryPanel CSS | |
| `prefetch={false}` | footer discovery links, gallery tiles, blog cards | avoids prefetch storms |
| `color-scheme: dark`, `overflow-x: clip` on `main`, `env(safe-area-inset-*)` | tokens / layout | |

### 11.2 Client islands (the complete list)
`HeaderIsland` (scroll flag, popover intent/close/fallback, ~40 lines) · `MobileMenu` (dialog open/close/route-close, ~60) · `Lightbox` (~120) · `StrandNav` (~25, hover devices only) · `InquirySentinel` (~15) · `DetailsOpenAtDesktop` (~20) · `InquiryForm` (existing) · `InlineBudgetCalculator` (existing, restyled) · `CookieConsent` (existing) · `AnalyticsProvider` (existing + delegated handler + prerendering gate) · `ToastProvider` (existing). Nothing else carries `"use client"` in `src/brand/**` or `src/components/ui/**`.

### 11.3 Performance budget
- Mobile LCP < 2.0s (local cover WebP ≤ 90 KB at 768w, preloaded; no Drive image above the fold); CLS 0 (aspect-ratio everywhere, skeleton matches cover geometry, fonts `display: swap` with size-matched fallbacks); INP < 200ms (no scroll listeners beyond the header flag, no JS-driven motion).
- Home JS ≤ 180 KB gzipped: no framer-motion, gsap, lenis, three, @react-three/*, leaflet, recharts, sonner on site pages (the technical package removes the deps after the last import is gone; recharts stays for /admin only via route-level import).
- CSS: `tokens.css` + `luxury-redesign.css` (trimmed) + `lux-conversion.css` + `src/styles/pages/*.css` (each ≤ 250 lines, `@layer components`); delete `design-system.css`, `responsive.css`, `responsive-system.css`, `mobile-nav.css`, `stitch-theme.css` once unreferenced. Target total CSS ≤ 90 KB gzipped (currently ~200 KB).
- Images: ≤ 12 lazily mounted frame images on /services (≤ 828px), 3 on home; gallery pages 24 tiles per page; never request > 1920.
- `backdrop-filter` at most 3 elements per page (header, action bar, lightbox counter).

### 11.4 Accessibility checklist (WCAG 2.2 AA)
- One `<h1>`; logical heading order; every `Section` `aria-labelledby`; landmarks: header `<nav aria-label="Primary">`, `main#main-content`, footer `<nav aria-label="Footer">`; skip link kept.
- Visible `:focus-visible` ring (2px gold, 3px offset) on every interactive element including `<summary>`, strand items, gallery tiles.
- Tap targets ≥ 44px (action bar 64px); labels on every control, visible above fields; error text linked via `aria-describedby`.
- No `role="menu"` on link lists; no `aria-hidden` on focusable content; decorative folios/numerals `aria-hidden`.
- Contrast ≥ 4.5:1 for all text (only `--lux-white/--lux-muted/--lux-subtle/--lux-gold` on navy; white on purple 4.9:1); no text on photographs except the lightbox counter on the scrim.
- `prefers-reduced-motion` honoured for every animation (§9.5); no loops; no autoplay; `scroll-behavior: auto` under reduced motion.
- Native `<dialog>`/`popover`/`<details>` semantics; ESC closes; focus returns to the trigger; `inert` background via `showModal`.
- Images: descriptive alt from curation; captions beneath; lightbox announces "Photo 12 of 102".
- Forms: 16px inputs; honeypot stays; success state is a live region; WhatsApp hand-off on failure.
- Keyboard: strands and the lightbox strip are native scroll containers; index rows are links; sticky frame swap also fires on `:focus-within`.

---

### 11.5 Structured data per route (emit only what is rendered)
| Route | JSON-LD (builders in `src/lib/seo.ts`) |
|---|---|
| all | `globalGraphSchema()` in layout (Organization, WebSite); nothing duplicated per page |
| `/` | `faqSchema(HOME_FAQ_ITEMS)`, `itemListSchema(services)` |
| `/services` | `collectionPageSchema`, `itemListSchema(services)`, `faqSchema` (the 3 rendered) |
| `/services/[slug]` | `breadcrumbSchema`, `serviceSchema` (offer `priceSpecification.minPrice` = basePrice — a *starting* price, never an exact `price`), `faqSchema(getServiceFaqs)` |
| `/portfolio`, `/portfolio/[slug]` | `collectionPageSchema`; case: `creativeWorkSchema` with "Illustrative concept" in `name`/`description`, `breadcrumbSchema` |
| `/gallery` | `collectionPageSchema` (images listed by `sitemap-images.xml`) |
| `/about` | `aboutPageSchema` with facts only; `personSchema` only for MCA-verified people |
| `/company` | none beyond the global graph (avoid a second Organization) |
| `/pricing` | `offerCatalogSchema` from `BRAND_INVESTMENTS` + `services[].basePrice`, `faqSchema` |
| `/faqs` | `faqSchema` of every rendered item |
| `/why-nexyyra` | `breadcrumbSchema` only — **`reviewSchema` and `aggregateRatingSchema` are deleted from `seo.ts`** |
| `/contact` | `contactPageSchema` |
| `/book-event` | `breadcrumbSchema` |
| `/blog`, `/blog/[slug]` | `collectionPageSchema`; `articleSchema` with `author` = Organization unless a verified Person, `breadcrumbSchema`, `faqSchema` when an article FAQ is rendered |
| `/locations/[city]` | `locationBusinessSchema`, `faqSchema(getExpandedLocationFaqs)`, `breadcrumbSchema`, `speakableWebPageSchema` |
| local-SEO pages | `localBusinessSchemaForPage`, `faqSchema(getExpandedLocalFaqs)`, `breadcrumbSchema` |
| legal, 404 | none; 404 `noindex` |

### 11.6 Code for the four spec corrections
```tsx
// (1) Speculation Rules — layout.tsx (server). Chrome already suppresses prefetch/prerender under Data Saver,
// so no server-side gating (reading headers() here would force the whole app dynamic).
const SPECULATION = JSON.stringify({
  prerender: [{ where: { href_matches: ["/services", "/book-event", "/contact", "/pricing"] }, eagerness: "moderate" }],
  prefetch:  [{ where: { href_matches: ["/services/*", "/portfolio/*"] }, eagerness: "conservative" }],
});
// <script type="speculationrules" dangerouslySetInnerHTML={{ __html: SPECULATION }} />  (nonce added by proxy.ts CSP)
```
```ts
// (2) Delegated CTA analytics + prerender gate — components/analytics/analytics-provider.tsx (client)
useEffect(() => {
  const onClick = (e: MouseEvent) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>("[data-cta]");
    if (el?.dataset.cta) analytics.ctaClick(el.dataset.cta, el.dataset.ctaLocation);
  };
  document.addEventListener("click", onClick, { passive: true });
  return () => document.removeEventListener("click", onClick);
}, []);
async function whenActivated() {   // call before any pageview, consent write or Hotjar mount
  if ((document as Document & { prerendering?: boolean }).prerendering) {
    await new Promise<void>((r) => document.addEventListener("prerenderingchange", () => r(), { once: true }));
  }
}
```
```ts
// (3) Services panel: full-width fixed popover + Safari 16.4 fallback — brand/shell/header-island.tsx (client)
const trigger = document.getElementById("services-trigger") as HTMLButtonElement;
const panel = document.getElementById("services-panel") as HTMLElement;
if (!("togglePopover" in HTMLElement.prototype)) {
  panel.removeAttribute("popover"); panel.hidden = true;
  trigger.addEventListener("click", () => { panel.hidden = !panel.hidden; trigger.setAttribute("aria-expanded", String(!panel.hidden)); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") panel.hidden = true; });
  document.addEventListener("pointerdown", (e) => { if (!panel.contains(e.target as Node) && !trigger.contains(e.target as Node)) panel.hidden = true; });
}
// CSS (primitives.css): #services-panel:popover-open { position: fixed; inset: var(--lux-nav-h) 0 auto 0; width: 100%; margin: 0; border: 0; border-bottom: 1px solid var(--lux-border); background: var(--lux-surface-2); }
```
```tsx
// (4) <details> open at desktop — components/ui/details-open-at-desktop.tsx (client, wraps server-rendered <details open data-group="footer">)
"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function DetailsOpenAtDesktop({ children, minWidth = 1024 }: { children: ReactNode; minWidth?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const apply = () => ref.current?.querySelectorAll<HTMLDetailsElement>("details").forEach((d) => {
      if (mq.matches) { d.open = true; d.removeAttribute("name"); }
      else { d.setAttribute("name", d.dataset.group ?? "group"); d.open = false; }
    });
    apply(); mq.addEventListener("change", apply); return () => mq.removeEventListener("change", apply);
  }, [minWidth]);
  return <div ref={ref}>{children}</div>;
}
// Server renders the groups with `open` so crawlers and desktop first paint see every link; the island collapses them on phones,
// where the footer is below the fold at hydration, so no visible flash.
```

---

## 12. Implementation plan — parallel work packages

Global rules for every package: own only the files listed; put page CSS in `src/styles/pages/<area>.css` (`@layer components`, `pg-<area>-` classes, ≤ 250 lines); never edit `globals.css`, `layout.tsx`, `tokens.css`, `luxury-redesign.css`, shared primitives or `constants.ts` unless assigned; verify with `npx tsc --noEmit` + `npx eslint <files>`; never run `next build`/`next dev`; LF + UTF-8; final report ≤ 400 words listing files, CSS to import, requests to other owners, and what was verified. Order: **A, B, C first** (foundation, icons, curation); D next; E–K in parallel once A–C land; L and M run alongside.

### Sequencing
| Wave | Packages | Depends on | Unblocks |
|---|---|---|---|
| 0 | **A** foundation, **B** icons, **C** curation, **M** backend | — | everything |
| 0 (prep) | **L** technical: `next.config.ts` flags, `globals.css` import skeleton, `tokens.css` wiring, analytics handler | A (tokens file name) | D–K |
| 1 | **D** shell, **E** home, **G** services | A + B + C | — |
| 2 | **F** about/company, **H** portfolio/gallery, **I** pricing/faqs/why/contact/book, **J** blog/locations/local-SEO, **K** legal/404/sitemap/loading | A + C (+ B for G/J icons) | — |
| 3 | **L** technical close-out: delete retired files, legacy CSS/token files and dependencies; wire `pages/*.css` imports; bundle + Lighthouse measurement | all of D–K | release |

Shared definition of done (every package): `npx tsc --noEmit` and `npx eslint` clean on owned files · no `"use client"` outside §11.2 · no `--glitz-*`/`--v4-*`/`--v5-*`/hex in new CSS · one `<h1>`, every section `aria-labelledby`, one Deck, one purple element per viewport · no photo used twice on a page, no `priority` Drive image · no banned words (grep list in §1.2 and §2.1) · JSON-LD matches rendered content · every CTA carries `data-cta` · report ≤ 400 words with cross-owner requests.

### A. Foundation — tokens + primitives
Owns: `src/styles/tokens.css` (new), `src/styles/luxury-redesign.css` (trim: remove `:root`, aurora, hero carousel, inner-hero, masonry, legacy aliases), `src/styles/lux-conversion.css` (keep form + concept tag; remove services-grid/process/promise/inquiry/faq blocks superseded by primitives), `src/styles/primitives.css` (new; all `lux-*` classes from §6 + motion from §9), `src/components/ui/*` (all primitives in §6 incl. `strand.tsx`, `media-frame.tsx`, `services-index.tsx`, `ledger.tsx`, `process-line.tsx`, `price-table.tsx`, `spread.tsx`, `gallery.tsx`, `lightbox.tsx`, `concept-card.tsx`, `on-this-page.tsx`, `skeleton.tsx`, `details-open-at-desktop.tsx`, `index.ts`), `src/brand/data/content.ts` (add `BRAND_COMMITMENTS`), `src/brand/primitives/brand-image.tsx` (focal/curation support), `src/styles/pages/inquiry.css`.
Deliverables: the one token file with every value in §3 and the legacy alias block; `@theme inline` mapping handed to the orchestrator; all primitives as server components with the exact prop APIs; `Lightbox`, `StrandNav`, `InquirySentinel`, `DetailsOpenAtDesktop` as the only islands; Storybook-free demo route is **not** created (no new routes).
Acceptance: `tsc` + `eslint` clean; every class in §6 exists once; no `"use client"` outside the island list; no hex outside `tokens.css`; `.lux-reveal` content visible with animations disabled; ConceptTag text is not overridable; `Commitments` has no numeric props.

### B. Icons + brand assets
Owns: `src/components/icons/service-icons.tsx`, `ui-icons.tsx`, `index.ts`, `/public/brand/og-default.png`, `/public/fonts/*` (subset TTFs for OG), `src/app/opengraph-image.tsx`, `src/app/services/[slug]/opengraph-image.tsx`, `src/app/blog/[slug]/opengraph-image.tsx`.
Deliverables: 12 service icons + 18 UI glyphs per §7 (24 grid, stroke 1.5, round caps, one gold jewel, `currentColor`), `ServiceIcon`/`UiIcon` APIs, OG recipe per §8.7.
Acceptance: every icon renders at 20/24/32/48 with correct stroke via `--icon-stroke`; `aria-hidden` default, `title` → `role="img"`; no motifs from the banned list; OG images 1200×630 under 300 KB.

### C. Image curation
Owns: `src/brand/data/image-curation.ts`, `scripts/export-covers.mjs`, `/public/images/covers/*`, `scripts/optimize-placeholders.mjs` (extend to write `blur` into curation).
Deliverables: all 102 assets curated per §8.2 (roles, focal, cropSafe, people, busy, span, service, alt, caption); 17 local cover sets (home + services/about/portfolio/why + 12 services) at 1920/1280/768 WebP; the `editorial-band` pool of 10; `NEEDS_REAL_PHOTOGRAPHY` list; a dedupe helper.
Acceptance: no cover with `people: close`; every role in §8.3 resolves to ≥ 1 asset; every alt is descriptive and names no client/venue/city unless `city` is set; covers exist on disk and are ≤ 90 KB at 768w; the final report lists the photography gaps for the owner.

### D. Header / footer / action bar
Owns: `src/brand/shell/brand-header.tsx`, `header-island.tsx` (new), `mobile-navbar.tsx`, `mobile-menu.tsx`, `brand-action-bar.tsx` (new; deletes `brand-fab.tsx`), `brand-footer.tsx`, `nav-data.ts`, `src/styles/pages/shell.css` (replaces `mobile-nav.css`), `src/components/shared/cookie-consent.tsx` (positioning + equal-weight buttons + prerendering gate).
Deliverables per §10.0. Requests to orchestrator: `MEGA_EXPLORE_LINKS` href `/testimonials` → `/why-nexyyra`; `layout.tsx` to render `ActionBar` instead of `BrandFab`, drop `PortalTransition`, `CinematicProvider`, `AdaptiveThemeProvider`, `data-scroll-behavior`.
Acceptance: header transparent over the home cover and solid after 24px; popover opens/closes by click, ESC, outside click, route change and works with the Safari fallback; no `role="menu"`; mobile menu is a `<dialog>` with native focus trap; action bar hides while the inquiry form is visible; fixed chrome ≤ 128px on phones; footer ships zero client JS and all links `prefetch={false}`.

### E. Home
Owns: `src/brand/views/home-view.tsx` (absorbs `home-below-fold.tsx`), `src/brand/sections/home/*` (rewrite: cover, services, about, method, concepts, commitments, inquiry, faq; delete `hero*.tsx`, `ai-planner.tsx`, `featured-work.tsx`, `services-explorer.tsx`, `promise.tsx`), `src/app/page.tsx`, `src/app/loading.tsx`, `src/styles/pages/home.css`.
Acceptance: §10.1 order; H1 + CTA + commitments in the first 640px-tall phone screen; 3 frame images on home; one Deck; one purple element per viewport; home JS ≤ 180 KB gzipped (report the number from the orchestrator's bundle analysis); LCP element is the local cover.

### F. About + company + team
Owns: `src/brand/views/about-view.tsx`, `src/app/about/page.tsx`, `src/app/company/page.tsx`, `src/data/team.ts` (verify or delete), `src/brand/sections/about/*`, `src/styles/pages/about.css`.
Acceptance: §10.7–10.8; no founder story, no stock photos, no banned words; `companyProfile` copy rewritten to facts; `aboutPageSchema` only reflects rendered facts.

### G. Services
Owns: `src/brand/views/services-view.tsx`, `src/brand/templates/service-chapter.tsx`, `src/app/services/page.tsx`, `src/app/services/[slug]/{page,loading}.tsx`, `src/components/services/*` (service-faq section), `src/styles/pages/services.css`, `src/data/cms.ts` (**services array only**: narratives/descriptions rewritten honestly, `icon` field dropped in favour of `ServiceIcon`; `venues`, `vendors`, `portfolioItems` left for the technical package to delete).
Acceptance: §10.2–10.3; 12 frame images ≤ 828px lazy on /services, one opaque at a time; phones show icon-and-price cards; gallery omitted when no real assets; `service-title-{slug}` morph works; action bar shows the from-price; FAQ JSON-LD equals rendered items.

### H. Portfolio + gallery
Owns: `src/brand/views/portfolio-view.tsx`, `gallery-view.tsx`, `src/app/portfolio/{page,[slug]/page,[slug]/loading}.tsx`, `src/app/gallery/{page,loading}.tsx`, `src/lib/media/query-readonly.ts` (curation-aware helpers), `src/styles/pages/portfolio.css`.
Acceptance: §10.4–10.6; ConceptTag on every concept; venue types only; concepts and archive separated by a hairline + heading; `photo-{id}` unique per page; gallery paginated at 24 with crawlable `?f=`/`?page=` links; no `grid-auto-flow: dense`; lightbox keyboard/ESC/focus-return verified.

### I. Pricing + FAQs + Why Nexyyra + contact + book-event
Owns: `src/brand/views/{pricing,faqs,why,contact,book}-view.tsx` (delete `testimonials-view.tsx`), `src/app/{pricing,faqs,why-nexyyra,contact,book-event}/page.tsx` (delete `src/app/testimonials/page.tsx`), `src/components/cro/budget-calculator.tsx`, `src/brand/data/faq.ts` (categories, honesty pass), `src/styles/pages/conversion.css`.
Requests: `next.config.ts` 308 `/testimonials` → `/why-nexyyra` (technical package); sitemap entries (K).
Acceptance: §10.9–10.13; price table ticks only from `includes`; no toggle/badge; estimator uses only published numbers; Why page has no quotes; contact has no map; book-event shows "What happens next"; `?service=` and `?collection=` honoured.

### J. Blog + locations + local-SEO
Owns: `src/brand/views/blog-view.tsx`, `src/app/blog/{page,[slug]/page,[slug]/loading}.tsx`, `src/brand/templates/local-page.tsx` (new), `src/app/locations/[city]/{page,loading}.tsx`, the six local-SEO `page.tsx` files, `src/components/shared/local-seo-page.tsx` (delete after migration), `src/lib/location-pages.ts` and `src/lib/local-seo-pages.ts` (copy honesty pass: unique per-city copy, no partnerships, no "Premier"), `src/data/blog-content.ts` (author rule), `src/styles/pages/editorial.css`.
Acceptance: §10.14–10.17; every city page has materially unique intro + "How we work in {city}" copy (report word-diff ratio); no invented venues; blog authors per rule; pipeline section gone; `articleSchema`/`locationBusinessSchema` reflect rendered content.

### K. Legal + 404 + sitemap + loading
Owns: `src/brand/templates/legal-page.tsx` (new), `src/app/{privacy,terms,refund}/page.tsx`, `src/app/not-found.tsx`, `src/app/sitemap/page.tsx`, `src/app/sitemap-*.xml/route.ts` (add `/why-nexyyra`, remove `/testimonials`, `/ai`, `/vendors`, `/venues`), `src/app/robots.ts`, remaining `loading.tsx` files not owned above, `src/styles/pages/legal.css`.
Acceptance: §10.18–10.20; 404 line exactly "This page didn't make the guest list."; sitemaps contain only indexable V6 routes; every `loading.tsx` uses `Skeleton` with cover geometry.

### L. Technical / performance / security
Owns: `next.config.ts` (`experimental.viewTransition: true`, `redirects()` 308 for `/testimonials`, remove `optimizePackageImports` for framer-motion), `src/app/layout.tsx` (render shell per D, `<ViewTransition default>`, speculation rules script, remove dead providers), `src/app/globals.css` (imports: tokens → luxury-redesign → primitives → lux-conversion → pages/*; `@theme inline` map; delete light-mode `:root`), `src/components/analytics/*` (delegated `[data-cta]` handler, prerendering gate), `src/lib/constants.ts` (`MEGA_EXPLORE_LINKS`, `SITE_CONFIG.tagline`), `src/lib/seo.ts` (OG default, remove `reviewSchema`/`aggregateRatingSchema` usage), `package.json` (remove framer-motion, gsap, lenis, three, @react-three/*, leaflet, @types/leaflet, @radix-ui/react-accordion once unreferenced), `proxy.ts` (security headers: CSP with `script-src 'self' 'nonce-…'` + GA/Hotjar hosts, `frame-ancestors 'none'`, `Referrer-Policy strict-origin-when-cross-origin`, `Permissions-Policy`), deletion of retired files listed in §6 and the legacy CSS/token files.
Acceptance: `tsc`/`eslint` clean across the tree; no import of a retired module; home bundle ≤ 180 KB gzipped (measured with `ANALYZE` after the orchestrator's build); Lighthouse mobile (orchestrator-run) LCP < 2.0s, CLS 0, a11y ≥ 95; CSP has no `unsafe-inline` for scripts (JSON-LD and speculation rules carry the nonce).

### M. Backend hardening
Owns: `src/app/api/inquiry/route.ts`, `src/lib/inquiry.ts`, `src/app/api/media/route.ts`, `src/app/api/admin/media/**`, `src/app/api/cron/media-sync/route.ts`, `src/lib/auth/**`, `prisma/` (migrations only if a field is missing), `.env.example`.
Deliverables: `/api/inquiry` — zod schema (existing) tightened (phone E.164 for +91, email, lengths), Origin/Referer same-site check, honeypot + minimum-fill-time check, per-IP rate limit (token bucket keyed on `x-forwarded-for`; documented as per-instance on Vercel, with a note recommending Vercel WAF rate rules), JSON error shape the form already handles, no PII in logs; admin media routes behind the `jose` session (httpOnly, Secure, SameSite=Lax, 12h) with 401/403 distinction; cron route requires `Authorization: Bearer ${CRON_SECRET}`; `/api/media` read-only with `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`; secrets only in `.env` (example updated), never `NEXT_PUBLIC_`.
Acceptance: `tsc` clean; curl matrix in the report (valid, invalid, missing origin, 11th request/min → 429, cron without bearer → 401); the inquiry success path still posts to the same endpoint the form uses; no new dependencies.

---

### Appendix — copy that must exist exactly
- Primary CTA label: "Get a Free Proposal". Secondary: "WhatsApp a planner" / "Call".
- Concept line: "Illustrative concepts showing the scale we plan. Ask for references at your consultation."
- 404 H1: "This page didn't make the guest list."
- Commitments (dt → dd): "Same-day reply" → "A planner replies the same day, 9am–9pm IST." · "Itemised proposal in 48 hours" → "Every line priced after your free consultation." · "One event director" → "A single accountable lead from brief to wrap." · "30% secures your date" → "Balance in milestones via Razorpay, bank transfer or UPI."
- Entity line: "Nexyyra Events and Promotions Private Limited · Delivery & Coordination Office — Pune".
