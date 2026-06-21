"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  UniverseLoader,
  LOADER_STORAGE_KEY,
  hasSeenPremiere,
} from "@/components/effects/universe-loader";
import { PremiereContext } from "@/components/providers/premiere-context";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { PageTransition } from "@/lib/motion/page-transition";
import { EASE } from "@/lib/motion";

function subscribeLoaderSeen(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getLoaderSeenSnapshot() {
  return hasSeenPremiere();
}

export function CinematicProvider({ children }: { children: React.ReactNode }) {
  const skipPremiere = useSyncExternalStore(subscribeLoaderSeen, getLoaderSeenSnapshot, () => false);
  const [premiereComplete, setPremiereComplete] = useState(skipPremiere);
  const [handoffActive, setHandoffActive] = useState(skipPremiere);

  const onHandoff = useCallback(() => setHandoffActive(true), []);
  const onComplete = useCallback(() => setPremiereComplete(true), []);

  const premiereActive = !skipPremiere && !premiereComplete;

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
      import("@/lib/gsap/use-gsap").then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    }
    return () => {
      root.classList.remove("premiere-active");
      document.body.style.overflow = "";
      document.body.style.backgroundColor = "";
    };
  }, [premiereActive]);

  const contextValue = useMemo(
    () => ({
      skipPremiere,
      handoffActive,
      premiereComplete,
    }),
    [skipPremiere, handoffActive, premiereComplete]
  );

  return (
    <PremiereContext.Provider value={contextValue}>
      <SmoothScrollProvider enabled={premiereComplete}>
        {premiereActive && (
          <UniverseLoader onHandoff={onHandoff} onComplete={onComplete} />
        )}
        <motion.div
          className="transform-gpu will-change-transform"
          initial={skipPremiere ? false : { opacity: 0, scale: 1.05 }}
          animate={
            handoffActive || skipPremiere
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 1.05 }
          }
          transition={{ duration: 1.2, ease: EASE.silk, delay: handoffActive ? 0 : 0.15 }}
        >
          <PageTransition>{children}</PageTransition>
        </motion.div>
      </SmoothScrollProvider>
    </PremiereContext.Provider>
  );
}

export { LOADER_STORAGE_KEY };
