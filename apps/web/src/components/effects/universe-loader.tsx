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

/** Total premiere duration — particles → logo → tagline → zoom-out → handoff */
export const LOADER_DURATION_MS = 2500;
const ZOOM_OUT_AT_MS = 2000;

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
const TAGLINE = "THE NEXT ERA OF CELEBRATIONS";

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

/**
 * Luxury premiere loader — 2.5s Framer Motion sequence.
 * 0.0s particles · 0.5s logo · 1.5s tagline · 2.0s zoom-out · 2.5s handoff
 */
export function UniverseLoader({ onComplete, onSkip }: Props) {
  const reducedMotion = useReducedMotion();
  const [exiting, setExiting] = useState(false);

  const finish = useCallback(() => {
    sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
    sessionStorage.setItem(LEGACY_LOADER_KEY, "1");
    trackEvent("premiere_complete");
    onComplete();
  }, [onComplete]);

  const skip = useCallback(() => {
    trackEvent("premiere_skip");
    onSkip?.();
    setExiting(true);
    window.setTimeout(finish, 400);
  }, [onSkip, finish]);

  useEffect(() => {
    if (reducedMotion) {
      sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
      onComplete();
      return;
    }

    const zoomTimer = window.setTimeout(() => setExiting(true), ZOOM_OUT_AT_MS);
    const completeTimer = window.setTimeout(finish, LOADER_DURATION_MS);

    return () => {
      window.clearTimeout(zoomTimer);
      window.clearTimeout(completeTimer);
    };
  }, [reducedMotion, onComplete, finish]);

  if (reducedMotion) return null;

  return (
    <div
      role="dialog"
      aria-label="Welcome to Nexyyra Events"
      aria-live="polite"
      aria-busy={!exiting}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
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

      <motion.div
        className="relative z-[2] flex max-w-[min(92vw,420px)] flex-col items-center px-6 text-center"
        initial={{ scale: 1, opacity: 1 }}
        animate={exiting ? { scale: 0.75, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE.silk }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.4, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.75, ease: EASE.silk, delay: 0.5 }}
          className="mb-8 w-full overflow-visible"
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

        <motion.h2
          initial={{ opacity: 0, y: 16, letterSpacing: "0.18em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.28em" }}
          transition={{ duration: 0.65, ease: EASE.silk, delay: 1.5 }}
          className="font-[family-name:var(--font-playfair)] text-[clamp(0.6875rem,2.4vw,1rem)] font-medium uppercase text-[#fff8eb]"
        >
          {TAGLINE}
        </motion.h2>
      </motion.div>
    </div>
  );
}

export const LuxuryLoader = UniverseLoader;
