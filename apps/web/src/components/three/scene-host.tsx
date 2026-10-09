"use client";

/**
 * <Scene3D> — decorative WebGL layer for the V7 "Living Editorial" pass.
 *
 * Renders an aria-hidden host that fills its positioned parent and always
 * carries the CSS fallback glow (src/styles/scene.css). Only after `load` +
 * idle, and only when `canRun3D()` allows it, does it dynamically import the
 * scene module (which pulls in `three`) and mount a canvas. Nothing here ever
 * blocks LCP, shifts layout or carries content.
 *
 * The site motion preference (html[data-motion]) is passed as `motion`:
 * "full" animates, "reduced" renders one still frame. A change ("nx:motion")
 * remounts the scene in the new mode live.
 */
import { useEffect, useRef, type CSSProperties } from "react";
import { canRun3D, devicePreset } from "./gating";
import { getMotionMode, onMotionChange, type MotionMode } from "../motion/motion-mode";
import type { SceneMount } from "./parts/stage";

export type SceneVariant = "hero" | "dust" | "coin" | "globe";

export interface Scene3DProps {
  variant: SceneVariant;
  className?: string;
  /** 0–1, default 1. Scales particle density / brightness and the fallback glow. */
  intensity?: number;
}

const LOADERS: Record<SceneVariant, () => Promise<{ mount: SceneMount }>> = {
  hero: () => import("./scenes/hero"),
  dust: () => import("./scenes/dust"),
  coin: () => import("./scenes/coin"),
  globe: () => import("./scenes/globe"),
};

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

function clamp01(n: number) {
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 1;
}

export function Scene3D({ variant, className, intensity = 1 }: Scene3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const level = clamp01(intensity);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const w = window as IdleWindow;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    let mountedMode: MotionMode | undefined;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const setState = (state: string) => {
      host.dataset.scene = state;
    };

    const start = () => {
      idleId = undefined;
      timeoutId = undefined;
      if (cancelled || dispose || !canRun3D()) return;
      setState("loading");
      LOADERS[variant]()
        .then(({ mount }) => {
          // Re-check: reduced motion may have switched on while the chunk loaded.
          if (cancelled || dispose || !canRun3D()) return;
          mountedMode = getMotionMode();
          dispose = mount(host, { preset: devicePreset(), intensity: level, motion: mountedMode });
        })
        .catch(() => {
          if (!cancelled) setState("off");
        });
    };

    const schedule = () => {
      if (cancelled || dispose || idleId !== undefined || timeoutId !== undefined) return;
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(start, { timeout: 2500 });
      else timeoutId = setTimeout(start, 600);
    };

    const teardown = () => {
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      idleId = undefined;
      timeoutId = undefined;
      dispose?.();
      dispose = undefined;
      mountedMode = undefined;
    };

    // Live switch between "full" and "reduced": remount in the new mode (the
    // scene chunk is cached, so this is immediate). Not yet mounted: the
    // pending start() reads the mode when it runs.
    const stopMotion = onMotionChange((mode) => {
      if (!dispose || mode === mountedMode) return;
      teardown();
      start();
    });

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      stopMotion();
      teardown();
    };
  }, [variant, level]);

  const style = { "--scene-intensity": level } as CSSProperties;

  return (
    <div
      ref={hostRef}
      className={`lux-scene lux-scene--${variant}${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden="true"
      data-variant={variant}
    >
      <span className="lux-scene__fallback" />
    </div>
  );
}

export default Scene3D;
