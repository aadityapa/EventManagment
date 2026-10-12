/**
 * Shared WebGL stage: renderer + camera + loop with every V7 safety rule —
 * DPR caps per preset, RAF paused offscreen / in hidden tabs, eased pointer
 * (and gyro) parallax input, `webglcontextlost` handling and full disposal.
 *
 * Motion levels (html[data-motion], DESIGN.md §9):
 *  - "full": the loop runs at real speed with pointer / gyro parallax;
 *  - "gentle": the loop runs with time and delta scaled ×0.4 and no pointer /
 *    gyro input (`pointer` stays {0,0});
 *  - "off": a still stage — no RAF loop, no input. The frame callback runs once
 *    at STILL_TIME (delta 0) and is re-rendered only on resize or invalidate()
 *    (e.g. when the coin texture / reflections finish loading).
 *
 * GPU warm-up (V8 QA): the first render of a scene compiles its shaders and
 * uploads its textures — 35–150 ms of main-thread work that used to land in the
 * middle of a smooth scroll, the first time the host neared the viewport. start()
 * now warms the GPU in an idle slot instead (compileAsync, which uses
 * KHR_parallel_shader_compile where available, plus initTexture for every
 * texture) and draws one frame offscreen; the loop only starts after that, so the
 * first in-view tick just draws. invalidate() on an animated stage re-warms the
 * same way (late textures / environment maps): a running loop holds its last
 * frame until the new programs are compiled, so no frame ever compiles one.
 *
 * Adaptive quality (V8): the stage measures what a frame COSTS (main-thread time
 * of the scene update + render) and how far the rAF cadence falls behind the
 * display cadence it learned during warm-up — never the raw interval, so a capped
 * rAF (30 fps power saving, throttled views, 50 Hz panels) is not mistaken for a
 * slow GPU. A sustained slow stretch (~1.5 s) steps the pixel ratio down one level
 * (never below DPR 1 on desktop / 0.75 on lite) and tells scenes through
 * onQualityChange so they can draw fewer particles; a sustained fast stretch
 * (~6 s) steps back up, unless that level already proved too slow.
 * Only reachable from the dynamically imported scene modules.
 */
import {
  ACESFilmicToneMapping,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
  type Material,
  type Object3D,
  type Texture,
} from "three";
import { maxPixelRatio, type DevicePreset } from "../gating";
import type { MotionMode } from "../../motion/motion-mode";

export interface MountOptions {
  preset: DevicePreset;
  intensity: number;
  /** "gentle" runs at 0.4× speed without pointer parallax; "off" renders one still frame. Default "full". */
  motion?: MotionMode;
}

/** Scene clock used for the single still frame under motion "off". */
export const STILL_TIME = 9.5;
/** Time scale handed to frame callbacks per motion level. */
export const TIME_SCALE: Record<MotionMode, number> = { full: 1, gentle: 0.4, off: 0 };
/** 0 = best; each step lowers the pixel ratio (and lets scenes thin their draw counts). */
export type QualityLevel = 0 | 1 | 2;
export type Disposer = () => void;
export type SceneMount = (container: HTMLElement, opts: MountOptions) => Disposer;

const SLOW_FRAME_MS = 20;
/** Main-thread cost (scene update + render) above which a frame counts as slow. */
const SLOW_WORK_MS = 11;
const SLOW_FOR_MS = 1500;
const FAST_FOR_MS = 6000;
const WARMUP_MS = 1200;
/** Frames sampled to learn the display cadence before quality is judged. */
const CADENCE_SAMPLES = 30;

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

export interface Stage {
  readonly renderer: WebGLRenderer;
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly container: HTMLElement;
  readonly preset: DevicePreset;
  /** Eased pointer / gyro position, each axis in -1..1 (y up). Always {0,0} unless motion is "full". */
  readonly pointer: { x: number; y: number };
  readonly size: { width: number; height: number; pixelRatio: number };
  /** The motion level this stage was mounted with (a change remounts the scene). */
  readonly motion: MotionMode;
  /** True under motion "off": one frame per invalidate(), never a loop. */
  readonly still: boolean;
  /** Current adaptive-quality level (0 = best). */
  readonly quality: QualityLevel;
  isDisposed(): boolean;
  /** Still stages: re-render once on the next frame. Animated stages: hold the loop and re-warm the GPU (compile + upload), then resume. */
  invalidate(): void;
  onResize(cb: () => void): void;
  /** Called when adaptive quality changes level (after the stage has already set its pixel ratio). */
  onQualityChange(cb: (level: QualityLevel) => void): void;
  track<T extends { dispose(): void }>(resource: T): T;
  start(frame: (time: number, delta: number) => void): void;
  dispose(): void;
}

