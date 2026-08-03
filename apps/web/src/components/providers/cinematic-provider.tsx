"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  UniverseLoader,
  LOADER_STORAGE_KEY,
  hasSeenPremiere,
} from "@/components/effects/universe-loader";
import { PremiereContext } from "@/components/providers/premiere-context";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { PageTransition } from "@/lib/motion/page-transition";
import { useIsClient } from "@/hooks/use-is-client";

function subscribeStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function CinematicProvider({ children }: { children: React.ReactNode }) {
  // SSR + hydration use false; client then reads session/local storage without an effect.
  const hydrated = useIsClient();
  const skipPremiere = useSyncExternalStore(subscribeStorage, hasSeenPremiere, () => false);

  const [premiereComplete, setPremiereComplete] = useState(false);
  const [handoffActive, setHandoffActive] = useState(false);

  const onHandoff = useCallback(() => setHandoffActive(true), []);
  const onComplete = useCallback(() => setPremiereComplete(true), []);

  const done = skipPremiere || premiereComplete;
  const revealed = skipPremiere || handoffActive;
  const premiereActive = hydrated && !skipPremiere && !premiereComplete;

  // FAILSAFE: if the premiere stalls, force-reveal content — never stay black.
  useEffect(() => {
    if (!hydrated || done) return;
    const t = window.setTimeout(() => {
      setHandoffActive(true);
      setPremiereComplete(true);
    }, 3500);
    return () => window.clearTimeout(t);
  }, [hydrated, done]);

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
      if (hydrated) {
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
  }, [premiereActive, hydrated]);

  const contextValue = useMemo(
    () => ({
      skipPremiere,
      handoffActive: revealed,
      premiereComplete: done,
    }),
    [skipPremiere, revealed, done]
  );

  const contentVisible = hydrated && revealed;

  return (
    <PremiereContext.Provider value={contextValue}>
      <SmoothScrollProvider enabled={done}>
        {!hydrated && (
          <div
            className="premiere-loader fixed inset-0 z-[99999] bg-black"
            aria-hidden
          />
        )}
        {premiereActive && (
          <UniverseLoader onHandoff={onHandoff} onComplete={onComplete} />
        )}
        <div
          className="transform-gpu will-change-transform transition-[opacity,transform] duration-500 ease-out"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? "scale(1)" : "scale(1.05)",
          }}
        >
          <PageTransition>{children}</PageTransition>
        </div>
      </SmoothScrollProvider>
    </PremiereContext.Provider>
  );
}

export { LOADER_STORAGE_KEY };
