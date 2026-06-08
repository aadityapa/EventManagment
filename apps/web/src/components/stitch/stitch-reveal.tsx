"use client";

import { motion } from "framer-motion";
import { stitchTransition, stitchVariants, stitchViewport } from "@/lib/stitch/motion";
import { cn } from "@/lib/utils";

type Variant = keyof typeof stitchVariants;

interface StitchRevealProps {
  variant?: Variant;
  delay?: number;
  className?: string;
  children?: React.ReactNode;
}

export function StitchReveal({
  variant = "fadeUp",
  delay = 0,
  className,
  children,
}: StitchRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={stitchViewport}
      variants={stitchVariants[variant]}
      transition={{ ...stitchTransition, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
