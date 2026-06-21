"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";
import Lenis from "lenis";
import { registerGsap, ScrollTrigger } from "@/lib/gsap/use-gsap";

type SmoothScrollContextValue = {
  lenisRef: RefObject<Lenis | null>;
  enabled: boolean;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenisRef: { current: null },
  enabled: false,
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

type Props = {
  children: ReactNode;
  /** Disable Lenis until cinematic loader completes. */
  enabled?: boolean;
};

function wireLenisScrollTrigger(lenis: Lenis) {
  registerGsap();

  const onScroll = () => ScrollTrigger.update();
  lenis.on("scroll", onScroll);

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length && value !== undefined) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  const onRefresh = () => lenis.resize();
  ScrollTrigger.addEventListener("refresh", onRefresh);
  ScrollTrigger.refresh();

  return () => {
    lenis.off("scroll", onScroll);
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    ScrollTrigger.scrollerProxy(document.documentElement, {});
  };
}

export function SmoothScrollProvider({ children, enabled = true }: Props) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const instance = new Lenis({
      duration: 0.85,
      lerp: 0.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.1,
    });
    lenisRef.current = instance;

    const teardownScrollTrigger = wireLenisScrollTrigger(instance);

    let raf = 0;
    const loop = (time: number) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      teardownScrollTrigger();
      instance.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return (
    <SmoothScrollContext.Provider value={{ lenisRef, enabled }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
