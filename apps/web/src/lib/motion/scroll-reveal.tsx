"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  reveal,
  revealLeft,
  revealRight,
  fade,
  scaleIn,
  viewportOnce,
} from "./variants";

const PRESETS = {
  reveal,
  left: revealLeft,
  right: revealRight,
  fade,
  scale: scaleIn,
} satisfies Record<string, Variants>;

const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  span: motion.span,
  p: motion.p,
} as const;

export type RevealPreset = keyof typeof PRESETS;
export type RevealTag = keyof typeof TAGS;

interface ScrollRevealProps {
  children: ReactNode;
  /** Reveal grammar preset. Default `reveal`. */
  preset?: RevealPreset;
  /** Extra delay in seconds applied to this element's transition. */
  delay?: number;
  /** Render element. Default `div`. */
  as?: RevealTag;
  className?: string;
  /** Re-trigger on every entry. Default once. */
  once?: boolean;
  /** Visibility amount [0..1] before triggering. Default 0.25. */
  amount?: number;
}

/**
 * V4 scroll reveal wrapper. Plays a shared reveal preset when scrolled into
 * view. Fully respects reduced-motion (renders content with no animation).
 */
export function ScrollReveal({
  children,
  preset = "reveal",
  delay = 0,
  as = "div",
  className,
  once = true,
  amount,
}: ScrollRevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = TAGS[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={PRESETS[preset]}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewportOnce, once, ...(amount != null ? { amount } : {}) }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}
