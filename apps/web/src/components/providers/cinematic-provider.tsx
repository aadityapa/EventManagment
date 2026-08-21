"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import {
  LOADER_STORAGE_KEY,
  hasSeenPremiere,
} from "@/components/effects/premiere-storage";

// Premiere overlay code only downloads when it will actually play (desktop first visit).
const UniverseLoader = dynamic(
  () => import("@/components/effects/universe-loader").then((m) => m.UniverseLoader),
  { ssr: false }
);
import { PremiereContext } from "@/components/providers/premiere-context";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { PageTransition } from "@/lib/motion/page-transition";
import { useIsClient } from "@/hooks/use-is-client";

function subscribeStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function subscribePremiereEligibility(onChange: () => void) {
  const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  desktop.addEventListener("change", onChange);
  reduced.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    desktop.removeEventListener("change", onChange);
    reduced.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Premiere only plays on desktop-class devices without reduced-motion, once per visitor. */
function getPremiereEligible() {
  return (
    window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !hasSeenPremiere()
  );
}

/**
 * Cinematic shell.
 *
 * Perf-critical invariants:
 * - Server HTML is NEVER blacked out — content paints immediately (LCP/SEO).
 * - The first-visit premiere only plays on desktop (fine pointer, ≥1024px)
 *   without reduced-motion; phones and slow devices go straight to content.
 */
export function CinematicProvider({ children }: { children: React.ReactNode }) {
  // SSR + hydration use false; client then reads session/local storage without an effect.
  const hydrated = useIsClient();
  const skipPremiere = useSyncExternalStore(subscribeStorage, hasSeenPremiere, () => false);

  // SSR snapshot is false → server HTML always renders content visible.
  const wantsPremiere = useSyncExternalStore(
    subscribePremiereEligibility,
    getPremiereEligible,
    () => false
  );

  const [premiereComplete, setPremiereComplete] = useState(false);
  const [handoffActive, setHandoffActive] = useState(false);

  const onHandoff = useCallback(() => setHandoffActive(true), []);
  const onComplete = useCallback(() => setPremiereComplete(true), []);

  const premiereActive = hydrated && wantsPremiere && !skipPremiere && !premiereComplete;
  const done = !premiereActive;
  const revealed = !premiereActive || handoffActive;

  // FAILSAFE: if the premiere stalls, force-reveal content — never stay black.
  useEffect(() => {
    if (!premiereActive) return;
    const t = window.setTimeout(() => {
      setHandoffActive(true);
      setPremiereComplete(true);
    }, 3500);
    return () => window.clearTimeout(t);
  }, [premiereActive]);

  useEffect(() => {
    const root = document.documentElement;
    if (premiereActive) {
      root.classList.add("premiere-active");
      document.body.style.overflow = "hidden";
      document.body.style.backgroundColor = "#000000";
    } else {
      root.classList.remove("premiere-active");
      document.body.style.overflow = "";
      document.body.style.backgroundColor = "";
      if (hydrated && wantsPremiere) {
        import("@/lib/gsap/use-gsap").then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh();
        });
      }
    }
    return () => {
      root.classList.remove("premiere-active");
      document.body.style.overflow = "";
      document.body.style.backgroundColor = "";
    };
  }, [premiereActive, hydrated, wantsPremiere]);

  const contextValue = useMemo(
    () => ({
      skipPremiere,
      handoffActive: revealed,
      premiereComplete: done,
    }),
    [skipPremiere, revealed, done]
  );

  return (
    <PremiereContext.Provider value={contextValue}>
      {/* All framer-motion animations honour the visitor's reduced-motion setting. */}
      <MotionConfig reducedMotion="user">
        <SmoothScrollProvider enabled={done}>
          {premiereActive && (
            <UniverseLoader onHandoff={onHandoff} onComplete={onComplete} />
          )}
          <div
            className="transform-gpu transition-opacity duration-500 ease-out"
            style={{ opacity: revealed ? 1 : 0 }}
          >
            <PageTransition>{children}</PageTransition>
          </div>
        </SmoothScrollProvider>
      </MotionConfig>
    </PremiereContext.Provider>
  );
}

export { LOADER_STORAGE_KEY };