type Disposable = { dispose(): void };

/**
 * Adaptive-quality draw counts that fade instead of popping (V8). Items are
 * ranked 0..1; `cut` is handed to the shader, which fades an item over `band`
 * of rank as the cut passes it: alpha × clamp((cut − rank) / band, 0, 1). The
 * shown share eases toward the level's share at `perSecond` of scene time, and
 * `count(n)` is how many items still need drawing (fully faded ones are dropped).
 */
export interface ShareFade {
  readonly band: number;
  set(level: QualityLevel): void;
  /** Advance to scene time `time`; returns the current cut. */
  update(time: number): number;
  count(n: number): number;
}

export function createShareFade(shares: readonly [number, number, number], band = 0.12, perSecond = 0.25): ShareFade {
  let shown = 1;
  let goal = 1;
  let last = -1;
  return {
    band,
    set(level) {
      goal = shares[level];
    },
    update(time) {
      const dt = last < 0 ? 0 : Math.min(Math.max(time - last, 0), 0.1);
      last = time;
      if (shown < goal) shown = Math.min(goal, shown + perSecond * dt);
      else if (shown > goal) shown = Math.max(goal, shown - perSecond * dt);
      return shown * (1 + band);
    },
    count(n) {
      return Math.min(n, Math.ceil(n * Math.max(shown, goal) * (1 + band)));
    },
  };
}

function disposeMaterial(material: Material) {
  const record = material as unknown as Record<string, unknown>;
  for (const value of Object.values(record)) {
    if ((value as Texture | null)?.isTexture) (value as Texture).dispose();
  }
  const uniforms = (material as { uniforms?: Record<string, { value: unknown }> }).uniforms;
  if (uniforms) {
    for (const u of Object.values(uniforms)) {
      if ((u.value as Texture | null)?.isTexture) (u.value as Texture).dispose();
    }
  }
  material.dispose();
}

/** Every texture a material samples (own properties + shader uniforms). */
function materialTextures(material: Material, out: Set<Texture>) {
  const record = material as unknown as Record<string, unknown>;
  for (const value of Object.values(record)) {
    if ((value as Texture | null)?.isTexture) out.add(value as Texture);
  }
  const uniforms = (material as { uniforms?: Record<string, { value: unknown }> }).uniforms;
  if (uniforms) {
    for (const u of Object.values(uniforms)) {
      if ((u.value as Texture | null)?.isTexture) out.add(u.value as Texture);
    }
  }
}

function disposeTree(root: Object3D) {
  root.traverse((obj) => {
    const node = obj as Object3D & {
      geometry?: Disposable;
      material?: Material | Material[];
      isSprite?: boolean;
    };
    // Sprites share one module-level geometry; leave it to the renderer teardown.
    if (node.geometry && !node.isSprite) node.geometry.dispose();
    if (Array.isArray(node.material)) node.material.forEach(disposeMaterial);
    else if (node.material) disposeMaterial(node.material);
  });
}

