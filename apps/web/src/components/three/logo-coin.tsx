"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Logo } from "@/components/branding/logo";

/** CSS coin-spin fallback — shown while WebGL loads or on low-end devices. */
function LogoCoinFallback() {
  return (
    <div className="logo3d">
      <div className="logo3d__spinner">
        <div className="logo3d__face logo3d__face--front">
          <Logo variant="image" href={undefined} priority className="luxury-hero__logo" />
        </div>
        <div className="logo3d__face logo3d__face--back">
          <Logo variant="image" href={undefined} className="luxury-hero__logo" />
        </div>
      </div>
    </div>
  );
}

const LogoCoinCanvas = dynamic(
  () => import("./logo-coin-canvas").then((m) => m.LogoCoinCanvas),
  { ssr: false, loading: LogoCoinFallback }
);

/**
 * 3D rotating brand logo. Uses a real three.js coin on capable devices,
 * falls back to the CSS coin spin on low-end hardware / reduced motion.
 */
export function LogoCoin() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    const cores = navigator.hardwareConcurrency ?? 4;
    const capable = !reduced && (memory === undefined || memory >= 4) && cores >= 4;
    if (!capable) return;

    // Defer WebGL until the main thread is idle — hero text/photo paint first,
    // the CSS fallback spins in the meantime, then the 3D canvas takes over.
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    if (idle) {
      const id = idle(() => setEnabled(true), { timeout: 2500 });
      return () => (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setEnabled(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  if (!enabled) return <LogoCoinFallback />;

  return (
    <div className="logo3d-canvas" aria-hidden>
      <LogoCoinCanvas />
    </div>
  );
}
