# Glitz Events V5 — Stitch + Figma Enterprise Workflow

> Optional but valuable asset handoff pipeline for the Cinematic Event Universe.  
> **Existing code:** `apps/web/src/lib/stitch/*` (parse, load-screen, exports)  
> **Design spec:** `docs/v5/05-DESIGN-SYSTEM.md`, `docs/v5/04-WIREFRAMES.md`

---

## 1. Purpose

Bridge **design intent** (Figma Enterprise + Google Stitch exports) and **implementation** (Next.js brand layer) without reintroducing template-style full-page HTML dumps.

**Goal:** Designers own atmosphere, type specimens, and portal cards in Figma; engineers map to V5 tokens and React primitives — never paste Stitch HTML wholesale.

---

## 2. Tool roles

| Tool | Role in V5 |
|------|------------|
| **Figma Enterprise** | Source of truth for tokens, components, chapter layouts, motion storyboards |
| **Google Stitch** | Rapid screen exploration → export reference HTML/screenshots |
| **Codebase** | `v5-tokens.css`, `brand/primitives`, `brand/sections` — canonical implementation |
| **Figma MCP** (Cursor plugin) | Design-to-code context, Code Connect mapping (optional) |

---

## 3. Workflow overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│ Figma V5    │────►│ Design QA    │────►│ Code Connect /  │────►│ React chapter│
│ library     │     │ vs tokens    │     │ implementation  │     │ in apps/web  │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────┘
       ▲                    │
       │                    │
┌─────────────┐     ┌──────────────┐
│ Stitch      │────►│ Reference    │
│ exploration │     │ only — parse │
└─────────────┘     └──────────────┘
```

---

## 4. Figma file structure (recommended)

```
Glitz V5 — Cinematic Event Universe
├── 🎨 Design Tokens
│   ├── Colors (V5 Dune Glow scalars)
│   ├── Typography (editorial scale)
│   ├── Spacing & Grid
│   ├── Motion (duration/easing annotations)
│   └── Adaptive (adaptive-* swatches)
├── 🧱 Components
│   ├── Primitives (Button, GlassPanel, PortalCard, ChapterHeader)
│   ├── Shell (UniverseNav, Footer, FAB)
│   └── Motion notes (loader storyboard frames)
├── 🌍 Worlds
│   ├── Wedding World atmosphere
│   ├── Corporate World
│   └── …
├── 📖 Chapters
│   ├── Home 1–9
│   ├── Services template
│   ├── Portfolio Netflix
│   ├── Event Architect 5 steps
│   └── AI Oracle
└── 📱 Responsive
    ├── Mobile
    └── Desktop
```

**Naming convention:** Match code tiers — `Primitive/GlassPanel/Liquid`, `Chapter/Home/03-Worlds`.

---

## 5. Token sync (Figma → CSS)

### 5.1 Variable naming

| Figma variable | CSS token |
|----------------|-----------|
| `V5/Color/Obsidian` | `--v5-obsidian` |
| `V5/Color/Champagne` | `--v5-champagne` |
| `V5/Color/Gold Luxury` | `--v5-gold-luxury` |
| `V5/Type/Display` | `--v5-text-display` |
| `V5/Motion/Duration/Slow` | `--v5-dur-slow` |

### 5.2 Export methods
1. **Manual** (Phase 0): copy hex/clamp from Figma → `v5-tokens.css`
2. **Figma Tokens plugin** → JSON → transform script (Phase 12 optional)
3. **Design Tokens W3C format** → Style Dictionary (future)

**Rule:** Figma and CSS hex values must match exactly — audit in Phase 11.

---

## 6. Google Stitch workflow

### 6.1 When to use Stitch
- Exploratory layouts for new chapters (Worlds grid, Netflix row)
- Quick client/stakeholder visual reviews
- **Not** for production HTML injection

### 6.2 Stitch → codebase handoff

1. Export screen from Stitch → save to `lib/stitch/exports/{chapter}.html`
2. Run sanitization awareness — existing `parse.ts` strips:
   - `particleCanvas` scripts
   - inline `<script>` blocks
   - clashing font imports
3. Designer delivers **screenshot + spacing annotations** alongside HTML
4. Engineer implements using:
   - `PortalCard`, `GlassPanel`, `ChapterHeader`
   - `v5-*` utilities — **no** raw Stitch class names in production

### 6.3 Stitch load-screen utility

`lib/stitch/load-screen.ts` — legacy helper for HTML fragments. **V5 policy:** deprecate for full-page loads; use only for extracting asset URLs or copy blocks during migration.

---

## 7. Figma → code implementation (design-to-code)

When using Figma MCP (`get_design_context`):

1. Pull design context for specific node (e.g., Home Ch.3 Worlds)
2. Map suggested components to codebase primitives:

| Figma intent | Code component |
|--------------|----------------|
| Liquid glass panel | `<GlassPanel variant="liquid">` |
| World portal tile | `<PortalCard world="wedding">` |
| Display headline | `.v5-hero-display` + Playfair |
| Kicker | `.v5-kicker` + Cinzel |
| Gold hairline | `.v5-hairline` |

3. Replace absolute positioning with brand grid (`.brand-container`, asymmetric cols)
4. Replace raw hex with CSS variables
5. Add motion via `ScrollReveal` / spec in `06-MOTION-SYSTEM.md`

**Never** ship Figma MCP output verbatim — it is reference only.

---

## 8. Code Connect (optional, Phase 10+)

Map Figma components to React for Dev Mode:

```
figma/
  PortalCard.figma.tsx      → brand/primitives/portal-card.tsx
  GlassPanel.figma.tsx      → brand/primitives/glass-panel.tsx
  ChapterHeader.figma.tsx   → brand/primitives/chapter-header.tsx
