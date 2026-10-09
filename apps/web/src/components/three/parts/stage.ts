/**
 * Shared WebGL stage: renderer + camera + loop with every V7 safety rule —
 * DPR caps per preset, RAF paused offscreen / in hidden tabs, eased pointer
 * (and gyro) parallax input, `webglcontextlost` handling and full disposal.
 *
 * Motion "reduced" (the site motion preference, DESIGN.md §9) makes it a still
 * stage: no RAF loop and no pointer / gyro input. The frame callback runs once
 * at STILL_TIME (delta 0) and is re-rendered only on resize or invalidate()
 * (e.g. when the coin texture / reflections finish loading).
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
  /** "reduced" renders one still frame (no loop, no pointer parallax). Default "full". */
  motion?: MotionMode;
}

/** Scene clock used for the single still frame under motion "reduced". */
export const STILL_TIME = 9.5;
export type Disposer = () => void;
export type SceneMount = (container: HTMLElement, opts: MountOptions) => Disposer;

export interface Stage {
  readonly renderer: WebGLRenderer;
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly container: HTMLElement;
  readonly preset: DevicePreset;
  /** Eased pointer / gyro position, each axis in -1..1 (y up). */
  readonly pointer: { x: number; y: number };
  readonly size: { width: number; height: number; pixelRatio: number };
  /** True under motion "reduced": one frame per invalidate(), never a loop. */
  readonly still: boolean;
  isDisposed(): boolean;
  /** Still stages: re-render once on the next frame. Animated stages: no-op (the loop redraws). */
  invalidate(): void;
  onResize(cb: () => void): void;
  track<T extends { dispose(): void }>(resource: T): T;
  start(frame: (time: number, delta: number) => void): void;
  dispose(): void;
}

type Disposable = { dispose(): void };

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
  const still = motion === "reduced";
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
  const tracked: Disposable[] = [];

  let frameFn: ((time: number, delta: number) => void) | null = null;
  let raf = 0;
  let last = 0;
  let elapsed = 0;
  let visible = false;
  let lost = false;
  let disposed = false;
  let rendered = false;
  let pending = 0;

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

  const resize = () => {
    const w = Math.max(1, Math.round(container.clientWidth));
    const h = Math.max(1, Math.round(container.clientHeight));
    size.width = w;
    size.height = h;
    size.pixelRatio = maxPixelRatio(preset);
    renderer.setPixelRatio(size.pixelRatio);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    resizeCbs.forEach((cb) => cb());
    if (still) invalidate();
    else if (frameFn && !raf && rendered) renderer.render(scene, camera);
  };

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const delta = Math.min(Math.max((now - last) / 1000, 0), 1 / 20);
    last = now;
    elapsed += delta;
    const ease = 1 - Math.exp(-delta * 2.4);
    pointer.x += (target.x - pointer.x) * ease;
    pointer.y += (target.y - pointer.y) * ease;
    frameFn?.(elapsed, delta);
    renderer.render(scene, camera);
    markRendered();
  };

  const sync = () => {
    const shouldRun = !still && Boolean(frameFn) && visible && !lost && !disposed && !document.hidden;
    if (shouldRun && !raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    } else if (!shouldRun && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
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
    { rootMargin: "120px 0px" },
  );
  io.observe(container);

  if (!still) {
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
    still,
    isDisposed: () => disposed,
    invalidate,
    onResize(cb) {
      resizeCbs.push(cb);
      cb();
    },
    track(resource) {
      if (disposed) resource.dispose();
      else tracked.push(resource);
      return resource;
    },
    start(frame) {
      frameFn = frame;
      if (still) invalidate();
      else sync();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (pending) cancelAnimationFrame(pending);
      pending = 0;
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
