/**
 * Glitz V4 — Reusable Framer Motion variants.
 * Authored reveal grammar so every section feels directed by one hand.
 */
import type { Variants } from "framer-motion";
import { DUR, EASE, STAGGER } from "./easing";

/** Fade + rise. The default V4 reveal. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE.luxe },
  },
};

/** Subtle fade, no movement (for images / large media). */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.cinematic, ease: EASE.silk } },
};

/** Slide from a side — pass via custom or use directional helpers below. */
export const revealLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: DUR.slow, ease: EASE.luxe } },
};

export const revealRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: DUR.slow, ease: EASE.luxe } },
};

/** Scale-in for cards / glass surfaces. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: DUR.base, ease: EASE.luxe } },
};

/** Parent that staggers children. Use with `reveal`/`maskChild` items. */
export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.base, delayChildren: 0.15 },
  },
};

export const staggerParentTight: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.tight, delayChildren: 0.1 },
  },
};

/**
 * Word/line mask reveal. Wrap each word in an `overflow-hidden` span and
 * apply this to an inner span. Produces the LV-style rise-from-mask effect.
 */
export const maskChild: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: DUR.slow, ease: EASE.luxe } },
};

/** Generic item for stagger parents. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE.luxe } },
};

/** Standfirst line mask reveal. */
export const maskLine: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { duration: DUR.slow, ease: EASE.luxe } },
};

/** Portal card hover mount. */
export const portalCard: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DUR.base, ease: EASE.portal },
  },
};

/** Default viewport config for whileInView reveals. */
export const viewportOnce = { once: true, amount: 0.25 } as const;
