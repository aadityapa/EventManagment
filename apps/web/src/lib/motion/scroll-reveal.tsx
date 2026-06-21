"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import {
  reveal,
  revealLeft,
  revealRight,
  fade,
  scaleIn,
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
  /** Visibility amount [0..1] before triggering. Default 0.08. */
  amount?: number;
}

const VIEWPORT_MARGIN = "0px 0px -80px 0px";
const FALLBACK_MS = 2500;

/**
 * V4 scroll reveal wrapper. Plays a shared reveal preset when scrolled into
 * view. Falls back to visible after timeout so sections never stay blank.
 */
export function ScrollReveal({
  children,
  preset = "reveal",
  delay = 0,
  as = "div",
  className,
  once = true,
  amount = 0.08,
}: ScrollRevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount, margin: VIEWPORT_MARGIN });
  const [fallbackVisible, setFallbackVisible] = useState(false);

  useEffect(() => {
    if (reduced || inView) return;
    const timer = window.setTimeout(() => setFallbackVisible(true), FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [reduced, inView]);

  const visible = reduced || inView || fallbackVisible;
  const MotionTag = TAGS[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      ref={ref as never}
      className={className}
      variants={PRESETS[preset]}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}
