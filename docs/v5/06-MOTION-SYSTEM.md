# Glitz Events V5 — Motion System

> **Spec only — no motion code in this session.**  
> **Evolution path:** extends `apps/web/src/lib/motion/` + `luxury-loader.tsx` + `cinematic-provider.tsx`  
> **Global rule:** *Nothing appears instantly. Everything reveals.*

---

## 1. Motion philosophy

V5 motion is **film direction**, not decoration. A single orchestrated grammar — shared easing, durations, stagger, and scene lifecycle — makes the entire universe feel authored by one creative director.

| Principle | Implementation |
|-----------|----------------|
| Nothing appears instantly | Minimum `DUR.fast` (0.3s) opacity/transform on all content mounts |
| Expensive calm | Expo-out curves; no bounce, elastic, or snap |
| Depth is scroll-native | Parallax layers recede/advance; pin only when narrative requires |
| Spectacle is tiered | Loader + hero = full FX; below-fold lazy |
| Respect the visitor | Full `prefers-reduced-motion` parity — content, not spectacle |

---

## 2. Stack & responsibilities

| Layer | Tool | Responsibility |
|-------|------|----------------|
| Smooth scroll | **Lenis** (`smooth-scroll-provider`) | Virtual scroll; disabled reduced-motion |
| Section choreography | **GSAP ScrollTrigger** | Pin, scrub, horizontal, counters |
| Component reveals | **Framer Motion** | `ScrollReveal`, variants, layout |
| Timelines | **GSAP** | Loader, hero word masks, portal curtains |
| 3D (bounded) | **R3F / Three** | Venue map pins, optional portal BG — not default |
| CSS | `--v5-ease-*`, `--v5-dur-*` | Static transitions, hovers |

**Integration:** On Lenis scroll → `ScrollTrigger.update()` (wire globally in Phase 0).

---

## 3. Easing curves

Extend `lib/motion/easing.ts` → add V5 aliases (keep V4 names as re-exports).

| Name | Cubic-bezier | GSAP | Feeling | Use |
|------|--------------|------|---------|-----|
| `luxe` | `0.22, 1, 0.36, 1` | `power3.out` | confident arrival | default reveals |
| `silk` | `0.16, 1, 0.3, 1` | `expo.out` | weightless settle | media fades |
| `drama` | `0.85, 0, 0.15, 1` | `power4.inOut` | scene in-out | curtains, pins |
| `portal` | `0.76, 0, 0.24, 1` | custom | threshold crossing | world transitions |
| `out` | `0.33, 1, 0.68, 1` | `power2.out` | UI hovers | buttons, chips |

CSS mirror: `--v5-ease-luxe`, `--v5-ease-silk`, `--v5-ease-drama`, `--v5-ease-portal`, `--v5-ease-out`

---

## 4. Duration & stagger scale

| Token | Seconds | Use |
|-------|---------|-----|
| `instant` | `0.15` | reduced-motion only |
| `fast` | `0.3` | hovers, micro |
| `base` | `0.6` | standard reveal |
| `slow` | `0.9` | sections, cards |
| `cinematic` | `1.2` | hero, loader beats |
| `epic` | `1.8` | portal curtain |

| Stagger | Seconds |
|---------|---------|
| `tight` | `0.04` |
| `base` | `0.08` |
| `loose` | `0.14` |
| `word` | `0.06` |

**Rule:** Display type uses `slow`/`cinematic`; lists use `base` stagger.

---

## 5. Global reveal orchestration

### 5.1 Scene director (NEW — Phase 0)

`lib/motion/scene-director.ts` — registers mount hooks:

```tsx
// Spec contract
registerScene(id, { onEnter, onExit, priority })
revealChildren(container, { preset: "reveal", stagger: "base" })
```

Every chapter view calls `revealChildren` on mount — **no unanimated DOM flashes**.

### 5.2 Default child reveal

| Preset | Transform | Opacity |
|--------|-----------|---------|
| `reveal` | `y: 36→0` | `0→1` |
| `fade` | — | `0→1` |
| `revealLeft` | `x: -48→0` | `0→1` |
| `revealRight` | `x: 48→0` | `0→1` |
| `scaleIn` | `scale: 0.96→1, y: 12→0` | `0→1` |
| `maskWord` | `y: 110%→0` | `0→1` |

