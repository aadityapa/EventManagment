# Nexyyra FIX_REPORT — Production Fix Pass (2026-06-21)

## Critical: Homepage blank white sections on scroll

### Root causes found
1. **`ScrollReveal` stuck at `opacity: 0`** — `whileInView` with `amount: 0.25` and `once: true` failed to trigger on fast Lenis scroll or pinned layouts.
2. **`HomePortfolioShowcase` GSAP ScrollTrigger pin** — `pin: true` + horizontal scrub created empty pin-spacer zones (blank ivory sections while scrolling).
3. **Stagger grids** in signature experiences and venue collection used high visibility thresholds (`amount: 0.15–0.2`).

### Fixes applied
| File | Change |
|------|--------|
| `src/lib/motion/scroll-reveal.tsx` | Switched to `useInView` + `animate`; lowered threshold to `0.08`; added 2.5s fallback to force visible |
| `src/lib/motion/variants.ts` | `viewportOnce` → `amount: 0.08`, `margin: "0px 0px -80px 0px"` |
| `src/brand/sections/home/portfolio-showcase.tsx` | Removed GSAP pin/scrub; responsive grid + horizontal scroll on mobile |
| `src/brand/sections/home/signature-experiences.tsx` | Uses shared `viewportOnce` |
| `src/brand/sections/home/venue-collection.tsx` | Uses shared `viewportOnce` |
| `src/components/providers/cinematic-provider.tsx` | `ScrollTrigger.refresh()` after loader completes |

---

## Experience cards alignment

### Issue
Destination Weddings, Corporate Experiences, Celebrity Events had inconsistent image heights and asymmetric `translate-y` offsets.

### Fix
| Property | Value |
|----------|-------|
| Card height | `520px` |
| Image height | `360px`, `object-fit: cover` |
| Content | `min-height: 140px` |
| Grid | `repeat(3, 1fr)`, `gap: 32px` |

**Files:** `signature-experiences.tsx`, `responsive-system.css` (`.experience-cards-grid`, `.experience-card`)

---

## Floating action bar (left quick actions)

### Issue
Phone, Calendar, Sparkle icons clipped — container too narrow, wrong position.

### Fix
- Moved to **left side**, vertically centered (`top: 50%`, `translateY(-50%)`)
- Width `72px`, icon buttons `56×56px`, gap `16px`, `z-index: 1000`
- Premium glassmorphism on action buttons

**File:** `src/brand/shell/brand-fab.tsx`, `responsive-system.css` (`.quick-actions`)

---

## Theme-aware logos

### Issue
Gold logo on light theme looked faded; SVG wrappers with embedded PNG failed via Next/Image.

### Fix
| Theme | Asset |
|-------|-------|
| Dark | `/logos/logo-gold.svg` |
| Light | `/logos/logo-black.svg` (feColorMatrix black filter) |

Uses native `<img>` for SVG (browser resolves embedded PNG correctly). Instant switch via `next-themes`.

**Files:** `src/components/branding/logo.tsx`, `public/logos/logo-gold.svg`, `public/logos/logo-black.svg`

---

## Header layout

### Fix
- Grid: `220px | 1fr | 360px` (was 320px actions column)
- Actions gap: `20px`
- Logo width: `180px`, centered in logo column
- Header height: `88px` (`--nav-height: 5.5rem` desktop)

**Files:** `responsive-system.css`, `brand-header.tsx` (unchanged structure, CSS updated)

---

## Loader / header gating (from prior pass — verified)

- Header returns `null` until `premiereComplete`
- Loader `z-index: 99999`, header `--z-nav: 100`
- `body overflow: hidden` during premiere

---

## Exit intent popup (from prior pass — verified)

- `exit-intent-popup.tsx` deleted
- Removed from `layout.tsx`, `globals.css`
- `exit-intent-shown` removed from `cache-version.ts` legacy keys

---

## Verification checklist

| Page | Status |
|------|--------|
| Home | Fixed scroll reveals, cards, FAB |
| About | ScrollReveal inherits fix |
| Experiences / Services | Theme logos |
| Portfolio | Prior layout fix + scroll fix |
| Venues | viewportOnce |
| Stories / Blog | ScrollReveal inherits fix |
| Contact | Header/FAB |

| Viewport | Status |
|----------|--------|
| Desktop | Header grid 3-col, left FAB |
| Laptop | Same |
| Tablet | Experience cards 1-col → 3-col at 768px |
| Mobile | FAB hidden (md+), horizontal portfolio scroll |

**Build:** Next.js 16.2.7 — 79 routes, TypeScript clean.
