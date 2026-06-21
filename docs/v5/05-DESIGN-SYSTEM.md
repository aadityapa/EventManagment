# Glitz Events V5 — Design System (Dune Glow Luxury System)

> **Spec only — no CSS implementation in this session.**  
> **Migration path:** `v4-tokens.css` → `v5-tokens.css` (alias `--v4-*` → `--v5-*` for one release cycle)  
> **Implementation target:** `apps/web/src/brand/design-system/v5-tokens.css`  
> **Phone / brand:** Glitz Events · +91 9730594753

---

## 1. Design philosophy

The Dune Glow Luxury System rejects **pure black and pure white sections**. Every surface is warm, editorial, and timeless — obsidian that breathes brown, ivory that breathes sand, gold that behaves like **light** not paint.

Luxury digital = **depth + warmth + restraint**.

---

## 2. Color tokens

### 2.1 Brand scalars (immutable)

| Token | Hex | Name | Role |
|-------|-----|------|------|
| `--v5-obsidian` | `#050505` | Obsidian | Dark canvas — never `#000000` |
| `--v5-champagne` | `#F7F3EB` | Champagne | Light elevated surface |
| `--v5-ivory` | `#FDFBF5` | Ivory | Light canvas base |
| `--v5-warm-sand` | `#F4EFE5` | Warm Sand | Section alternation, cards |
| `--v5-gold-metallic` | `#C9A227` | Metallic Gold | Hairlines, icons, fine detail |
| `--v5-gold-luxury` | `#D4AF37` | Luxury Gold | Primary accent, CTA emphasis |
| `--v5-gold-champagne` | `#E6C67A` | Champagne Gold | Highlights, glow cores |
| `--v5-copper` | `#B8860B` | Copper | Deep accent, borders, hover depth |
| `--v5-dark-surface` | `#111111` | Dark Surface | Elevated dark panels (not pure black) |
| `--v5-dune` | `#D8B26E` | Dune | Mid warm accent |
| `--v5-dune-glow` | `#F5D76E` | Dune Glow | Radial glow cores |

### 2.2 Semantic roles (theme-aware)

| Role | Light theme | Dark theme | Usage |
|------|-------------|------------|-------|
| `--background` | `--v5-ivory` | `--v5-obsidian` | Page canvas |
| `--surface` | `--v5-warm-sand` | `--v5-dark-surface` | Cards, sections |
| `--surface-elevated` | `--v5-champagne` | `#1a1a1a` | Glass backing |
| `--text-primary` | `#1a1612` | `#FDFBF5` | Body headings (AAA on canvas) |
| `--text-secondary` | `#4a4438` | `#E8E4DC` | Supporting copy |
| `--text-muted` | `#6b6358` | `#A8A196` | Meta, captions |
| `--accent` | `--v5-gold-luxury` | `--v5-gold-champagne` | CTAs, links |
| `--accent-muted` | `--v5-copper` | `--v5-gold-metallic` | Borders, rules |
| `--border` | `rgba(184,134,11,0.22)` | `rgba(230,198,122,0.18)` | Hairlines |

**Rule:** No `#000000` or `#FFFFFF` as section backgrounds. Scrims use warm obsidian `rgba(5,5,5,0.72)` not `black/88`.

### 2.3 Atmosphere tokens

| Token | Definition |
|-------|------------|
| `--v5-glow-radial` | `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,215,110,0.18), transparent 70%)` |
| `--v5-glow-soft` | `radial-gradient(circle at 30% 20%, rgba(230,198,122,0.12), transparent 50%)` |
| `--v5-gradient-champagne` | `linear-gradient(135deg, #FDFBF5 0%, #F4EFE5 45%, #F7F3EB 100%)` |
| `--v5-gradient-gold-line` | `linear-gradient(90deg, transparent, #C9A227, #E6C67A, #C9A227, transparent)` |
| `--v5-grain-opacity` | `0.04` (light) / `0.06` (dark) |

Utilities (spec names, implement in Phase 0):
- `.v5-dune-glow` — section wrapper with `::before` radial atmosphere
- `.v5-grain` — film grain overlay (`mix-blend-mode: overlay`)
- `.v5-hairline` — gold gradient rule

---

## 3. Typography — editorial luxury scale

### 3.1 Font families (existing Google loads in `layout.tsx`)

| Family | Variable | Role |
|--------|----------|------|
| Playfair Display | `--font-playfair` | Display headlines |
| Cormorant Garamond | `--font-cormorant` | Standfirst, pull-quotes |
| Cinzel | `--font-cinzel` | Kickers, caps labels |
| Manrope | `--font-manrope` | Body UI |
| Inter | `--font-inter` | Fallback body |

**V5 change:** Increase display ceiling vs V4 for universe moments.

### 3.2 Type scale

