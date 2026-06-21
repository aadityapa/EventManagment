"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BRAND_LOGO_ASSETS } from "@/components/branding/logo";
import { SITE_CONFIG } from "@/lib/constants";
import { EASE } from "@/lib/motion";

const TAGLINE = "THE NEXT ERA OF CELEBRATIONS";

type Props = {
  className?: string;
  /** Delay before animations start (e.g. after intro loader) */
  delay?: number;
};

/** Hero brand mark — logo blur/scale reveal + tagline letter-spacing expansion */
export function HeroBrandReveal({ className, delay = 0 }: Props) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={className}>
        <Image
          src={BRAND_LOGO_ASSETS.gold}
          alt={SITE_CONFIG.name}
          width={440}
          height={160}
          priority
          fetchPriority="high"
          className="brand-logo__full hero-brand-logo max-w-[min(100%,280px)]"
        />
        <p className="hero-brand-tagline mt-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--hero-muted)]">
          {TAGLINE}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <motion.div
        data-hero-logo
        initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: EASE.luxe, delay }}
        className="overflow-visible"
      >
        <Image
          src={BRAND_LOGO_ASSETS.gold}
          alt={SITE_CONFIG.name}
          width={440}
          height={160}
          priority
          fetchPriority="high"
          sizes="(max-width: 640px) 200px, 280px"
          quality={100}
          className="brand-logo__full hero-brand-logo max-w-[min(100%,280px)]"
        />
      </motion.div>

      <motion.p
        data-hero-tagline
        initial={{ opacity: 0, y: 30, letterSpacing: "0.12em" }}
        animate={{ opacity: 1, y: 0, letterSpacing: "0.28em" }}
        transition={{ duration: 0.85, ease: EASE.luxe, delay: delay + 0.3 }}
        className="hero-brand-tagline mt-4 text-[10px] font-semibold uppercase text-[var(--hero-muted)] sm:text-[11px]"
      >
        {TAGLINE}
      </motion.p>
    </div>
  );
}

export { TAGLINE as HERO_BRAND_TAGLINE };
