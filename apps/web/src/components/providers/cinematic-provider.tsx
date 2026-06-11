"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { LuxuryLoader, LOADER_STORAGE_KEY } from "@/components/effects/luxury-loader";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

function getLoaderSeen() {
  return typeof window !== "undefined" && sessionStorage.getItem(LOADER_STORAGE_KEY) === "1";
}

export function CinematicProvider({ children }: { children: React.ReactNode }) {
  const skipLoader = useSyncExternalStore(() => () => {}, getLoaderSeen, () => false);
  const [done, setDone] = useState(skipLoader);
  const onComplete = useCallback(() => setDone(true), []);

  return (
    <SmoothScrollProvider>
      {!done && <LuxuryLoader onComplete={onComplete} />}
      {children}
    </SmoothScrollProvider>
  );
}