Existing `variants.ts` presets preserved; add `maskLine` for standfirst.

---

## 6. ScrollTrigger patterns

### 6.1 Reveal (default)
Use `ScrollReveal` — `whileInView`, `once: true`, `amount: 0.2`

### 6.2 Pin + scrub (Portfolio row, Services vision)
```javascript
// Spec pattern
scrollTrigger: {
  trigger: section,
  pin: true,
  scrub: 1,
  start: "top top",
  end: "+=120%",
}
```

### 6.3 Horizontal scroll (Home ch.5, Portfolio rows)
Map `scrollY` → `xPercent` on inner track; `pin: true`

### 6.4 Counter scrub (Home difference stats)
`innerText` tween 0 → target over scrub range

### 6.5 Parallax depth layers

| Layer | distance | Direction |
|-------|----------|-----------|
| Background media | `+90` | same as scroll |
| Mid glass | `+40` | same |
| Foreground text | `-20` | opposite (advance) |

`<Parallax distance={n} axis="y">` — existing API; add `layer="bg|mid|fg"` shorthand Phase 0.

---

## 7. Loader — 6-scene timeline spec

**File target:** `components/effects/universe-loader.tsx` (evolve `luxury-loader.tsx`)

| Scene | Time (s) | Elements | Easing | Notes |
|-------|----------|----------|--------|-------|
| 1 Void | 0.0–1.2 | obsidian bg, sparse particles | silk fade in | Skip btn visible |
| 2 Thread | 1.2–2.4 | SVG gold path draw | drama | stroke-dashoffset |
| 3 Logo | 2.4–4.0 | logo mask, ring pulse, glow | luxe + scale | sound hook |
| 4 Montage | 4.0–6.0 | 4 world frames crossfade | fast cuts | preloaded images |
| 5 Tagline | 6.0–7.5 | word mask headline | word stagger | Cinzel kicker |
| 6 Curtain | 7.5–9.0 | curtain Y translate, handoff | drama | unlock Lenis |

**Skip:** Jump to scene 6 at ≥ scene 2.  
**Storage:** `sessionStorage glitz-v5-premiere-seen` (migrate from `glitz-loader-seen`).  
**A11y:** `role="dialog" aria-label="Site introduction" aria-live="polite"`

### Frame-by-frame (scene 4 montage)

| Cut | Frame | Duration |
|-----|-------|----------|
| 4a | Wedding world still | 0.35s |
| 4b | Corporate | 0.35s |
| 4c | Destination | 0.35s |
| 4d | Culture | 0.35s |

Crossfade overlap 0.1s.

---

## 8. Portal / world transition spec

Triggered on: Worlds mega-menu Enter, Home ch.3 portal click, world card CTAs.

```
Phase A (0–300ms):  Current view opacity 1→0, y 0→-8px (luxe)
Phase B (300–700ms): Full-screen obsidian curtain; gold hairline sweep L→R (portal ease)
Phase C (700–900ms): Set data-world on html; apply adaptive preset
Phase D (900–1400ms): Destination hero opacity 0→1, y 24→0; stagger children 80ms
```

**Reduced motion:** `router.push` instant, preset swap only.

**Component:** `PortalTransition` wrapper in universe shell (Phase 4).

---

## 9. Page transition / curtain spec

For standard route changes (non-portal):

```
Outgoing (300ms luxe): opacity 1→0
Curtain (400ms drama): top gold line → expands to full obsidian wipe
Incoming (500ms luxe): opacity 0→1, optional layoutId on shared logo
```

**Implementation options (Phase 4):**
1. Next.js View Transitions API (preferred if stable in Next 16.2)
2. Framer `AnimatePresence` layout shell fallback

**Exclude:** `/dashboard*`, `/admin`, `/api/*`

---

## 10. Hover & micro-interactions

| Element | Motion |
|---------|--------|
| Primary CTA | magnetic pull ±4px; scale 1.03; gold sheen sweep 400ms |
| Portal card | y -6px; glow bloom; border gold intensify |
| Netflix thumb | scale 1.05; preview fade in 300ms |
| Nav link | underline hairline draw L→R |
| Theme toggle | rotate 180° silk |

All hovers disabled when `(prefers-reduced-motion: reduce)`.

