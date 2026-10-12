"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getMotionMode, isAnimated, onMotionChange, type MotionMode } from "./motion-mode";
import { getLenis, interruptScroll, lockScroll, setLenis, unlockScroll } from "./smooth-scroll";

/**
 * Motion runtime (V7, V8 levels) — mounted once in layout.tsx. One small
 * island of delegated listeners; every effect it drives is decoration over
 * content that is already visible without it:
 *  - [data-tilt] / [data-tilt="soft"]: pointer-follow 3D tilt + glare (7° / 4°)   full
 *  - [data-magnetic]: buttons drift ≤ 6px toward the pointer                       full
 *  - .lux-cursor-light: soft gold glow following the pointer                       full
 *  - Lenis smooth scroll (lerp .085 full / .12 gentle), dynamically imported      full, gentle
 *  - .lux-reveal / .lux-split fallback (adds .is-in) without scroll timelines     full, gentle
 *  - [data-marquee-toggle]: the marquee's pause/play button                        always
 *  - .lux-frame__box[data-loaded]: ends the photo placeholder shimmer             always
 *  - open modal <dialog> → lockScroll("dialog")                                   always
 * Pointer effects and smooth scroll need a fine hover pointer (touch keeps its
 * native momentum). A level change (control, OS, another tab) starts / stops
 * each piece live; full ↔ gentle only retunes Lenis.
 */

type Cleanup = () => void;

