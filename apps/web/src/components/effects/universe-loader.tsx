"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BRAND_LOGO_ASSETS } from "@/components/branding/logo";
import { trackEvent } from "@/lib/analytics";
import { SITE_CONFIG } from "@/lib/constants";
import { EASE } from "@/lib/motion";

export const LOADER_STORAGE_KEY = "glitz-v6-premiere-seen";
const LEGACY_LOADER_KEY = "glitz-loader-seen";

/** First-visit cinematic intro — 5s luxury brand reveal */
export const LOADER_DURATION_MS = 5000;
export const LOADER_HANDOFF_MS = 4000;
export const LOADER_ZOOM_MS = 1000;

const BRAND_NAME = "NEXYYRA EVENTS";
const TAGLINE = "THE NEXT ERA OF CELEBRATIONS";
const CINEMATIC = EASE.silk;

export function hasSeenPremiere() {
  if (typeof window === "undefined") return false;
  return (
    sessionStorage.getItem(LOADER_STORAGE_KEY) === "1" ||
    sessionStorage.getItem(LEGACY_LOADER_KEY) === "1"
  );
}

type Props = {
  onHandoff: () => void;
  onComplete: () => void;
  onSkip?: () => void;
};

const PARTICLE_COUNT = 28;

function GoldDust({ dissolving, visible }: { dissolving: boolean; visible: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 3.5,
        duration: 14 + Math.random() * 10,
        delay: Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 20,
        alpha: 0.25 + Math.random() * 0.35,
      })),
    []
  );

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden transform-gpu"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={
        dissolving
          ? { opacity: 0, scale: 1.05 }
          : visible
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 1.1 }
      }
      transition={{ duration: dissolving ? 0.7 : 0.8, ease: CINEMATIC, delay: visible && !dissolving ? 0.5 : 0 }}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full transform-gpu will-change-transform"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(212,175,55,${p.alpha}), transparent 70%)`,
          }}
          animate={{
            opacity: dissolving ? 0 : [0.3, 0.7, 0.45, 0.65],
            y: dissolving ? -24 : [0, -12, 0],
            x: [0, p.drift * 0.3, 0],
          }}
          transition={{
            opacity: {
              duration: dissolving ? 0.55 : p.duration,
              repeat: dissolving ? 0 : Infinity,
              ease: "easeInOut",
              delay: p.delay,
            },
            y: {
              duration: dissolving ? 0.55 : p.duration,
              repeat: dissolving ? 0 : Infinity,
              ease: "easeInOut",
              delay: p.delay,
            },
            x: {
              duration: p.duration * 1.15,
              repeat: dissolving ? 0 : Infinity,
              ease: "easeInOut",
              delay: p.delay,
            },
          }}
        />
      ))}
    </motion.div>
  );
}

