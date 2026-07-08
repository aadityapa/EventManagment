"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroThreeCanvas = dynamic(
  () => import("@/components/three/hero-three-canvas").then((m) => m.HeroThreeCanvas),
  { ssr: false }
);

/**
 * Defers the WebGL hero layer until the browser is idle so the LCP image
 * and hero copy render first. Desktop-only mounting is handled via CSS
 * (`.luxury-hero__three` is hidden on small screens by its parent wrapper).
 */
export function Hero3D() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }

    const t = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  if (!ready) return null;
  return <HeroThreeCanvas />;
}
