"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BRAND_LOGO_ASSETS } from "@/components/branding/logo";
import { trackEvent } from "@/lib/analytics";
import { SITE_CONFIG } from "@/lib/constants";
import { EASE } from "@/lib/motion";

export const LOADER_STORAGE_KEY = "glitz-v6-premiere-seen";
const LEGACY_LOADER_KEY = "glitz-loader-seen";

export function hasSeenPremiere() {
  if (typeof window === "undefined") return false;
  return (
    sessionStorage.getItem(LOADER_STORAGE_KEY) === "1" ||
    sessionStorage.getItem(LEGACY_LOADER_KEY) === "1"
  );
}

type Props = {
  onComplete: () => void;
  onSkip?: () => void;
};

const PARTICLE_COUNT = 36;

function GoldParticles() {
  const reducedMotion = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 10 + Math.random() * 8,
        delay: Math.random() * 1.5,
      })),
    []
  );

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(212,175,55,${0.35 + Math.random() * 0.4}), transparent)`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.65, 0.45, 0.65],
            y: [0, -18, 0],
            x: [0, (Math.random() - 0.5) * 14, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0 },
            y: { duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay },
            x: { duration: p.duration * 1.2, repeat: Infinity, ease: "easeInOut", delay: p.delay },
          }}
        />
      ))}
    </div>
  );
}

export function useLoaderSound() {
  return () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("glitz:loader-sound-ready"));
    }
  };
}

/** Cinematic intro — particles 0s, logo 0.5s, tagline 1.0s, dissolve 1.5s */
export function UniverseLoader({ onComplete, onSkip }: Props) {
  const reducedMotion = useReducedMotion();
  const [dissolving, setDissolving] = useState(false);

  const finish = useCallback(() => {
    sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
    sessionStorage.setItem(LEGACY_LOADER_KEY, "1");
    trackEvent("premiere_complete");
    onComplete();
  }, [onComplete]);

  const skip = useCallback(() => {
    trackEvent("premiere_skip");
    onSkip?.();
    setDissolving(true);
  }, [onSkip]);

  useEffect(() => {
    if (reducedMotion) {
      sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
      onComplete();
      return;
    }
    const dissolveTimer = window.setTimeout(() => setDissolving(true), 1500);
    return () => window.clearTimeout(dissolveTimer);
  }, [reducedMotion, onComplete]);

  if (reducedMotion) return null;

  return (
    <motion.div
      role="dialog"
      aria-label="Welcome to Nexyyra Events"
      aria-live="polite"
      aria-busy={!dissolving}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: dissolving ? 0 : 1 }}
      transition={{ duration: 0.55, ease: EASE.silk }}
      onAnimationComplete={() => {
        if (dissolving) finish();
      }}
    >
      <p className="sr-only">Welcome to {SITE_CONFIG.name}</p>

      <button
        type="button"
        onClick={skip}
        className="absolute right-4 top-4 z-[110] min-h-[44px] rounded-full border border-[var(--gold)]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)] transition-colors hover:border-[var(--gold)] hover:text-[#fff8eb] sm:right-6 sm:top-6"
      >
        Skip
      </button>

      <GoldParticles />

      <div className="relative z-[2] flex max-w-[min(92vw,420px)] flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.75, ease: EASE.luxe, delay: 0.5 }}
          className="mb-6 w-full overflow-visible"
        >
          <Image
            src={BRAND_LOGO_ASSETS.gold}
            alt={SITE_CONFIG.name}
            width={440}
            height={160}
            priority
            fetchPriority="high"
            quality={100}
            className="mx-auto max-h-[clamp(120px,28vw,200px)] w-auto max-w-full object-contain"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE.silk, delay: 0.85 }}
          className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--gold)]"
        >
          NEXYYRA EVENTS
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20, letterSpacing: "0.14em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.26em" }}
          transition={{ duration: 0.6, ease: EASE.luxe, delay: 1.0 }}
          className="font-[family-name:var(--font-playfair)] text-[clamp(0.75rem,2.8vw,1.125rem)] font-medium uppercase text-[#fff8eb]"
        >
          The Next Era of Celebrations
        </motion.h2>
      </div>
    </motion.div>
  );
}

export const LuxuryLoader = UniverseLoader;
