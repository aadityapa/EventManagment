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
 * 3D rotating brand logo. Uses a real three.js coin on capable DESKTOP devices,
 * falls back to the CSS coin spin on mobile / low-end hardware / reduced motion.
 *
 * Perf: three.js (~500 KiB) is only fetched on desktop-width viewports, and only
 * after the window `load` event + an idle callback — it never competes with the
 * initial render or contributes to mobile TBT/LCP.
 */
export function LogoCoin() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const desktop = window.matchMedia?.("(min-width: 1024px)")?.matches ?? false;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    const cores = navigator.hardwareConcurrency ?? 4;
    const saveData =
      (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData ?? false;
    const capable =
      !reduced && desktop && !saveData && (memory === undefined || memory >= 4) && cores >= 4;
    if (!capable) return;

    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const schedule = () => {
      // Defer WebGL until the main thread is idle — hero text/photo paint first,
      // the CSS fallback spins in the meantime, then the 3D canvas takes over.
      if (w.requestIdleCallback) {
        idleId = w.requestIdleCallback(() => setEnabled(true), { timeout: 4000 });
      } else {
        timeoutId = window.setTimeout(() => setEnabled(true), 2500);
      }
    };

    // Wait for full page load so three.js never contends with LCP resources.
    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }

    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!enabled) return <LogoCoinFallback />;

  return (
    <div className="logo3d-canvas" aria-hidden>
      <LogoCoinCanvas />
    </div>
  );
}