---

## 11. Reduced motion strategy

| System | Reduced behavior |
|--------|------------------|
| Loader | Skip to content; announce welcome |
| Lenis | Disabled — native scroll |
| ScrollReveal | Instant visible (`instant` duration) |
| Parallax | Static position |
| GSAP pin/scrub | Unpinned static layout |
| Portal/page transitions | Instant route change |
| Autoplay previews | Poster frame only |
| Particles / Three | Not mounted |

**CSS:** `@media (prefers-reduced-motion: reduce)` zeroes `--v5-dur-*` atmosphere animations (extend V4 guard).

**Test matrix:** Windows/macOS/iOS reduced motion toggles; ensure booking wizard fully operable.

---

## 12. Three.js / R3F / Spline boundaries

### Use 3D when
- Venue Universe map with glowing pins (Phase 7) — **optional** enhancement
- Portal background subtle depth mesh (Phase 4) — low poly, lazy
- Loader scene 1 particle field **if** CSS particles insufficient

### Do NOT use 3D for
- Text, buttons, cards (CSS glass)
- Section backgrounds replaceable with parallax images
- Mobile first paint (defer until interaction or `md+`)

### Existing code
- `components/three/hero-three-canvas.tsx` — Sparkles; **disable by default in V5 hero** (CSS particles sufficient); enable on desktop opt-in
- `gold-particles.tsx` — canvas 2D; prefer for hero FX

### Spline
- Not in dependency tree; **do not add** unless design delivers `.splinecode` assets with perf budget sign-off

### Performance caps
- Max 1 WebGL context per page
- `<Canvas dpr={[1, 1.5]} frameloop="demand">`
- Unmount on route leave

---

## 13. Evolution path from V4 `lib/motion/`

| V4 file | V5 action |
|---------|-----------|
| `easing.ts` | Add `portal`, `epic`; export `--v5-*` mirror |
| `variants.ts` | Add `maskLine`, `portalCard` |
| `scroll-reveal.tsx` | Default `delay` min 0.05; integrate scene director |
| `parallax.tsx` | Add `layer` preset |
| `index.ts` | Export `SceneDirector`, `PortalTransition` |
| **NEW** `scene-director.ts` | Global reveal registry |
| **NEW** `portal-transition.tsx` | World transition |
| **NEW** `page-transition.tsx` | Route curtain |
| **NEW** `use-lenis-scroll-trigger.ts` | Lenis ↔ GSAP sync |

---

## 14. Loader ↔ cinematic provider contract

`cinematic-provider.tsx` orchestrates:

```
1. Mount UniverseLoader (if !sessionStorage seen)
2. onComplete → setDone(true) → enable SmoothScrollProvider children
3. Block body scroll during loader (overflow hidden)
4. Pass `onSkip` analytics event
```

Phase 1 deliverable.

---

## 15. Analytics hooks (motion)

| Event | Trigger |
|-------|---------|
| `premiere_complete` | Loader scene 6 done |
| `premiere_skip` | Skip clicked |
| `portal_enter` | World transition Phase D |
| `chapter_reveal` | Each home chapter 50% in view |

Use existing `lib/analytics.ts` patterns.

---

## 16. Usage cheatsheet (post-implementation)

```tsx
import {
  ScrollReveal,
  Parallax,
  SceneDirector,
  EASE,
  DUR,
  staggerParent,
  staggerItem,
} from "@/lib/motion";

// Chapter mount
useEffect(() => { revealChildren(ref.current, { preset: "reveal" }); }, []);

// Portal
<PortalTransition world="wedding" href="/services/wedding-planning">…</PortalTransition>

// Pinned row (GSAP — services/portfolio only)
useGsapContext(ref, () => { /* pin spec 6.2 */ });
```

---

## 17. Performance budget (motion-specific)

| Metric | Budget |
|--------|--------|
| Loader JS | < 45kb gzip (GSAP already shared) |
| ScrollTrigger instances per page | < 8 |
| Simultaneous Framer springs | < 12 |
| `will-change` | Apply only during active animation; remove after |
| Main thread long tasks | < 50ms during scroll (INP) |

Lazy-load GSAP ScrollTrigger plugin only on pages that pin (dynamic import in Phase 3+).
