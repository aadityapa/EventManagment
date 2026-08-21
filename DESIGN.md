# Nexyyra Events — Design System

> Agent-readable design spec for the live production site.
> Brand: Nexyyra Events and Promotions Private Limited
> Language: Royal navy + champagne gold + royal purple, editorial glassmorphism | Pune, India

## Brand Identity

- **Name:** Nexyyra Events (legal: Nexyyra Events and Promotions Private Limited)
- **Tagline:** Creating Experiences That Last Forever
- **Voice:** Premium, cinematic, confident, warm
- **Inspiration:** Rolls Royce, Louis Vuitton, Apple product launches

## Color Palette (source of truth: `apps/web/src/styles/luxury-redesign.css`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--lux-bg` | `#050816` | Primary background |
| `--lux-bg-secondary` | `#081226` | Secondary background |
| `--lux-section` | `#0d1730` | Section surfaces |
| `--lux-card-solid` | `#101b35` | Solid card surface |
| `--lux-gold` | `#d8b26a` | Champagne gold — accents, labels, borders |
| `--lux-gold-metal` | `#f4d08d` | Metal gold — highlights |
| `--lux-rose` | `#d9a47b` | Rose gold — gradients |
| `--lux-purple` | `#8b4dff` | Accent purple — primary CTAs |
| `--lux-purple-bright` | `#b47cff` | Light purple — gradient text |
| `--lux-violet` | `#6f42ff` | Royal violet — CTA gradients |
| `--lux-white` | `#f7f7f7` | Headings, primary text |
| `--lux-muted` | `#b6b8c6` | Paragraph text |
| `--lux-subtle` | `#98a0b5` | Muted text (AA on `#050816`) |
| `--lux-card` | `rgba(16,27,53,0.55)` | Navy glass panels |
| `--lux-border` | `rgba(255,255,255,0.08)` | Hairline borders |
| `--lux-border-gold` | `rgba(216,178,106,0.28)` | Gold borders |

## Typography (loaded in `apps/web/src/app/layout.tsx`)

| Role | Font | Notes |
|------|------|-------|
| Display / Headings | Cormorant Garamond (`--font-cormorant`) | Serif, 600–700, tight leading, `clamp()` fluid sizes |
| Display fallback | Playfair Display (`--font-playfair`) | |
| Brand accent | Cinzel (`--font-cinzel`) | Sparing use |
| Body | Manrope (`--font-manrope`) | 400–600, 1.7+ line-height |
| UI fallback | Inter (`--font-inter`) | |

Eyebrow/labels: `.lux-label` — 0.72rem, 700, tracking 0.32em, uppercase, gold, gradient rule on both sides.

## Spacing & Radius

- Section rhythm: `.lux-section` (tight variant `.lux-section--tight`); `section-y` = 5rem → 7.5rem → 10rem
- Container: `.brand-container` / `.container-page`, max-width 90rem, fluid inline padding
- Radius: `--lux-radius-lg` 1.5rem, `--lux-radius-xl` 2rem, pills 999px
- Anchor targets: `scroll-margin-top: 5.5rem` (global)

## Component Patterns

- **Buttons** — `.luxury-button` pill, uppercase, letterspaced; variants: `--purple` (primary CTA), `--gold`, `--ghost` (glass + gold border), `--text`, `--compact`, `--full`. Shine sweep on hover, translateY(-2px).
- **Cards** — `.lux-card` navy glass, hairline border, gold-tinged glow (`--lux-glow`); hover lift on `.luxury-card`.
- **Hero** — `.luxury-hero`: carousel backdrop + veil + aurora orbs + masked grid; eyebrow, Cormorant display title with purple gradient accent word, trust metrics `dl` (`.luxury-hero__metrics`), 3D logo coin (three.js).
- **CTA band** — `.lux-cta-band`: heading + supporting copy, purple primary + WhatsApp ghost, trust microcopy.
- **Section label** — `.lux-label` gold editorial caps.

## Motion

- Easing: `--lux-ease` `cubic-bezier(0.22,1,0.36,1)`; reveals 0.6–0.9s, stagger 0.07–0.08s, inView once
- Transform-only animations (no layout thrash); marquee pauses on hover
- **Reduced motion:** global CSS collapse + `<MotionConfig reducedMotion="user">` for framer-motion
- First-visit premiere overlay: desktop only, fine pointer, skipped for reduced motion, 3.5s failsafe

## Mobile

- Fixed glass top bar (`mobile-nav.css`), portaled drawer, safe-area padded
- FAB (bottom-right): WhatsApp + Call on phones; + Book Consultation & Quick Quote from `md` up
- 44px tap targets (`.tap-target` / `.touch-target`); 16px input floor prevents iOS zoom

## Conversion Standards

- Primary CTA site-wide: **Plan Your Event / Let's Plan Together → `/book-event`** (purple)
- WhatsApp always one tap away (FAB + CTA band), prefilled message
- Trust signals: hero metrics, counters, client stories strip, entity line under hero copy
- All CTAs report via `analytics.ctaClick(id, location)`

## Accessibility

- Skip link, `:focus-visible` gold ring, `aria-labelledby` on sections, semantic `dl`/`blockquote`
- Text contrast AA on navy (`--lux-subtle` verified)

## Logo

- SVG assets under `/public/brand/` (`nexyyra-logo-dark.svg` preloaded)
- Navbar min height 40px; hero uses 3D logo coin with CSS fallback
