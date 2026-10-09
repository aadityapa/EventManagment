"use client";

import type Lenis from "lenis";
import { useEffect } from "react";
import { getMotionMode, onMotionChange } from "./motion-mode";

/**
 * V7 motion runtime — mounted once in layout.tsx. One small island of
 * delegated listeners; every effect it drives is decoration over content that
 * is already visible without it:
 *  - [data-tilt] / [data-tilt="soft"]: pointer-follow 3D tilt + glare (7° / 4°)
 *  - [data-magnetic]: buttons drift ≤ 6px toward the pointer
 *  - .lux-cursor-light: soft gold glow following the pointer
 *  - Lenis smooth scroll, loaded dynamically after idle
 *  - .lux-reveal / .lux-split fallback (adds .is-in) where scroll timelines are unsupported
 *  - [data-marquee-toggle]: the marquee's pause/play button
 * Pointer effects and smooth scroll run on fine-pointer hover devices only, and
 * everything but the marquee toggle runs only while the site motion preference
 * is "full" (html[data-motion], DESIGN.md §9). Switching to "reduced" (toggle,
 * OS change, another tab) tears Lenis and every listener down live.
 */

type Cleanup = () => void;

const TILT_MAX = 7;
const TILT_SOFT = 4;
const MAG_MAX = 6;
const REVEAL = ".lux-reveal, .lux-split:not(.lux-split--load)";

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

/**
 * Lenis on desktop fine pointers, loaded after the page is idle so it never
 * competes with LCP. In-page anchors glide via lenis.scrollTo (which honours
 * html scroll-padding-top); the hash is committed natively afterwards so
 * :target, history and focus behave exactly as without Lenis.
 */
function startSmoothScroll(): Cleanup {
  let destroyed = false;
  let lenis: Lenis | null = null;
  const hasIdle = "requestIdleCallback" in window;

  const onAnchor = (e: MouseEvent) => {
    if (!lenis || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
    if (!link || link.classList.contains("skip-link")) return;
    const id = decodeURIComponent(link.hash.slice(1));
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, {
      onComplete: () => {
        if (location.hash !== `#${id}`) location.hash = id;
      },
    });
  };

  const boot = () => {
    import("lenis")
      .then(({ default: LenisCtor }) => {
        if (destroyed) return;
        lenis = new LenisCtor({
          autoRaf: true,
          allowNestedScroll: true,
          stopInertiaOnNavigate: true,
          prevent: (node) => !!node.closest("dialog, [popover], [data-lenis-prevent]"),
        });
        document.addEventListener("click", onAnchor);
      })
      .catch(() => {
        /* native scrolling stays */
      });
  };

  let handle = 0;
  const schedule = () => {
    handle = hasIdle ? window.requestIdleCallback(boot, { timeout: 2500 }) : window.setTimeout(boot, 1200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  return () => {
    destroyed = true;
    window.removeEventListener("load", schedule);
    document.removeEventListener("click", onAnchor);
    if (handle) {
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    }
    lenis?.destroy();
    lenis = null;
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

export function MotionRuntime() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const light = document.querySelector<HTMLElement>(".lux-cursor-light");
    let stops: Cleanup[] = [];
    let current = "";

    const start = () => {
      const key = `${getMotionMode()}|${fine.matches}`;
      if (key === current) return;
      current = key;
      stops.forEach((stop) => stop());
      stops = [];
      if (getMotionMode() !== "full") return;
      stops.push(startRevealFallback());
      if (fine.matches) stops.push(startPointer(light), startSmoothScroll());
    };

    start();
    const stopMotion = onMotionChange(start);
    fine.addEventListener("change", start);
    document.addEventListener("click", onMarqueeToggle);

    return () => {
      stopMotion();
      fine.removeEventListener("change", start);
      document.removeEventListener("click", onMarqueeToggle);
      stops.forEach((stop) => stop());
    };
  }, []);

  return <div className="lux-cursor-light" aria-hidden="true" />;
}
