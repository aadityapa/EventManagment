"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  UniverseLoader,
  LOADER_STORAGE_KEY,
  hasSeenPremiere,
} from "@/components/effects/universe-loader";
import { PremiereContext } from "@/components/providers/premiere-context";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { PageTransition } from "@/lib/motion/page-transition";

export function CinematicProvider({ children }: { children: React.ReactNode }) {
  // Keep SSR + first client paint identical; resolve premiere only after mount.
  const [hydrated, setHydrated] = useState(false);
  const [skipPremiere, setSkipPremiere] = useState(false);
  const [premiereComplete, setPremiereComplete] = useState(false);
  const [handoffActive, setHandoffActive] = useState(false);

  useEffect(() => {
    const seen = hasSeenPremiere();
    setSkipPremiere(seen);
    setPremiereComplete(seen);
    setHandoffActive(seen);
    setHydrated(true);
  }, []);

  const onHandoff = useCallback(() => setHandoffActive(true), []);
  const onComplete = useCallback(() => setPremiereComplete(true), []);

  const premiereActive = hydrated && !skipPremiere && !premiereComplete;

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
      handoffActive,
      premiereComplete,
    }),
    [skipPremiere, handoffActive, premiereComplete]
  );

  const contentVisible = !hydrated ? false : handoffActive || skipPremiere;

  return (
    <PremiereContext.Provider value={contextValue}>
      <SmoothScrollProvider enabled={premiereComplete}>
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
