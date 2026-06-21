"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

interface ParallaxProps {
  children: ReactNode;
  /**
   * Travel distance in px across the scroll range. Positive = element moves
   * down slower than scroll (recedes); negative = moves up faster (advances).
   * Default 80.
   */
  distance?: number;
  /** Shorthand depth layer — overrides distance when set. */
  layer?: "bg" | "mid" | "fg";
  /** Parallax axis. Default `y`. */
  axis?: "x" | "y";
  className?: string;
}

const LAYER_DISTANCE: Record<NonNullable<ParallaxProps["layer"]>, number> = {
  bg: 90,
  mid: 40,
  fg: -20,
};

/**
 * V4/V5 scroll-linked parallax layer. Maps the element's scroll progress through
 * the viewport to a translate offset, smoothed with a spring. Honours
 * reduced-motion by rendering a static layer.
 */
export function Parallax({
  children,
  distance,
  layer,
  axis = "y",
  className,
}: ParallaxProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const travel = distance ?? (layer ? LAYER_DISTANCE[layer] : 80);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [-travel, travel]);
  const value = useSpring(raw, { stiffness: 80, damping: 24, mass: 0.4 });

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={axis === "y" ? { y: value } : { x: value }}
    >
      {children}
    </motion.div>
  );
}