| Token | Clamp / Size | Utility class | Use |
|-------|--------------|---------------|-----|
| `--v5-text-kicker` | `0.6875rem` (11px) | `.v5-kicker` | Eyebrow, `0.36em` tracking, Cinzel |
| `--v5-text-caption` | `0.8125rem` | `.v5-caption` | Meta, labels |
| `--v5-text-body` | `clamp(1rem, 0.95rem + 0.3vw, 1.125rem)` | `.v5-body` | Body, max `62ch` |
| `--v5-text-standfirst` | `clamp(1.25rem, 1.1rem + 0.8vw, 1.75rem)` | `.v5-standfirst` | Lede, Cormorant |
| `--v5-text-title` | `clamp(1.75rem, 1.2rem + 2.6vw, 3.25rem)` | `.v5-title` | Section titles |
| `--v5-text-display` | `clamp(2.75rem, 1rem + 7vw, 6.5rem)` | `.v5-display` | Chapter displays |
| `--v5-text-hero` | `clamp(3.25rem, 0.5rem + 10vw, 9rem)` | `.v5-hero-display` | Premiere / loader only |
| `--v5-text-universe` | `clamp(4rem, 2rem + 12vw, 11rem)` | `.v5-universe-display` | Portal moments (rare) |

### 3.3 Rhythm

| Token | Value |
|-------|-------|
| `--v5-leading-tight` | `1.02` |
| `--v5-leading-snug` | `1.12` |
| `--v5-leading-body` | `1.65` |
| `--v5-tracking-kicker` | `0.36em` |
| `--v5-tracking-display` | `-0.025em` |

**Hierarchy per block:** kicker → display → standfirst → body → proof strip

---

## 4. Spacing & grid

### 4.1 Space scale

| Token | Value |
|-------|-------|
| `--v5-space-3xs` | `0.25rem` |
| `--v5-space-2xs` | `0.5rem` |
| `--v5-space-xs` | `0.75rem` |
| `--v5-space-sm` | `1rem` |
| `--v5-space-md` | `1.5rem` |
| `--v5-space-lg` | `2.5rem` |
| `--v5-space-xl` | `4rem` |
| `--v5-space-2xl` | `6rem` |
| `--v5-space-3xl` | `10rem` |
| `--v5-space-4xl` | `16rem` |

### 4.2 Section rhythm

| Token | Value | Utility |
|-------|-------|---------|
| `--v5-section` | `clamp(6rem, 14vw, 12rem)` | `.v5-section` |
| `--v5-section-lg` | `clamp(8rem, 18vw, 18rem)` | `.v5-section-lg` |
| `--v5-measure` | `62ch` | body max-width |

### 4.3 Grid

- Container: `.brand-container` max `90rem` (keep)
- **Asymmetric columns:** 7/5, 8/4, 5/7 alternating — never default 3-equal unless tertiary cards
- **Overlap:** featured cards may `-mt-16` into previous section with z-index discipline

---

## 5. Glass & liquid glass

| Token | Light | Dark |
|-------|-------|------|
| `--v5-glass-bg` | `rgba(253,251,245,0.55)` | `rgba(17,17,17,0.55)` |
| `--v5-glass-bg-strong` | `rgba(247,243,235,0.78)` | `rgba(26,26,26,0.72)` |
| `--v5-glass-border` | `rgba(201,162,39,0.28)` | `rgba(230,198,122,0.22)` |
| `--v5-glass-highlight` | `rgba(255,255,255,0.55)` | `rgba(255,255,255,0.08)` |
| `--v5-glass-shadow` | warm gold bloom | deep obsidian bloom |

### Variants (extend `GlassPanel`)

| Variant | Use |
|---------|-----|
| `standard` | `.v5-glass` — blur 20px, saturate 160% |
| `liquid` | `.v5-glass-liquid` — top highlight + masked gold edge |
| `portal` | stronger blur, atmosphere border pulse on hover |
| `commission` | Book journey panels — extra warm sand tint |

---

## 6. Elevation & borders

| Token | Use |
|-------|-----|
| `--v5-elev-1` | Subtle card lift |
| `--v5-elev-2` | Floating glass |
| `--v5-elev-3` | Modal, mega-menu |
| `--v5-glow-gold` | Primary CTA bloom ring |
| `--v5-radius-sm/md/lg/xl` | `0.625 / 1 / 1.5 / 2 rem` |

Borders: prefer hairline gradients over solid 1px gray.

---

## 7. Component tiers

```
Tier 0 — Tokens & utilities (v5-tokens.css)
Tier 1 — Primitives (brand/primitives/*)
Tier 2 — Motion wrappers (lib/motion/*)
Tier 3 — Sections / scenes (brand/sections/**)
Tier 4 — Chapters (brand/views/*-view.tsx)
Tier 5 — Portals (world entry components — NEW)
Tier 6 — Universe shell (brand/shell/*)
```

### Tier 1 primitives (reuse → extend)

| Component | V5 changes |
|-----------|------------|
| `BrandButton` | Add `variant="commission"` gold fill |
| `BrandImage` | Art direction props: `grade`, `atmosphere` |
| `GlassPanel` | Portal + commission variants |
| `BrandSection` | `.v5-section` default spacing |
| `BrandLightbox` | Editorial captions |
| **NEW** `PortalCard` | World entry tile |
| **NEW** `ChapterHeader` | kicker + display + standfirst block |
| **NEW** `UniverseNav` | replaces header patterns |

