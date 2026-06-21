"use client";

import { useEffect, type RefObject } from "react";
import type Lenis from "lenis";
import { registerGsap, ScrollTrigger } from "@/lib/gsap/use-gsap";

/**
 * Wire Lenis virtual scroll → GSAP ScrollTrigger.update().
 * Call once Lenis is instantiated and scroll is enabled.
 */
export function useLenisScrollTrigger(
  lenisRef: RefObject<Lenis | null>,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    registerGsap();
    const lenis = lenisRef.current;
    if (!lenis) return;

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
  }, [lenisRef, enabled]);
}
