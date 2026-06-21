# Glitz Events V4 — Design System

> Implemented in `apps/web/src/brand/design-system/v4-tokens.css` (imported in `globals.css` after `tokens.css`, before `styles/design-system.css`). Extends — never replaces — V3 tokens. Dual theme + adaptive vars preserved.

## 1. Color

### Brand scalars (immutable hues)
| Token | Hex | Role |
|-------|-----|------|
| `--v4-obsidian` | `#050505` | Dark canvas base |
| `--v4-dark-surface` | `#111111` | Dark elevated surface |
| `--v4-gold-luxury` | `#D4AF37` | Primary luxury gold |
| `--v4-gold-metallic` | `#C9A227` | Metallic accent / lines |
| `--v4-champagne` | `#E6C67A` | Warm highlight |
| `--v4-ivory` | `#FDFBF5` | Light canvas base |
| `--v4-warm-sand` | `#F7F3EB` | Light elevated surface |
| `--v4-dune` / `--v4-dune-glow` | `#D8B26E` / `#F5D76E` | Glow gradients |

### Color roles (theme-aware)
- **Canvas:** ivory (light) / obsidian (dark) — via existing `--background`.
- **Surface / elevated:** warm-sand / dark-surface — via `--surface`, `--card`.
- **Text:** AAA-targeted via `--text-primary/secondary/muted` + adaptive overrides `--adaptive-text/muted/accent` on art-directed frames.
- **Accent:** gold scale; gold reserved for emphasis, CTAs, hairlines — never body text.
- **Atmosphere:** `--v4-dune-glow-radial`, `--v4-dune-glow-soft`, `--v4-gradient-champagne`, `--v4-gradient-gold-line`.

> **No invisible text rule:** body text always uses semantic text tokens; on full-bleed frames the adaptive engine recomputes `--adaptive-text` for AAA contrast. Gold is decorative/emphatic only.

## 2. Typography (editorial luxury)

Families (already loaded): **Playfair Display** (display), **Cormorant Garamond** (headings/standfirst), **Cinzel** (kickers), **Manrope/Inter** (body).

| Token | Clamp | Use | Utility |
|-------|-------|-----|---------|
| `--v4-text-kicker` | `0.75rem` | Eyebrow label, caps, `0.32em` tracking | `.v4-kicker` (with hairline ::before) |
| `--v4-text-hero` | `clamp(3rem, 1rem+9vw, 8rem)` | Hero only | `.v4-hero-display` |
| `--v4-text-display` | `clamp(2.5rem, 1.2rem+6vw, 5.5rem)` | Section displays | `.v4-display` |
| `--v4-text-title` | `clamp(1.75rem, 1.2rem+2.6vw, 3rem)` | Sub-section titles | `.v4-title` |
| `--v4-text-standfirst` | `clamp(1.25rem, 1.1rem+0.8vw, 1.6rem)` | Lede paragraph (Cormorant) | `.v4-standfirst` |
| `--v4-text-body` | `clamp(1rem, .95rem+0.3vw, 1.125rem)` | Body, `62ch` measure | `.v4-body` |

Rhythm tokens: `--v4-leading-tight/snug/body`, `--v4-tracking-kicker/display`.
**Editorial hierarchy per block:** kicker → display → standfirst → body.

## 3. Spacing & grid
- **White-space scale:** `--v4-space-3xs … --v4-space-4xl` (0.25rem → 14rem). Editorial leaps (not linear) for "exclusive" pacing.
- **Section rhythm:** `--v4-section` `clamp(5rem,12vw,11rem)`, `--v4-section-lg` `clamp(7rem,16vw,16rem)` — more generous than V3's 5–10rem. Utilities `.v4-section`, `.v4-section-lg`.
- **Measure:** `--v4-measure: 62ch` for readable body.
- **Grid:** keep `.brand-container` (max 90rem). V4 favors **asymmetric** grids (7/5, 8/4) and overlap over even 3-col repetition.

## 4. Elevation & glass
| Token | Use |
|-------|-----|
| `--v4-elev-1/2/3` | Layered, theme-aware shadows |
| `--v4-glow-gold` | Gold ring + bloom for primary surfaces |
| `--v4-glass-bg / -strong`, `--v4-glass-border`, `--v4-glass-highlight`, `--v4-glass-shadow` | Glass material |

Utilities:
- `.v4-glass` — standard frosted panel (blur 20px, saturate 160%, gold hairline border).
- `.v4-glass-liquid` — premium **liquid glass**: top-light highlight (`::before`), masked gold hairline edge (`::after`), inner sheen. Use for hero panels, floating stat cards, CTA panels.
- `.v4-dune-glow` — wraps a section with a radial dune-glow backdrop (`::before`, behind content).
- `.v4-grain` — subtle film grain overlay (`::after`, `mix-blend-mode: overlay`).
- `.v4-hairline` — gold gradient rule.

## 5. Motion tokens
Mirrored in `lib/motion/easing.ts` so CSS and JS share one grammar.
| Token | Curve | Use |
|-------|-------|-----|
| `--v4-ease-luxe` | `cubic-bezier(0.22,1,0.36,1)` | Signature reveal (expo-out) |
| `--v4-ease-silk` | `cubic-bezier(0.16,1,0.3,1)` | Soft settle |
| `--v4-ease-drama` | `cubic-bezier(0.85,0,0.15,1)` | Scene in-out, pinned |
| `--v4-ease-out` | `cubic-bezier(0.33,1,0.68,1)` | Utility |
| `--v4-dur-fast/base/slow/cinematic` | `0.3 / 0.6 / 0.9 / 1.2s` | Duration scale |

## 6. Radii
`--v4-radius-sm 0.625rem` · `--v4-radius 1rem` · `--v4-radius-lg 1.5rem` · `--v4-radius-xl 2rem`.

## 7. Accessibility & dual theme
- All atmosphere tokens are defined under both `:root/.light` and `.dark`.
- Adaptive engine (`adaptive-theme-provider`) still drives `--adaptive-*` for art-directed frames → AAA contrast.
- `prefers-reduced-motion` neutralises animated atmosphere; static beauty (glass, glow, type) remains.
- Focus rings inherited from globals (`:focus-visible`).

## 8. Usage rules
1. Build new V4 sections with `.v4-section` rhythm + editorial type utilities.
2. Reserve gold for emphasis/CTAs/lines — never body copy.
3. Prefer `.v4-glass-liquid` for floating UI over flat cards.
4. Wrap atmospheric sections in `.v4-dune-glow` + optional `.v4-grain`.
5. Never hardcode hex in components — reference `--v4-*` / semantic tokens.
6. Keep V3 utilities working; migrate page-by-page, not big-bang.