const TILT_MAX = 7;
const TILT_SOFT = 4;
const MAG_MAX = 6;
const LERP: Record<Exclude<MotionMode, "off">, number> = { full: 0.085, gentle: 0.12 };
const REVEAL = ".lux-reveal, .lux-split:not(.lux-split--load)";
/** Keys that scroll natively: an in-flight Lenis glide must not fight them. */
const SCROLL_KEYS = new Set(["Tab", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

const px = (n: number, unit: string) => `${n.toFixed(2)}${unit}`;

function clearVars(el: HTMLElement, names: string[], cls: string) {
  for (const n of names) el.style.removeProperty(n);
  el.classList.remove(cls);
}

/** Pointer tilt, magnetic drift and the cursor light share one rAF-throttled pointermove. */
function startPointer(light: HTMLElement | null): Cleanup {
  let tilt: HTMLElement | null = null;
  let mag: HTMLElement | null = null;
  let frame = 0;
  let x = 0;
  let y = 0;
  let target: Element | null = null;

  const releaseTilt = () => {
    if (tilt) clearVars(tilt, ["--tilt-x", "--tilt-y", "--glare-x", "--glare-y"], "is-tilting");
    tilt = null;
  };
  const releaseMag = () => {
    if (mag) clearVars(mag, ["--mag-x", "--mag-y"], "is-magnetic");
    mag = null;
  };

  const tick = () => {
    frame = 0;
    if (light) {
      light.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      light.classList.add("is-on");
    }

    const t = target?.closest<HTMLElement>("[data-tilt]") ?? null;
    if (t !== tilt) releaseTilt();
    if (t) {
      const r = t.getBoundingClientRect();
      if (r.width && r.height) {
        const fx = Math.min(1, Math.max(0, (x - r.left) / r.width));
        const fy = Math.min(1, Math.max(0, (y - r.top) / r.height));
        const max = t.dataset.tilt === "soft" ? TILT_SOFT : TILT_MAX;
        t.style.setProperty("--tilt-x", px((0.5 - fy) * 2 * max, "deg"));
        t.style.setProperty("--tilt-y", px((fx - 0.5) * 2 * max, "deg"));
        t.style.setProperty("--glare-x", px(fx * 100, "%"));
        t.style.setProperty("--glare-y", px(fy * 100, "%"));
        t.classList.add("is-tilting");
        tilt = t;
      }
    }

    const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
    if (m !== mag) releaseMag();
    if (m) {
      const r = m.getBoundingClientRect();
      const dx = Math.max(-MAG_MAX, Math.min(MAG_MAX, (x - (r.left + r.width / 2)) * 0.22));
      const dy = Math.max(-MAG_MAX, Math.min(MAG_MAX, (y - (r.top + r.height / 2)) * 0.3));
      m.style.setProperty("--mag-x", px(dx, "px"));
      m.style.setProperty("--mag-y", px(dy, "px"));
      m.classList.add("is-magnetic");
      mag = m;
    }
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    x = e.clientX;
    y = e.clientY;
    target = e.target instanceof Element ? e.target : null;
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const onLeave = () => {
    target = null;
    releaseTilt();
    releaseMag();
    light?.classList.remove("is-on");
  };

  const onOut = (e: PointerEvent) => {
    if (!e.relatedTarget) onLeave();
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerout", onOut, { passive: true });
  window.addEventListener("blur", onLeave);

  return () => {
    if (frame) cancelAnimationFrame(frame);
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerout", onOut);
    window.removeEventListener("blur", onLeave);
    onLeave();
    if (light) light.style.transform = "";
  };
}

type SmoothScroll = { stop: Cleanup; retune: (mode: MotionMode) => void };

/** The hash-on-load re-alignment runs once per document, never on a Lenis restart. */
let hashAligned = false;
/** Re-align only while the hash target is still about where the browser put it. */
const HASH_DRIFT_MAX = 0.5;

/**
 * Lenis on desktop fine pointers, imported as soon as the runtime hydrates (it
 * is small and only eases wheel input, so it never competes with LCP).
 *  - In-page anchors glide via lenis.scrollTo (honours html scroll-padding-top);
 *    the hash is committed natively afterwards so :target, history and the
 *    focus starting point behave exactly as without Lenis. The skip link and
 *    links another handler already took (lightbox tiles) stay native.
 *  - A hash on load is re-aligned once Lenis is first up (lazy chapters above it
 *    may have changed height since the browser's own jump) — once per document,
 *    and only while the target is still near the top: a visitor who already
 *    scrolled away, or a later Lenis restart (motion level / pointer change),
 *    is never pulled back to a stale #hash.
 *  - Links to another route reset inertia (stopInertiaOnNavigate) so Next's
 *    scroll-to-top / restoration never fights a glide; so does history
 *    navigation and any scrolling key.
 *  - content-visibility chapters re-measure the scroll limit when they render.
 *  - Nested scrollers stay native: dialogs, popovers, [data-lenis-prevent] and
 *    any element that can scroll in the wheel's direction (allowNestedScroll).
 */
function startSmoothScroll(initial: MotionMode): SmoothScroll {
  let destroyed = false;
  let mode = initial;
  let measure = 0;
  const off = new AbortController();
  const on = { signal: off.signal };

  const onAnchor = (e: MouseEvent) => {
    const lenis = getLenis();
    if (!lenis || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>("a[href*='#']") : null;
    if (!link || link.classList.contains("skip-link") || link.target === "_blank") return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    const id = decodeURIComponent(url.hash.slice(1));
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, {
      onComplete: () => {
        if (location.hash !== `#${id}`) location.hash = id;
      },
    });
  };

  const onKey = (e: KeyboardEvent) => {
    if (SCROLL_KEYS.has(e.key)) interruptScroll();
  };

  // content-visibility: auto chapters change height as they render; refresh the
  // limit only (lenis.resize() would also cancel an in-flight glide).
  const onVisibilityState = () => {
    if (measure) return;
    measure = requestAnimationFrame(() => {
      measure = 0;
      getLenis()?.dimensions.resize();
    });
  };

  import("lenis")
    .then(({ default: LenisCtor }) => {
      if (destroyed) return;
      const lenis = new LenisCtor({
        autoRaf: true,
        lerp: LERP[mode === "off" ? "gentle" : mode],
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
        // Our own motion levels decide: "gentle" (the OS-reduce default) still glides.
        respectReducedMotion: false,
        prevent: (node) => !!node.closest("dialog, [popover], [data-lenis-prevent]"),
      });
      setLenis(lenis);

      window.addEventListener("click", onAnchor, on); // window: after document-level handlers ran
      window.addEventListener("keydown", onKey, on);
      window.addEventListener("popstate", interruptScroll, on);
      document.addEventListener("contentvisibilityautostatechange", onVisibilityState, { capture: true, signal: off.signal });

      if (!hashAligned) {
        hashAligned = true;
        const hash = location.hash.length > 1 ? decodeURIComponent(location.hash.slice(1)) : "";
        const target = hash && !hash.startsWith("photo-") ? document.getElementById(hash) : null;
        if (target && window.scrollY > 0) {
          requestAnimationFrame(() => {
            const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
            const drift = Math.abs(target.getBoundingClientRect().top - padding);
            if (drift > 1 && drift < window.innerHeight * HASH_DRIFT_MAX) lenis.scrollTo(target, { immediate: true, force: true });
          });
        }
      }
    })
    .catch(() => {
      /* native scrolling stays */
    });

  return {
    retune(next) {
      mode = next;
      const lenis = getLenis();
      if (lenis && next !== "off") lenis.options.lerp = LERP[next];
    },
    stop() {
      destroyed = true;
      off.abort();
      if (measure) cancelAnimationFrame(measure);
      getLenis()?.destroy();
      setLenis(null);
    },
  };
}

/** Where `animation-timeline` is unsupported, reveal on intersection; content above the fold is never hidden. */
function startRevealFallback(): Cleanup {
  if (typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()")) return () => {};
  if (!("IntersectionObserver" in window)) return () => {};

  const root = document.documentElement;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -6% 0px" }
  );

  const adopt = (scope: ParentNode) => {
    const h = window.innerHeight;
    scope.querySelectorAll(REVEAL).forEach((el) => {
      if (el.classList.contains("is-in")) return;
      if (el.getBoundingClientRect().top < h) el.classList.add("is-in");
      else io.observe(el);
    });
  };

  adopt(document);
  root.classList.add("lux-io");

  const mo = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches(REVEAL)) adopt(node.parentElement ?? document);
        else if (node.firstElementChild) adopt(node);
      });
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });

  return () => {
    mo.disconnect();
    io.disconnect();
    root.classList.remove("lux-io");
  };
}

