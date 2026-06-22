"use client";

import { useMemo } from "react";
import { PremiereContext } from "@/components/providers/premiere-context";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { PageTransition } from "@/lib/motion/page-transition";

/** Performance mode — skip cinematic intro loader and page fade (CLS + LCP). */
const SKIP_PREMIERE = true;

export function CinematicProvider({ children }: { children: React.ReactNode }) {
  const contextValue = useMemo(
    () => ({
      skipPremiere: SKIP_PREMIERE,
      handoffActive: SKIP_PREMIERE,
      premiereComplete: true,
    }),
    []
  );

  return (
    <PremiereContext.Provider value={contextValue}>
      <SmoothScrollProvider enabled={false}>
        <PageTransition>{children}</PageTransition>
      </SmoothScrollProvider>
    </PremiereContext.Provider>
  );
}
