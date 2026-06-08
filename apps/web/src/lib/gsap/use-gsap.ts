"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function useGsapContext(
  containerRef: RefObject<HTMLElement | null>,
  setup: () => void,
  deps: unknown[] = []
) {
  useEffect(() => {
    registerGsap();
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(setup, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function animateCounter(
  el: HTMLElement,
  end: number,
  suffix = "",
  duration = 2
) {
  const obj = { val: 0 };
  return gsap.to(obj, {
    val: end,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = `${Math.round(obj.val).toLocaleString("en-IN")}${suffix}`;
    },
  });
}

export { gsap, ScrollTrigger };