/** The marquee's visible pause/play control (WCAG 2.2.2). */
function onMarqueeToggle(e: MouseEvent) {
  const btn = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-marquee-toggle]") : null;
  if (!btn) return;
  const paused = btn.getAttribute("aria-pressed") !== "true";
  btn.setAttribute("aria-pressed", String(paused));
  btn.closest(".lux-marquee")?.toggleAttribute("data-paused", paused);
}

/** Photo frames: mark the box once its image has loaded (or failed) so the placeholder shimmer stops. */
function markLoaded(img: Element | null) {
  if (img instanceof HTMLImageElement) img.closest(".lux-frame__box")?.setAttribute("data-loaded", "");
}

function startImageMarks(): Cleanup {
  const onDone = (e: Event) => markLoaded(e.target as Element | null);
  // load / error do not bubble: capture them at the document.
  document.addEventListener("load", onDone, true);
  document.addEventListener("error", onDone, true);
  document.querySelectorAll<HTMLImageElement>(".lux-frame__box:not([data-loaded]) img").forEach((img) => {
    if (img.complete) markLoaded(img);
  });
  return () => {
    document.removeEventListener("load", onDone, true);
    document.removeEventListener("error", onDone, true);
  };
}

/**
 * Any open modal <dialog> (menu, lightbox) holds the page still while Lenis runs.
 * Watches removals too: an open dialog unmounted with its page (Back with the
 * lightbox open) fires no close and keeps [open], and must still release the lock.
 */
function startDialogLock(): Cleanup {
  let held = false;
  const sync = () => {
    const open = document.querySelector("dialog[open]") !== null;
    if (open === held) return;
    held = open;
    if (open) lockScroll("dialog");
    else unlockScroll("dialog");
  };
  const mo = new MutationObserver(sync);
  mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] });
  sync();
  return () => {
    mo.disconnect();
    if (held) unlockScroll("dialog");
  };
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: (deadline: IdleDeadline) => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

const LAZY = ".lux-section--lazy, .pg-shell-footer";

/**
 * content-visibility: auto chapters first render while being scrolled to, and
 * each first render corrected the page height by the placeholder error (V8 QA:
 * −359px on /about, −841px on a phone service page, mid-glide). Instead, once
 * the page is idle after load, every chapter off screen is laid out once
 * (`.lux-cv-measure` for one frame), so `contain-intrinsic-size: auto` remembers
 * its real height and the page height settles before the first scroll. That
 * includes chapters ABOVE the viewport (a #hash load, a restored scroll, back /
 * forward): rendered later, mid-glide, their size error was corrected by scroll
 * anchoring and then overwritten by Lenis's next frame — a jump. Measured while
 * no glide runs, the anchoring shift is a plain native scroll Lenis adopts, and
 * lenis.resize() re-syncs it. Chapters near the viewport are already rendered.
 * Runs at every motion level: the native scrollbar jumped too.
 */
