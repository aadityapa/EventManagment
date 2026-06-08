"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { stitchStagger, stitchTransition, stitchViewport } from "@/lib/stitch/motion";
import { cn } from "@/lib/utils";

interface StitchSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
}

export function StitchSection({ children, className, id, dark = false }: StitchSectionProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={stitchViewport}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stitchStagger } },
      }}
      className={cn(
        "relative py-14 sm:py-20 md:py-28",
        dark && "bg-[#f0ebe3]",
        className
      )}
    >
      {children}
    </motion.section>
  );
}

export function StitchSectionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={stitchTransition}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
