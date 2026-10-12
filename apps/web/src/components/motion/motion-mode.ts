/**
 * Site motion levels (V8 — DESIGN.md §9).
 *
 * `html[data-motion]` is "full", "gentle" or "off". It is set before first
 * paint by MOTION_BOOT_SCRIPT (inlined in <head> by layout.tsx): a stored
 * choice under localStorage "nx-motion" wins (the legacy V7 value "reduced"
 * reads as "off"); otherwise the OS decides — `prefers-reduced-motion: reduce`
 * → "gentle", else "full" — and is followed live while no choice is stored.
 * The footer / menu control calls `window.__nxSetMotion(mode)`, which updates
 * the attribute and storage and dispatches "nx:motion" on window.
 *
 * Without JS there is no attribute: CSS treats that as static
 * (`:not([data-motion="full"]):not([data-motion="gentle"])`).
 *
 * No "use client": the boot script string is imported by the server layout.
 */

export type MotionMode = "full" | "gentle" | "off";

export const MOTION_STORAGE_KEY = "nx-motion";
export const MOTION_EVENT = "nx:motion";
export const MOTION_MODES: readonly MotionMode[] = ["full", "gentle", "off"];

export interface MotionEventDetail {
  mode: MotionMode;
  source: "user" | "os";
}

declare global {
  interface Window {
    /** Set the site motion level; `null` clears the stored choice (follow the OS again). */
    __nxSetMotion?: (mode: MotionMode | null) => void;
  }
}

function isMode(v: unknown): v is MotionMode {
  return v === "full" || v === "gentle" || v === "off";
}

/** Current level from the <html> attribute; "off" when unset (no JS boot / server). */
export function getMotionMode(): MotionMode {
  if (typeof document === "undefined") return "off";
  const v = document.documentElement.dataset.motion;
  return isMode(v) ? v : "off";
}

/** Anything moves at all ("full" or "gentle"). */
export function isAnimated(mode: MotionMode): boolean {
  return mode !== "off";
}

/** Subscribe to level changes (user control, OS change, another tab). Returns an unsubscribe. */
export function onMotionChange(cb: (mode: MotionMode) => void): () => void {
  const handler = () => cb(getMotionMode());
  window.addEventListener(MOTION_EVENT, handler);
  return () => window.removeEventListener(MOTION_EVENT, handler);
}

/** Set the level through the boot script's global (falls back to the attribute alone). */
export function setMotionMode(mode: MotionMode | null): void {
  if (typeof window === "undefined") return;
  if (window.__nxSetMotion) {
    window.__nxSetMotion(mode);
    return;
  }
  const next: MotionMode = mode ?? "off";
  document.documentElement.dataset.motion = next;
  window.dispatchEvent(new CustomEvent<MotionEventDetail>(MOTION_EVENT, { detail: { mode: next, source: "user" } }));
}

/**
 * Render-blocking boot script (≈ 0.9 KB, no external file). Runs in <head>
 * before paint, so CSS gated on [data-motion] never flashes. Every storage /
 * matchMedia access is guarded: private windows and blocked storage fall back
 * to the OS setting.
 */
export const MOTION_BOOT_SCRIPT = `(function(){var d=document.documentElement,K="${MOTION_STORAGE_KEY}",E="${MOTION_EVENT}",q=null;
try{q=window.matchMedia("(prefers-reduced-motion: reduce)")}catch(e){}
function ok(v){return v==="full"||v==="gentle"||v==="off"}
function st(){try{var v=localStorage.getItem(K);if(v==="reduced")v="off";return ok(v)?v:null}catch(e){return null}}
function os(){return q&&q.matches?"gentle":"full"}
function apply(m,s){d.setAttribute("data-motion",m);d.setAttribute("data-motion-source",s);try{window.dispatchEvent(new CustomEvent(E,{detail:{mode:m,source:s}}))}catch(e){}}
var s=st();d.setAttribute("data-motion",s||os());d.setAttribute("data-motion-source",s?"user":"os");
window.__nxSetMotion=function(m){if(!ok(m))m=null;try{if(m)localStorage.setItem(K,m);else localStorage.removeItem(K)}catch(e){}apply(m||os(),m?"user":"os")};
function follow(){if(!st())apply(os(),"os")}
if(q){if(q.addEventListener)q.addEventListener("change",follow);else if(q.addListener)q.addListener(follow)}
window.addEventListener("storage",function(e){if(e.key===K){var v=st();apply(v||os(),v?"user":"os")}});
})();`;