```

Use Figma MCP `add_code_connect_map` when enterprise Code Connect enabled.

---

## 9. Asset export specifications

| Asset type | Format | Max size | Location |
|------------|--------|----------|----------|
| Hero / world frames | WebP | 200kb | `public/assets/v5/` or Cloudinary |
| Loader montage | WebP 1280×720 | 150kb each | `public/assets/v5/loader/` |
| Portfolio loops | WebP/video MP4 | 500kb | CDN |
| Press logos | SVG | — | `public/assets/press/` |
| Grain overlay | PNG 512 tile | 20kb | `public/assets/v5/grain.png` |

**Cloudinary:** Use existing integration + transformation skill for responsive delivery.

---

## 10. Review checkpoints

### Design QA (before dev handoff)
- [ ] No pure #000 / #FFF fills in Figma frames
- [ ] Type scale uses V5 clamp specimens
- [ ] One primary CTA per chapter frame
- [ ] World atmospheres visually distinct
- [ ] Mobile frame exists for every chapter

### Code QA (before merge)
- [ ] Visual diff vs Figma within acceptable luxury tolerance (not pixel-perfect — motion adds life)
- [ ] Tokens only — no hardcoded hex
- [ ] Reduced-motion screenshot pass
- [ ] Lighthouse no regression

---

## 11. Collaboration rituals

| Ritual | Frequency | Output |
|--------|-----------|--------|
| Token sync | Phase 0, then monthly | Updated `v5-tokens.css` |
| Chapter review | Per phase | Signed-off Figma frame → PR link |
| Motion storyboard | Phase 1, 4, 6 | Figma prototype or frame sequence → GSAP spec |
| Stitch archive | As needed | `exports/` reference only |

---

## 12. Anti-patterns in handoff

| Don't | Do |
|-------|-----|
| Paste Stitch HTML into `page.tsx` | Compose React from primitives |
| Design in isolation from tokens | Use Figma variables linked to V5 |
| Export 4MB PNG heroes | WebP + Cloudinary transforms |
| Per-page custom colors | World presets + adaptive engine |
| Ignore motion spec | Annotate Figma with easing/duration |

---

## 13. Quick start checklist (new designer)

1. Request access to Figma V5 library + read `05-DESIGN-SYSTEM.md`
2. Duplicate chapter frame — do not create ad-hoc colors
3. Prototype motion in Figma Smart Animate **or** annotate using `06-MOTION-SYSTEM.md` durations
4. Export assets to spec (Section 9)
5. Open handoff issue listing: route, chapter #, Figma node URL, motion notes
6. Engineer maps to phase in `07-IMPLEMENTATION-ROADMAP.md`

---

## 14. Related files in repo

```
apps/web/src/lib/stitch/parse.ts
apps/web/src/lib/stitch/load-screen.ts
apps/web/src/lib/stitch/exports/home.html          (legacy — do not extend)
apps/web/src/brand/design-system/v5-tokens.css     (Phase 0)
docs/v5/04-WIREFRAMES.md
docs/v5/05-DESIGN-SYSTEM.md
docs/v5/06-MOTION-SYSTEM.md
```

This workflow keeps Glitz V5 **designed like a universe** and **built like a system** — not stitched together like a template.