function TaglineLetters({ visible }: { visible: boolean }) {
  const letters = TAGLINE.split("");

  return (
    <motion.h2
      className="flex flex-wrap justify-center gap-x-[0.35em] font-[family-name:var(--font-playfair)] text-[clamp(0.625rem,2.2vw,0.9375rem)] font-medium uppercase text-[#fff8eb]/95"
      aria-label={TAGLINE}
    >
      {letters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block transform-gpu will-change-transform"
          initial={false}
          animate={
            visible
              ? { opacity: 1, y: 0, letterSpacing: "0.06em" }
              : { opacity: 0, y: 30, letterSpacing: "20px" }
          }
          transition={{
            duration: 0.55,
            ease: CINEMATIC,
            delay: visible ? i * 0.035 : 0,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h2>
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
 * Cinematic intro loader — 5s sequence:
 * 0s bg · 0.5s particles · 1.0s logo fade · 1.5s logo scale · 2.0s brand name
 * · 2.5s tagline · 3.0s gold glow · 4.0s zoom out · 5.0s reveal
 */
export function UniverseLoader({ onHandoff, onComplete, onSkip }: Props) {
  const reducedMotion = useReducedMotion();
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [particlesVisible, setParticlesVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [glowVisible, setGlowVisible] = useState(false);

  const persistSeen = useCallback(() => {
    sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
    sessionStorage.setItem(LEGACY_LOADER_KEY, "1");
  }, []);

  const finish = useCallback(() => {
    persistSeen();
    trackEvent("premiere_complete");
    setMounted(false);
    onComplete();
  }, [onComplete, persistSeen]);

  const skip = useCallback(() => {
    trackEvent("premiere_skip");
    onSkip?.();
    onHandoff();
    setExiting(true);
    window.setTimeout(finish, 320);
  }, [onSkip, onHandoff, finish]);

  useEffect(() => {
    if (reducedMotion) {
      persistSeen();
      onComplete();
      return;
    }

    const particlesTimer = window.setTimeout(() => setParticlesVisible(true), 500);
    const taglineTimer = window.setTimeout(() => setTaglineVisible(true), 2500);
    const glowTimer = window.setTimeout(() => setGlowVisible(true), 3000);

    const handoffTimer = window.setTimeout(() => {
      onHandoff();
      setExiting(true);
    }, LOADER_HANDOFF_MS);

    const completeTimer = window.setTimeout(finish, LOADER_DURATION_MS);

    return () => {
      window.clearTimeout(particlesTimer);
      window.clearTimeout(taglineTimer);
      window.clearTimeout(glowTimer);
      window.clearTimeout(handoffTimer);
      window.clearTimeout(completeTimer);
    };
  }, [reducedMotion, onHandoff, onComplete, finish, persistSeen]);

  if (reducedMotion) return null;

  return (
    <AnimatePresence mode="wait">
      {mounted && (
        <motion.div
          key="cinematic-intro-v2"
          role="dialog"
          aria-label="Welcome to Nexyyra Events"
          aria-live="polite"
          aria-busy={!exiting}
          className="premiere-loader fixed inset-0 z-[99999] flex items-center justify-center bg-black transform-gpu"
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: 0.65, ease: CINEMATIC }}
        >
          <p className="sr-only">Welcome to {SITE_CONFIG.name}</p>

          <button
            type="button"
            onClick={skip}
            className="absolute right-4 top-4 z-[10] min-h-[44px] rounded-full border border-[var(--gold)]/35 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]/90 transition-colors hover:border-[var(--gold)] hover:text-[#fff8eb] sm:right-6"
          >
            Skip
          </button>

          <GoldDust dissolving={exiting} visible={particlesVisible} />

          <motion.div
            className="relative z-[2] flex max-w-[min(92vw,480px)] flex-col items-center px-6 text-center transform-gpu will-change-transform"
            initial={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            animate={
              exiting
                ? { scale: 1.25, opacity: 0, filter: "blur(12px)" }
                : { scale: 1, opacity: 1, filter: "blur(0px)" }
            }
            transition={{ duration: LOADER_ZOOM_MS / 1000, ease: CINEMATIC, delay: exiting ? 0 : 0 }}
          >
            {/* 1.0s logo fade in · 1.5s scale settle */}
            <motion.div
              className="relative z-[3] mb-6 w-full overflow-visible transform-gpu"
              initial={{ opacity: 0, scale: 1.35, filter: "blur(16px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: CINEMATIC, delay: 1 }}
            >
              <motion.div
                className="pointer-events-none absolute inset-[-24%] z-[1] rounded-full transform-gpu"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(212,175,55,0.28) 0%, transparent 68%)",
                }}
                initial={{ opacity: 0, scale: 0.75 }}
                animate={
                  glowVisible
                    ? { opacity: [0, 1, 0.75], scale: [0.75, 1.15, 1.05] }
                    : { opacity: 0, scale: 0.75 }
                }
                transition={{ duration: 1.1, ease: CINEMATIC, delay: glowVisible ? 0 : 0 }}
              />
              <motion.div
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.55, ease: CINEMATIC, delay: 1.5 }}
              >
                <Image
                  src={BRAND_LOGO_ASSETS.loader}
                  alt={SITE_CONFIG.name}
                  width={880}
                  height={320}
                  priority
                  fetchPriority="high"
                  unoptimized
                  sizes="(max-width: 640px) 60vw, 420px"
                  className="relative z-[2] mx-auto max-h-[clamp(100px,26vw,220px)] w-auto max-w-full object-contain transform-gpu"
                />
              </motion.div>
            </motion.div>

            {/* 2.0s brand name */}
            <motion.p
              className="relative z-[3] mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--gold)]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: CINEMATIC, delay: 2 }}
            >
              {BRAND_NAME}
            </motion.p>

            {/* 2.5s tagline */}
            <div className="relative z-[3] min-h-[2.5rem]">
              <TaglineLetters visible={taglineVisible} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const LuxuryLoader = UniverseLoader;
