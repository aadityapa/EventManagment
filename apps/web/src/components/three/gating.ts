/**
 * Capability gate for the V7 3D layer.
 *
 * `canRun3D()` is false on the server, with Save-Data on, without a WebGL2
 * context, or on devices reporting fewer than four logical cores. Every caller
 * must leave the CSS fallback in place when it returns false.
 *
 * Reduced motion is NOT a capability failure ("reduce, don't remove"): the
 * site motion preference (html[data-motion], see components/motion/motion-mode)
 * is passed to the scene as `motion`, and "reduced" renders one still frame.
 */

export type DevicePreset = "full" | "lite";

type NavigatorExtras = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

let webgl2Cache: boolean | undefined;

function hasWebGL2(): boolean {
  if (webgl2Cache !== undefined) return webgl2Cache;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    webgl2Cache = Boolean(gl);
    // Free the probe context straight away: browsers cap live contexts.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webgl2Cache = false;
  }
  return webgl2Cache;
}

function matches(query: string): boolean {
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

export function canRun3D(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 8) < 4) return false;
  return hasWebGL2();
}

export function devicePreset(): DevicePreset {
  if (typeof window === "undefined") return "lite";
  const nav = navigator as NavigatorExtras;
  const coarse = matches("(pointer: coarse)");
  const narrow = matches("(max-width: 767.98px)");
  const lowMemory = (nav.deviceMemory ?? 8) <= 4;
  const fewCores = (nav.hardwareConcurrency ?? 8) <= 4;
  return coarse || narrow || lowMemory || fewCores ? "lite" : "full";
}

/** Device-pixel-ratio cap per preset (phones ≤ 1.5, desktop ≤ 1.75). */
export function maxPixelRatio(preset: DevicePreset): number {
  const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
  return Math.min(dpr, preset === "lite" ? 1.5 : 1.75);
}
