# Glitz Events V4 — Motion Architecture

> Implemented in `apps/web/src/lib/motion/`. One grammar, applied everywhere, so the site feels authored — not animated. Shared with CSS via `--v4-ease-*` / `--v4-dur-*`.

## 1. Motion philosophy
Motion is **choreography, not decoration**. Every reveal uses the same easing family and timing scale. Nothing bounces, nothing is fast-and-flashy. The feeling is **expensive calm**: things arrive with weight and settle.

## 2. Easing curves (`lib/motion/easing.ts`)
| Name | Cubic-bezier | Feeling | Use |
|------|--------------|---------|-----|
| `luxe` | `0.22, 1, 0.36, 1` | confident expo-out | default reveals, hero words |
| `silk` | `0.16, 1, 0.3, 1` | soft, weightless settle | image fades, large media |
| `drama` | `0.85, 0, 0.15, 1` | cinematic in-out | pinned scenes, transitions |
| `out` | `0.33, 1, 0.68, 1` | neutral | small UI, hovers |

GSAP equivalents in `GSAP_EASE` (`power3.out`, `expo.out`, `power4.inOut`, `power2.out`). CSS equivalents in `--v4-ease-*`.

## 3. Duration & stagger
- `DUR`: `fast 0.3` · `base 0.6` · `slow 0.9` · `cinematic 1.2` (seconds).
- `STAGGER`: `tight 0.05` · `base 0.08` · `loose 0.14`.
- Rule of thumb: hero/display = `slow`/`cinematic`; UI/hover = `fast`/`base`.

## 4. Variants (`lib/motion/variants.ts`)
| Variant | Effect |
|---------|--------|
| `reveal` | fade + rise 36px (the default) |
| `fade` | opacity only (cinematic, for media) |
| `revealLeft` / `revealRight` | directional slide-in |
| `scaleIn` | 0.96→1 scale + rise (cards, glass) |
| `staggerParent` / `staggerParentTight` | orchestrate children |
| `staggerItem` | child item |
| `maskChild` | y `110%`→`0%` for word/line **mask reveals** (LV-style) |
| `viewportOnce` | shared `{ once, amount: 0.25 }` viewport config |

## 5. Scroll choreography (Lenis + GSAP ScrollTrigger)
- **Lenis** (`smooth-scroll-provider`) provides the smooth virtual scroll. Already reduced-motion guarded.
- **GSAP ScrollTrigger** (`lib/gsap/use-gsap`) drives section-level choreography: pinned scenes, scrubbed timelines, horizontal scroll, counters.
- **Pattern — reveal:** prefer the declarative `ScrollReveal` (Framer `whileInView`) for simple section reveals. Use ScrollTrigger only when you need pinning/scrub/horizontal.
- **Pattern — pin/scrub (future Portfolio, Services signature):** `ScrollTrigger` with `pin: true`, `scrub: 1`, `end: "+=100%"`, mapping vertical scroll to horizontal `xPercent`.
- **Integration note:** when both run, call `ScrollTrigger.update` on Lenis `scroll` (to add in later sessions when pinned sections land; current sections don't need it).

## 6. Reveal patterns
1. **Word mask reveal** (hero): split headline into words, each in `overflow-hidden` span, inner span uses `maskChild` with `STAGGER.base`. GSAP timeline alternative used in the hero proof for precise sequencing.
2. **Section reveal**: wrap blocks in `<ScrollReveal preset="reveal" />`; stagger siblings with incremental `delay`.
3. **Editorial split**: text column `left`, media column `right`/`fade`, with `Parallax` on the media.

## 7. Parallax & depth (`lib/motion/parallax.tsx`)
- `<Parallax distance={n} axis="y|x">` maps element scroll-progress (`useScroll` offset `start end → end start`) to a spring-smoothed translate.
- Depth recipe: background layer `distance` larger + same direction (recedes), foreground glass card `distance` negative (advances) → 3D separation.
- Hero uses **mouse parallax** (Framer `useSpring`/`useTransform`) on bg + FX layers for live depth.

## 8. Hover micro-interactions
- Buttons: magnetic pull (`MagneticButton`) + `whileHover` scale `1.03`, `y: -1`, `out` easing, `fast` duration; gold sheen sweep.
- Cards/links: hairline + lift (`translateY(-4px)`), gold border bloom, `luxe` easing.
- Keep transforms GPU-friendly (`transform`/`opacity` only).

## 9. Page transitions (roadmap)
- Adopt a curtain/shared-element transition using Next.js view transitions or a Framer `AnimatePresence` layout shell in a later session. Not in this foundation session, but easing/duration tokens are ready (`drama`, `cinematic`).

## 10. Reduced-motion strategy (mandatory)
- `ScrollReveal` and `Parallax` short-circuit to static render when `useReducedMotion()` is true.
- Hero GSAP timeline is skipped under `prefers-reduced-motion` (content shown immediately, static frame).
- CSS atmosphere animations neutralised via the existing global `@media (prefers-reduced-motion: reduce)` block + `v4-tokens.css` guard.
- Lenis disabled under reduced-motion (existing behavior).
- **Result:** full feature/content parity; only the spectacle is removed.

## 11. Performance budget
- Animate only `transform` / `opacity`.
- Lazy the heavy FX (particles, Three) below/within hero; tier hydration.
- Use `once: true` viewports to avoid repeated work.
- Springs over long `requestAnimationFrame` loops where possible.

## 12. Usage cheatsheet
```tsx
import { ScrollReveal, Parallax, EASE, DUR, maskChild, staggerParent } from "@/lib/motion";

// Simple section reveal
<ScrollReveal preset="reveal">…</ScrollReveal>

// Staggered list
<motion.ul variants={staggerParent} initial="hidden" whileInView="visible">
  <motion.li variants={staggerItem}>…</motion.li>
</motion.ul>

// Parallax media
<Parallax distance={90}><Image … /></Parallax>
```
