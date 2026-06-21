"use client";

import gsap from "gsap";
import { GSAP_EASE, DUR, STAGGER } from "./easing";

export type RevealPreset = "reveal" | "fade" | "revealLeft" | "revealRight" | "scaleIn" | "maskWord";

type SceneEntry = {
  onEnter?: () => void;
  onExit?: () => void;
  priority: number;
};

const scenes = new Map<string, SceneEntry>();

export function registerScene(
  id: string,
  hooks: { onEnter?: () => void; onExit?: () => void; priority?: number }
) {
  scenes.set(id, { ...hooks, priority: hooks.priority ?? 0 });
  return () => {
    scenes.delete(id);
  };
}

export function enterScene(id: string) {
  const entry = scenes.get(id);
  entry?.onEnter?.();
}

export function exitScene(id: string) {
  const entry = scenes.get(id);
  entry?.onExit?.();
}

const PRESET_VARS: Record<
  RevealPreset,
  gsap.TweenVars
> = {
  reveal: { y: 36, opacity: 0 },
  fade: { opacity: 0 },
  revealLeft: { x: -48, opacity: 0 },
  revealRight: { x: 48, opacity: 0 },
  scaleIn: { scale: 0.96, y: 12, opacity: 0 },
  maskWord: { yPercent: 110, opacity: 0 },
};

/**
 * Reveal direct children of a container — no unanimated DOM flashes.
 */
export function revealChildren(
  container: HTMLElement | null,
  options?: {
    preset?: RevealPreset;
    stagger?: keyof typeof STAGGER;
    selector?: string;
    delay?: number;
  }
) {
  if (!container || typeof window === "undefined") return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const preset = options?.preset ?? "reveal";
  const selector = options?.selector ?? ":scope > *";
  const targets = container.querySelectorAll(selector);
  if (!targets.length) return;

  if (prefersReduced) {
    gsap.set(targets, { opacity: 1, x: 0, y: 0, scale: 1, yPercent: 0 });
    return;
  }

  gsap.fromTo(
    targets,
    PRESET_VARS[preset],
    {
      y: 0,
      x: 0,
      scale: 1,
      yPercent: 0,
      opacity: 1,
      duration: DUR.slow,
      ease: GSAP_EASE.luxe,
      stagger: STAGGER[options?.stagger ?? "base"],
      delay: options?.delay ?? 0.05,
      clearProps: "transform",
    }
  );
}
