"use client";

import { motion } from "framer-motion";
import { GoldParticles } from "@/components/effects/gold-particles";
import { stitchTransition, stitchVariants } from "@/lib/stitch/motion";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHero({ title, subtitle, className, children }: PageHeroProps) {
  return (
    <section
      className={cn(
        "lux-inner-hero relative overflow-hidden border-b border-primary/10 bg-black py-14 sm:py-20 md:py-28",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
      <div className="lux-inner-hero__aura" aria-hidden />
      <GoldParticles className="pointer-events-none absolute inset-0 opacity-60" />

      <div className="container-page relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            variants={stitchVariants.lineGrow}
            transition={{ ...stitchTransition, duration: 1 }}
            className="mx-auto mb-6 h-px w-24 origin-center bg-gradient-to-r from-transparent via-primary to-transparent"
          />
          <motion.h1
            variants={stitchVariants.textReveal}
            transition={stitchTransition}
            className="lux-inner-hero__title"
          >
            <span>{title}</span>
          </motion.h1>
          {subtitle && (
            <motion.p
              variants={stitchVariants.fadeUp}
              transition={{ ...stitchTransition, delay: 0.1 }}
              className="mt-4 text-lg text-neutral-300 md:text-xl"
            >
              {subtitle}
            </motion.p>
          )}
          {children && (
            <motion.div variants={stitchVariants.fadeUp} transition={{ ...stitchTransition, delay: 0.2 }}>
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
