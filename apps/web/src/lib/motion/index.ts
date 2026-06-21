/**
 * Glitz V4 — Motion system barrel.
 * Shared easing, variants, and scroll primitives for the whole app.
 */
export { EASE, GSAP_EASE, DUR, STAGGER, type EaseName } from "./easing";
export {
  reveal,
  fade,
  revealLeft,
  revealRight,
  scaleIn,
  staggerParent,
  staggerParentTight,
  staggerItem,
  maskChild,
  viewportOnce,
} from "./variants";
export { ScrollReveal, type RevealPreset, type RevealTag } from "./scroll-reveal";
export { Parallax } from "./parallax";
