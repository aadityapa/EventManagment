/**
 * Glitz V4 — Motion easing & timing grammar.
 * Single source of truth shared by Framer Motion, GSAP, and CSS (--v4-ease-*).
 * Keep in sync with brand/design-system/v4-tokens.css.
 */

/** Framer Motion cubic-bezier tuples. */
export const EASE = {
  /** Signature expo-out reveal. */
  luxe: [0.22, 1, 0.36, 1],
  /** Soft settle. */
  silk: [0.16, 1, 0.3, 1],
  /** Cinematic in-out for scenes / pinned sections. */
  drama: [0.85, 0, 0.15, 1],
  /** Threshold crossing — portal transitions. */
  portal: [0.76, 0, 0.24, 1],
  /** Utility out. */
  out: [0.33, 1, 0.68, 1],
} as const satisfies Record<string, [number, number, number, number]>;

/** GSAP easing strings that match the curves above. */
export const GSAP_EASE = {
  luxe: "power3.out",
  silk: "expo.out",
  drama: "power4.inOut",
  portal: "power3.inOut",
  out: "power2.out",
} as const;

/** Duration scale (seconds). */
export const DUR = {
  instant: 0.15,
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  cinematic: 1.2,
  epic: 1.8,
} as const;

/** Stagger steps (seconds). */
export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
  word: 0.06,
} as const;

export type EaseName = keyof typeof EASE;