### Tier 5 portals (new)

`PortalCard`, `WorldAtmosphere`, `PortalTransition` — compose Experience Worlds grid.

---

## 8. ShadCN / Tailwind integration

### 8.1 Tailwind v4 (@theme)

Map in `globals.css` `@theme inline`:

```css
/* Spec — implement Phase 0 */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--text-primary);
  --color-gold: var(--v5-gold-luxury);
  --color-sand: var(--v5-warm-sand);
  /* … */
}
```

### 8.2 ShadCN components (`components/ui/*`)

| Component | V5 semantic mapping |
|-----------|---------------------|
| `Button` | delegate to `BrandButton` for marketing; `default` uses `--accent` |
| `Input`, `Form` | warm sand bg, copper focus ring |
| `Dialog` | `v5-glass-liquid` + `--v5-elev-3` |
| `Accordion` | FAQ — Cormorant triggers |
| `Tabs` | Venue spotlight tabs |

**Rule:** Marketing surfaces use `brand/primitives`; dashboard keeps ShadCN with V5 token overrides.

---

## 9. Adaptive engine variable contract (V5 extensions)

Existing keys (preserve): `--adaptive-text`, `--adaptive-muted`, `--adaptive-accent`, `--adaptive-accent-light`, `--adaptive-overlay`, `--adaptive-scrim`, `--adaptive-scrim-bottom`, `--adaptive-shadow`, `--adaptive-shadow-strong`, `--adaptive-button`, `--adaptive-button-text`, `--adaptive-gradient-gold`

### New V5 extensions

| Variable | Type | Purpose |
|----------|------|---------|
| `--adaptive-atmosphere` | `rgba()` | Warm wash overlay strength |
| `--adaptive-glow` | color | Dune glow core sampled from frame |
| `--adaptive-surface` | color | Glass panel fill on frame |
| `--adaptive-world-tint` | color | World preset hint (optional) |

### World presets (`lib/adaptive-theme/world-presets.ts` — Phase 0)

| World | Tint bias | Glow bias |
|-------|-----------|-----------|
| wedding | champagne +8% | warm |
| corporate | sand neutral | subdued |
| destination | copper +5% | deep radial |
| celebration | ivory lift | bright |
| culture | obsidian depth | dramatic gold |

Apply via `data-world="wedding"` on `<html>` or section wrapper; merge with frame analysis (frame wins for text contrast).

---

## 10. WCAG AAA contrast rules

| Pairing | Minimum ratio | Notes |
|---------|---------------|-------|
| `--text-primary` on `--background` | **7:1** | All body copy |
| `--text-secondary` on `--background` | **4.5:1** | AA minimum for secondary |
| `--adaptive-text` on art-directed frames | **7:1** | Engine must verify |
| Gold on sand | **Never for body** | Decorative only ≤ large text 3:1 |
| CTA `--adaptive-button-text` on `--adaptive-button` | **7:1** | Book Consultation |

**Forbidden:** `text-white` on `#FDFBF5`; `text-black` on `#050505` — use semantic tokens.

Focus: `outline: 2px solid var(--v5-gold-metallic); outline-offset: 3px`

---

## 11. Migration path: V4 → V5 tokens

### Phase 0 steps
1. Create `v5-tokens.css` with all `--v5-*` definitions
2. Add compatibility layer:
   ```css
   --v4-obsidian: var(--v5-obsidian);
   /* … map all v4 → v5 … */
   ```
3. Import order in `globals.css`:
   ```
   tokens.css → v5-tokens.css → (deprecated v4-tokens.css aliases) → design-system.css
   ```
4. Replace hardcoded `text-white`, `bg-black` in touched files
5. Update utilities `.v4-*` → `.v5-*` (keep `.v4-*` aliases one release)

### Files to touch (Phase 0)
- `apps/web/src/app/globals.css`
- `apps/web/src/brand/design-system/v5-tokens.css` (new)
- `apps/web/src/brand/primitives/glass-panel.tsx`
- `docs/v4/05-DESIGN-SYSTEM.md` (add superseded notice)

---

## 12. Stitch / Figma workflow notes

See `08-STITCH-FIGMA-WORKFLOW.md` for handoff pipeline.

**Design token export:** Figma variables should mirror Section 2 hex values exactly. Name: `V5/Color/Obsidian`, etc.

**Component parity:** Figma components map to Tier 1–5 code components — not page screenshots.

---

## 13. Usage rules (constitution)

1. Build chapters with `.v5-section` + editorial type utilities
2. Gold = light/emphasis — never body paragraphs
3. Prefer liquid glass over flat cards on marketing surfaces
4. Wrap atmospheric sections in `.v5-dune-glow` + optional `.v5-grain`
5. Never hardcode hex in components — reference tokens
6. No pure black/white sections — warm scrims only
7. One primary gold CTA per chapter
8. World portals always show atmosphere swatch + Enter affordance
