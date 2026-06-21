"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  UniverseLoader,
  LOADER_STORAGE_KEY,
  hasSeenPremiere,
} from "@/components/effects/universe-loader";
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
  const skipLoader = useSyncExternalStore(subscribeLoaderSeen, getLoaderSeenSnapshot, () => false);
  const [done, setDone] = useState(skipLoader);
  const onComplete = useCallback(() => setDone(true), []);

  useEffect(() => {
    if (!done) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [done]);

  return (
    <SmoothScrollProvider enabled={done}>
      {!done && <UniverseLoader onComplete={onComplete} />}
      <motion.div
        initial={skipLoader ? false : { opacity: 0, scale: 1.05 }}
        animate={done ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5, ease: EASE.silk }}
      >
        <PageTransition>{children}</PageTransition>
      </motion.div>
    </SmoothScrollProvider>
  );
}

export { LOADER_STORAGE_KEY };
