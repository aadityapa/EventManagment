# Glitz Events & Promotions — Stitch Design System

> Agent-readable design spec for [Google Stitch](https://stitch.withgoogle.com) + production code.
> Brand: Luxury Black & Gold | Location: Pune, India

## Brand Identity

- **Name:** Glitz Events & Promotions
- **Tagline:** Creating Extraordinary Experiences
- **Voice:** Premium, cinematic, confident, warm
- **Inspiration:** Rolls Royce, Louis Vuitton, Apple product launches

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `color-bg-primary` | `#000000` | Page background |
| `color-bg-elevated` | `#0D0D0D` | Cards, nav |
| `color-bg-surface` | `#121212` | Sections |
| `color-gold-primary` | `#D4AF37` | Primary accent, CTAs |
| `color-gold-bright` | `#FFD700` | Highlights, hover |
| `color-gold-soft` | `#F5D76E` | Gradients, subtitles |
| `color-text-primary` | `#FAFAFA` | Headings, body |
| `color-text-muted` | `#A3A3A3` | Secondary text |
| `color-glass` | `rgba(13,13,13,0.65)` | Glass panels |
| `color-glass-border` | `rgba(212,175,55,0.2)` | Borders |

## Typography

| Role | Font | Weight | Size (desktop) |
|------|------|--------|----------------|
| Display H1 | Playfair Display | 700 | 48–72px |
| Brand Accent | Cinzel | 600 | 24–36px |
| Heading H2 | Playfair Display | 600 | 36–48px |
| Heading H3 | Montserrat | 600 | 20–24px |
| Body | Poppins | 400 | 16–18px |
| Eyebrow | Montserrat | 500 | 12px, tracking 0.35em, uppercase |
| CTA | Montserrat | 600 | 14–16px |

## Spacing Scale

`4, 8, 12, 16, 24, 32, 48, 64, 96, 128` (px)

## Border Radius

- `sm`: 8px — inputs
- `md`: 12px — buttons
- `lg`: 16px — cards
- `xl`: 24px — sections
- `full`: 9999px — pills

## Shadows & Glow

- `shadow-glow`: `0 0 50px rgba(212,175,55,0.2)`
- `shadow-glow-lg`: `0 0 80px rgba(255,215,0,0.15)`

## Component Patterns

### Button Primary
- Gold gradient background, black text
- Magnetic hover (scale 1.02, translateY -2px)
- Glow shadow on hover

### Button Outline
- Gold border 40% opacity, transparent bg
- Hover: gold tint background

### Card (Glow)
- Glass background, gold border 15% opacity
- Hover: lift -4px, gold glow, image scale 1.08

### Page Hero
- Full-width cinematic band
- Radial gold spotlight top
- Text reveal animation (stagger children)
- Optional gold particle overlay

### Section
- Vertical padding: 80–112px desktop, 56–80px mobile
- Staggered scroll reveal for children

## Motion (Stitch Animation Spec)

| Name | Duration | Easing | Trigger |
|------|----------|--------|---------|
| `fade-up` | 0.7s | cubic-bezier(0.22,1,0.36,1) | inView once |
| `fade-scale` | 0.8s | cubic-bezier(0.22,1,0.36,1) | inView once |
| `text-reveal` | 0.9s | cubic-bezier(0.22,1,0.36,1) | mount / inView |
| `magnetic` | 0.35s | ease-out | hover |
| `shimmer` | 3s | linear infinite | ambient |
| `page-loader` | 2.2s | ease | route load |

**Stagger delay:** 0.08s between sibling items

**Reduced motion:** All animations collapse to instant when `prefers-reduced-motion: reduce`

## Layout

- Max content width: `80rem` (1280px)
- Grid: 12-column mental model, 1/2/3/4 col responsive
- Mobile bottom CTA bar: fixed, glass, safe-area

## Logo

- Asset: `/logo.jpg`
- Min height navbar: 40px
- Hero: 80–96px
- Contact featured: 112px

## Pages

All pages use `PageHero` + `StitchSection` + `StitchReveal` for consistency.
