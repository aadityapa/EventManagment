/**
 * Hero scene — deep champagne-gold particle field with purple accents, camera
 * parallax easing toward the pointer (gyro on phones) and the 3D Nexyyra coin.
 * V8: far behind both, large soft bokeh discs — event fairy lights out of
 * focus — drift and breathe slowly (parts/bokeh).
 *
 * Motion comes from the stage: time is pre-scaled (gentle ≈ 0.4×), the pointer
 * stays at rest unless the level is "full", and "off" renders one still frame.
 * Adaptive quality fades out the nearest particles and some bokeh.
 *
 * Coin placement comes from CSS custom properties on the host element so the
 * layout can move it without touching this module:
 *   --coin-x / --coin-y  position in % of the canvas (default 74% / 44%);
 *                        a px value (e.g. "221px") is measured from the canvas edge
 *   --coin-size          optional diameter in px (× --coin-scale), instead of the
 *                        height-relative default — for bands fixed in px
 *   --coin-scale         multiplier (default 1; 0 hides the coin)
 * The coin's screen position is held through the camera sway / parallax (its
 * drift is compensated on both axes), so a placement measured against nearby
 * layout (the cover's fairy-light canopy, the eyebrow, the H1) keeps its clearance.
 *
 * Shaders and textures are compiled / uploaded before the loop starts, so the
 * first animated frame is not a long one.
 */
import { FogExp2, Vector3, type CanvasTexture, type Material, type Object3D } from "three";
import { createBokeh } from "../parts/bokeh";
import { createCoin } from "../parts/coin-model";
import { createParticleField, PALETTE } from "../parts/particles";
import { createStage, type Disposer, type MountOptions } from "../parts/stage";

const CAMERA_Z = 10;
const LOOK_AT = new Vector3(0, 0, -6);
const COIN_Z = 0.5;
/** The share of the camera's offset that cancels the coin's screen drift (it looks at LOOK_AT). */
const COIN_HOLD = 1 - (CAMERA_Z - COIN_Z) / (CAMERA_Z - LOOK_AT.z);

interface CoinVars {
  x: number;
  y: number;
  scale: number;
  /** Diameter in px; 0 = the height-relative default. */
  size: number;
}

function readCoinVars(el: HTMLElement): CoinVars {
  const cs = getComputedStyle(el);
  const raw = (name: string) => cs.getPropertyValue(name).trim();
  const num = (name: string, fallback: number) => {
    const v = parseFloat(raw(name));
    return Number.isFinite(v) ? v : fallback;
  };
  /** % of `extent`; px values are converted. */
  const pct = (name: string, fallback: number, extent: number) => {
    const v = num(name, fallback);
    return raw(name).endsWith("px") ? (v / Math.max(1, extent)) * 100 : v;
  };
  return {
    x: pct("--coin-x", 74, el.clientWidth),
    y: pct("--coin-y", 44, el.clientHeight),
    scale: num("--coin-scale", 1),
    size: Math.max(0, num("--coin-size", 0)),
  };
}

export function mount(container: HTMLElement, opts: MountOptions): Disposer {
  const stage = createStage(container, opts.preset, { fov: 50, z: CAMERA_Z, far: 80 }, opts.motion);
  const { scene, camera } = stage;
  const lite = opts.preset === "lite";
  const intensity = Math.min(1, Math.max(0, opts.intensity));

  scene.fog = new FogExp2(PALETTE.navy, 0.03);

  const field = createParticleField(stage, {
    count: Math.round((lite ? 800 : 2400) * (0.5 + 0.5 * intensity)),
    near: 1.2,
    far: 36,
    size: lite ? 0.075 : 0.066,
    drift: 0.55,
    rise: 0.06,
    purpleShare: 0.07,
    intensity: 1.25 * intensity,
    fog: 0.036,
    focus: 9.5,
  });
  scene.add(field.points);

  const bokeh = createBokeh(stage, {
    count: Math.round((lite ? 16 : 40) * (0.5 + 0.5 * intensity)),
    near: 22,
    far: 40,
    intensity: (lite ? 0.26 : 0.22) * intensity,
  });
  scene.add(bokeh.mesh);

  // The particle field thins itself (parts/particles: nearest, largest sprites
  // first — the fill cost); the bokeh drops some of its discs. Both fade out.
  stage.onQualityChange((level) => bokeh.setQuality(level));

  const coin = createCoin(stage);
  scene.add(coin.rig);

  let vars = readCoinVars(container);
  let coinX = 0;
  let coinY = 0;
  const placeCoin = () => {
    const depth = CAMERA_Z - COIN_Z;
    const halfH = depth * Math.tan((camera.fov * Math.PI) / 360);
    const halfW = halfH * camera.aspect;
    coinX = ((vars.x / 100) * 2 - 1) * halfW;
    coinY = (1 - (vars.y / 100) * 2) * halfH;
    coin.rig.position.set(coinX + camera.position.x * COIN_HOLD, coinY + camera.position.y * COIN_HOLD, COIN_Z);
    // Diameter ≈ 34% of the canvas height (lite: smaller), capped by its width —
    // or exactly --coin-size px when the layout sets one.
    const base = vars.size > 0 ? (vars.size / Math.max(1, stage.size.height)) * halfH : Math.min(halfH * 0.34, halfW * 0.42) * (lite ? 0.78 : 1);
    const radius = base * vars.scale;
    coin.rig.scale.setScalar(Math.max(radius, 0.0001));
    coin.rig.visible = vars.scale > 0;
  };
  stage.onResize(() => {
    vars = readCoinVars(container);
    placeCoin();
  });

  let sinceVars = 0;
  const frame = (time: number, delta: number) => {
    field.update(time);
    bokeh.update(time);

    // Layout packages may change the vars at a breakpoint without a resize.
    sinceVars += delta;
    if (sinceVars > 1.5) {
      sinceVars = 0;
      const next = readCoinVars(container);
      if (next.x !== vars.x || next.y !== vars.y || next.scale !== vars.scale || next.size !== vars.size) {
        vars = next;
        placeCoin();
      }
    }

    const swayX = Math.sin(time * 0.07) * 0.35;
    const swayY = Math.cos(time * 0.05) * 0.2;
    camera.position.x = stage.pointer.x * 1.1 + swayX;
    camera.position.y = stage.pointer.y * 0.65 + swayY;
    camera.lookAt(LOOK_AT);
    coin.rig.position.x = coinX + camera.position.x * COIN_HOLD;
    coin.rig.position.y = coinY + camera.position.y * COIN_HOLD;

    if (coin.rig.visible) coin.update(time, delta);
  };

  // Compile every program and upload the textures in this (idle) mount slot, off
  // the frame; the loop / still frame starts once that is done (or failed).
  const begin = () => {
    if (!stage.isDisposed()) stage.start(frame);
  };
  scene.traverse((obj) => {
    const material = (obj as Object3D & { material?: Material }).material;
    for (const value of Object.values(material ?? {})) {
      // Canvas-painted maps only: loaded images may not be decoded yet.
      if ((value as CanvasTexture | null)?.isCanvasTexture) stage.renderer.initTexture(value as CanvasTexture);
    }
  });
  stage.renderer.compileAsync(scene, camera).then(begin, begin);

  return () => stage.dispose();
}
