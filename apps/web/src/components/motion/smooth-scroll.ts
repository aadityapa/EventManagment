/**
 * Smooth-scroll bridge (V8 — DESIGN.md §9). Tiny and client-safe: it never
 * imports lenis itself (MotionRuntime loads it dynamically and hands the
 * instance in via setLenis), so any island can lock or drive the page scroll
 * without pulling Lenis into its bundle.
 *
 *  - getLenis(): the live instance, or null (touch, motion "off", not booted yet)
 *  - lockScroll(reason) / unlockScroll(reason): ref-counted per reason; stops /
 *    restarts Lenis (html.lenis-stopped clips the page). No-op without Lenis —
 *    native modals already lock themselves (html:has(dialog[open]) overflow).
 *  - scrollToTarget(target, opts): Lenis when active, otherwise native
 *    scrollIntoView / scrollTo; both honour html scroll-padding-top, and the
 *    native path is instant under motion "off".
 */
import type Lenis from "lenis";
import { getMotionMode } from "./motion-mode";

let lenis: Lenis | null = null;
const locks = new Map<string, number>();

const locked = () => locks.size > 0;

/** MotionRuntime only: install (or clear) the live instance. A pending lock applies at once. */
export function setLenis(instance: Lenis | null): void {
  lenis = instance;
  if (instance && locked()) instance.stop();
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function lockScroll(reason: string): void {
  locks.set(reason, (locks.get(reason) ?? 0) + 1);
  lenis?.stop();
}

export function unlockScroll(reason: string): void {
  const n = (locks.get(reason) ?? 0) - 1;
  if (n > 0) locks.set(reason, n);
  else locks.delete(reason);
  if (!locked()) lenis?.start();
}

/** Stop an in-flight Lenis glide where it is (keyboard scrolling, history navigation). */
export function interruptScroll(): void {
  if (lenis && lenis.isScrolling === "smooth") lenis.scrollTo(window.scrollY, { immediate: true, force: true });
}

export type ScrollToOptions = {
  /** Extra offset in px added to the resolved position (negative = higher). */
  offset?: number;
  /** Jump without easing. */
  immediate?: boolean;
  onComplete?: () => void;
};

/**
 * Scroll the page to an element (aligned under the sticky header via
 * scroll-padding-top) or to an absolute y. Eased when motion is "full" or
 * "gentle" (Lenis glide, or native smooth when Lenis is not running).
 */
export function scrollToTarget(target: Element | number, opts: ScrollToOptions = {}): void {
  if (typeof window === "undefined") return;
  const { offset = 0, immediate = false, onComplete } = opts;
  const instant = immediate || getMotionMode() === "off";

  if (lenis && !locked() && (typeof target === "number" || target instanceof HTMLElement)) {
    lenis.scrollTo(target, { offset, immediate: instant, force: true, onComplete: () => onComplete?.() });
    return;
  }

  const behavior: ScrollBehavior = instant ? "instant" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior });
  } else if (offset) {
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - padding + offset, behavior });
  } else {
    target.scrollIntoView({ behavior, block: "start" });
  }
  if (!onComplete) return;
  if (instant || !("onscrollend" in window)) {
    requestAnimationFrame(() => onComplete());
    return;
  }
  // scrollend never fires when nothing had to move: a timeout backs it up.
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    window.removeEventListener("scrollend", finish);
    window.clearTimeout(timer);
    onComplete();
  };
  const timer = window.setTimeout(finish, 1500);
  window.addEventListener("scrollend", finish, { once: true });
}