export function createStage(
  container: HTMLElement,
  preset: DevicePreset,
  cam: { fov: number; z: number; near?: number; far?: number },
  motion: MotionMode = "full",
): Stage {
  const lite = preset === "lite";
  const still = motion === "off";
  const follow = motion === "full";
  const timeScale = TIME_SCALE[motion];
  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: !lite,
    powerPreference: lite ? "low-power" : "high-performance",
    stencil: false,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");
  canvas.tabIndex = -1;
  Object.assign(canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
  container.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(cam.fov, 1, cam.near ?? 0.1, cam.far ?? 120);
  camera.position.set(0, 0, cam.z);

  const size = { width: 1, height: 1, pixelRatio: maxPixelRatio(preset) };
  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const resizeCbs: Array<() => void> = [];
  const qualityCbs: Array<(level: QualityLevel) => void> = [];
  const tracked: Disposable[] = [];

  // Adaptive quality: the pixel ratio for each level, floored per preset.
  const floor = lite ? 0.75 : 1;
  let quality: QualityLevel = 0;
  const ratioFor = (level: QualityLevel) => {
    const best = maxPixelRatio(preset);
    if (level === 0) return best;
    return Math.max(Math.min(floor, best), level === 1 ? best * 0.75 : floor);
  };
  let avgGap = 16.7;
  let avgWork = 0;
  let slowMs = 0;
  let fastMs = 0;
  let runMs = 0;
  /** Display cadence (ms) learned from the first animated frames; 0 until learned. */
  let cadence = 0;
  const gaps: number[] = [];
  /** Best level allowed: a level that turned slow again right after a step up is not retried. */
  let ceiling: QualityLevel = 0;
  let upAt = -1;
  let clock = 0;

  let frameFn: ((time: number, delta: number) => void) | null = null;
  let raf = 0;
  let last = 0;
  let elapsed = 0;
  let visible = false;
  let lost = false;
  let disposed = false;
  let rendered = false;
  let pending = 0;
  // GPU warm-up: the loop waits for the first one (see the header).
  let warmed = still;
  let warmId = 0;
  let warmTimer: ReturnType<typeof setTimeout> | undefined;
  /** A compileAsync pass is in flight; `rewarm` asks for another once it lands. */
  let warming = false;
  let rewarm = false;
  const idle = window as IdleWindow;

  const markRendered = () => {
    if (rendered) return;
    rendered = true;
    container.dataset.scene = "ready";
  };

  const renderStill = () => {
    pending = 0;
    if (disposed || lost || !frameFn) return;
    frameFn(STILL_TIME, 0);
    renderer.render(scene, camera);
    markRendered();
  };

  const invalidate = () => {
    if (still && !pending && !disposed) pending = requestAnimationFrame(renderStill);
  };

  /**
   * Re-draw now, in the same task that resized the drawing buffer: setSize()
   * clears it, and a ResizeObserver callback or a quality step inside tick()
   * lands after this frame's render, so without this the cleared (blank)
   * buffer would be composited for a frame.
   */
  const redraw = () => {
    if (disposed || lost || !frameFn) return;
    if (still) {
      if (pending) cancelAnimationFrame(pending);
      renderStill();
    } else if (rendered) renderer.render(scene, camera);
  };

  const applySize = () => {
    const w = Math.max(1, Math.round(container.clientWidth));
    const h = Math.max(1, Math.round(container.clientHeight));
    size.width = w;
    size.height = h;
    size.pixelRatio = ratioFor(quality);
    renderer.setPixelRatio(size.pixelRatio);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    resizeCbs.forEach((cb) => cb());
  };

  const resize = () => {
    applySize();
    redraw();
  };

  const setQuality = (level: QualityLevel) => {
    if (level === quality) return;
    quality = level;
    applySize();
    // Even at the DPR floor (no ratio change) scenes still thin / restore their draw counts.
    qualityCbs.forEach((cb) => cb(quality));
    redraw();
    slowMs = 0;
    fastMs = 0;
    runMs = 0; // settle at the new level before judging it
  };

  /**
   * Judges frame COST, not cadence: `work` is the main-thread time of the scene
   * update + render; `gap` the rAF interval, compared with the display cadence
   * learned on the first frames (a 30 fps cap learns ~33 ms and is not "slow").
   */
  const watchFrame = (gap: number, work: number) => {
    clock += gap;
    runMs += gap;
    if (!cadence) {
      gaps.push(gap);
      if (gaps.length < CADENCE_SAMPLES || runMs < WARMUP_MS) return;
      gaps.sort((a, b) => a - b);
      cadence = Math.max(gaps[Math.floor(gaps.length / 4)], 4);
      gaps.length = 0;
      avgGap = cadence;
      runMs = 0;
      return;
    }
    if (runMs < WARMUP_MS) return;
    avgGap += (Math.min(gap, 100) - avgGap) * 0.1;
    avgWork += (work - avgWork) * 0.1;
    const lagging = avgGap > Math.max(SLOW_FRAME_MS, cadence * 1.3 + 4);
    const slow = lagging || avgWork > SLOW_WORK_MS;
    const fast = avgGap < cadence * 1.1 + 2 && avgWork < SLOW_WORK_MS * 0.5;
    slowMs = slow ? slowMs + gap : 0;
    fastMs = fast ? fastMs + gap : 0;
    if (slowMs >= SLOW_FOR_MS && quality < 2) {
      // Slow again soon after stepping up: that level is not sustainable here.
      if (upAt >= 0 && clock - upAt < FAST_FOR_MS * 2) ceiling = (quality + 1) as QualityLevel;
      upAt = -1;
      setQuality((quality + 1) as QualityLevel);
    } else if (fastMs >= FAST_FOR_MS && quality > ceiling) {
      upAt = clock;
      setQuality((quality - 1) as QualityLevel);
    }
  };

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const rawMs = Math.max(now - last, 0);
    last = now;
    const delta = Math.min(rawMs / 1000, 1 / 20) * timeScale;
    elapsed += delta;
    if (follow) {
      const ease = 1 - Math.exp(-delta * 2.4);
      pointer.x += (target.x - pointer.x) * ease;
      pointer.y += (target.y - pointer.y) * ease;
    }
    const workStart = performance.now();
    frameFn?.(elapsed, delta);
    renderer.render(scene, camera);
    watchFrame(rawMs, performance.now() - workStart);
    markRendered();
  };

  const sync = () => {
    const shouldRun = !still && warmed && Boolean(frameFn) && visible && !lost && !disposed && !document.hidden;
    if (shouldRun && !raf) {
      last = performance.now();
      // Resuming (scrolled back in, tab shown): the first frames are not representative.
      runMs = 0;
      slowMs = 0;
      fastMs = 0;
      raf = requestAnimationFrame(tick);
    } else if (!shouldRun && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  /** Compile every program and upload every texture the scene uses, then draw once offscreen. */
  const runWarm = () => {
    warmId = 0;
    warmTimer = undefined;
    if (disposed || lost || !frameFn) return;
    warming = true;
    rewarm = false;
    // Pose the scene at the current clock (delta 0: nothing advances) so the
    // compiled set matches what the loop will draw.
    frameFn(elapsed, 0);
    const done = () => {
      warming = false;
      if (disposed || lost) return;
      // The scene changed while compiling (an env map landed): compile that too.
      if (rewarm) {
        runWarm();
        return;
      }
      const textures = new Set<Texture>();
      scene.traverse((obj) => {
        const material = (obj as Object3D & { material?: Material | Material[] }).material;
        if (Array.isArray(material)) material.forEach((m) => materialTextures(m, textures));
        else if (material) materialTextures(material, textures);
      });
      textures.forEach((t) => {
        if (!(t as Texture & { isRenderTargetTexture?: boolean }).isRenderTargetTexture) renderer.initTexture(t);
      });
      if (!raf) {
        // The canvas may still be offscreen; drawing now uploads the buffers too.
        renderer.render(scene, camera);
        markRendered();
      }
      warmed = true;
      sync();
    };
    try {
      renderer.compileAsync(scene, camera).then(done, done);
    } catch {
      done();
    }
  };

  const warm = () => {
    if (still || disposed || lost || !frameFn || warmId || warmTimer) return;
    if (idle.requestIdleCallback) warmId = idle.requestIdleCallback(runWarm, { timeout: 600 });
    else warmTimer = setTimeout(runWarm, 60);
  };

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  let gyroBase: number | null = null;
  const onGyro = (e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return;
    gyroBase ??= e.beta;
    target.x = Math.max(-1, Math.min(1, e.gamma / 30));
    target.y = Math.max(-1, Math.min(1, (gyroBase - e.beta) / 30));
  };
  const onVisibility = () => sync();
  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    container.dataset.scene = "lost";
    sync();
  };

  const ro = new ResizeObserver(resize);
  ro.observe(container);
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      sync();
    },
    // Start (warmed) well before the host scrolls in, never on the in-view frame.
    { rootMargin: "50% 0px" },
  );
  io.observe(container);

  if (follow) {
    window.addEventListener("pointermove", onPointer, { passive: true });
    if (lite) window.addEventListener("deviceorientation", onGyro, { passive: true });
  }
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onLost);
  resize();

  const stage: Stage = {
    renderer,
    scene,
    camera,
    container,
    preset,
    pointer,
    size,
    motion,
    still,
    get quality() {
      return quality;
    },
    isDisposed: () => disposed,
    invalidate() {
      if (still) {
        invalidate();
        return;
      }
      // Animated: late textures / env maps change the scene's programs. Never let
      // the loop compile them inside a frame — hold it (the last frame stays on
      // the canvas), compile + upload, then resume. Looping: right away, so the
      // hold is only the async compile; not looping: in an idle slot.
      if (!frameFn || disposed || lost) return;
      if (warming) {
        rewarm = true;
        return;
      }
      if (!warmed) return; // the first warm-up is still pending and will see the change
      const looping = raf !== 0;
      warmed = false;
      sync();
      if (looping) runWarm();
      else warm();
    },
    onResize(cb) {
      resizeCbs.push(cb);
      cb();
    },
    onQualityChange(cb) {
      qualityCbs.push(cb);
    },
    track(resource) {
      if (disposed) resource.dispose();
      else tracked.push(resource);
      return resource;
    },
    start(frame) {
      frameFn = frame;
      if (still) invalidate();
      else if (warmed) sync();
      else warm();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (pending) cancelAnimationFrame(pending);
      pending = 0;
      if (warmId) idle.cancelIdleCallback?.(warmId);
      if (warmTimer) clearTimeout(warmTimer);
      warmId = 0;
      warmTimer = undefined;
      sync();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onGyro);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      disposeTree(scene);
      scene.environment?.dispose();
      scene.environment = null;
      tracked.splice(0).forEach((r) => r.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      delete container.dataset.scene;
    },
  };
  return stage;
}