function startLazyMeasure(): Cleanup {
  const w = window as IdleWindow;
  let idleId = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let frame = 0;
  let stopped = false;
  let queue: HTMLElement[] = [];

  const next = () => {
    if (stopped || !queue.length) return;
    if (w.requestIdleCallback) idleId = w.requestIdleCallback(step, { timeout: 2000 });
    else timer = setTimeout(() => step(), 120);
  };

  function step(deadline?: IdleDeadline) {
    idleId = 0;
    timer = undefined;
    if (stopped) return;
    // A glide in flight would overwrite the anchoring shift of a chapter above: wait.
    if (getLenis()?.isScrolling === "smooth") return next();
    const h = window.innerHeight;
    const batch: HTMLElement[] = [];
    let above = false;
    // At least one chapter per slot; more while the idle budget lasts (layout is forced here, inside the slot).
    while (queue.length && (!batch.length || (deadline?.timeRemaining() ?? 0) > 8)) {
      const el = queue.shift()!;
      if (!el.isConnected) continue;
      const r = el.getBoundingClientRect();
      const isAbove = r.bottom < -h * 0.5;
      if (!isAbove && r.top < h * 1.5) continue;
      above ||= isAbove;
      el.classList.add("lux-cv-measure");
      void el.offsetHeight;
      batch.push(el);
    }
    if (!batch.length) return next();
    // The size is recorded at the next rendering update; skip again one frame later.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        frame = 0;
        batch.forEach((el) => el.classList.remove("lux-cv-measure"));
        const lenis = getLenis();
        // Above: scrollY moved (anchoring) — re-sync Lenis's scroll unless a glide began meanwhile.
        if (above && lenis?.isScrolling !== "smooth") lenis?.resize();
        else lenis?.dimensions.resize();
        next();
      });
    });
  }

  const begin = () => {
    queue = Array.from(document.querySelectorAll<HTMLElement>(LAZY));
    next();
  };
  if (document.readyState === "complete") begin();
  else window.addEventListener("load", begin, { once: true });

  return () => {
    stopped = true;
    window.removeEventListener("load", begin);
    if (idleId) w.cancelIdleCallback?.(idleId);
    if (timer) clearTimeout(timer);
    if (frame) cancelAnimationFrame(frame);
    document.querySelectorAll(".lux-cv-measure").forEach((el) => el.classList.remove("lux-cv-measure"));
  };
}

export function MotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const light = document.querySelector<HTMLElement>(".lux-cursor-light");
    let pointer: Cleanup | null = null;
    let reveal: Cleanup | null = null;
    let smooth: SmoothScroll | null = null;

    const sync = () => {
      const mode = getMotionMode();
      const animated = isAnimated(mode);

      const wantPointer = mode === "full" && fine.matches;
      if (wantPointer && !pointer) pointer = startPointer(light);
      else if (!wantPointer && pointer) {
        pointer();
        pointer = null;
      }

      if (animated && !reveal) reveal = startRevealFallback();
      else if (!animated && reveal) {
        reveal();
        reveal = null;
      }

      const wantSmooth = animated && fine.matches;
      if (wantSmooth && !smooth) smooth = startSmoothScroll(mode);
      else if (!wantSmooth && smooth) {
        smooth.stop();
        smooth = null;
      }
      smooth?.retune(mode);
    };

    sync();
    const stopMotion = onMotionChange(sync);
    fine.addEventListener("change", sync);
    document.addEventListener("click", onMarqueeToggle);
    const stopImages = startImageMarks();
    const stopDialogs = startDialogLock();

    return () => {
      stopMotion();
      fine.removeEventListener("change", sync);
      document.removeEventListener("click", onMarqueeToggle);
      stopImages();
      stopDialogs();
      pointer?.();
      reveal?.();
      smooth?.stop();
    };
  }, []);

  // Route content swapped (Next has already scrolled to top or restored): re-measure.
  useEffect(() => {
    const id = requestAnimationFrame(() => getLenis()?.resize());
    const stopMeasure = startLazyMeasure();
    return () => {
      cancelAnimationFrame(id);
      stopMeasure();
    };
  }, [pathname]);

  return <div className="lux-cursor-light" aria-hidden="true" />;
}
