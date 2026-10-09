/**
 * Hero scene — deep champagne-gold particle field with purple accents, camera
 * parallax easing toward the pointer (gyro on phones) and the 3D Nexyyra coin.
 *
 * Coin placement comes from CSS custom properties on the host element so the
 * layout can move it without touching this module:
 *   --coin-x / --coin-y  position in % of the canvas (default 74% / 44%)
 *   --coin-scale         multiplier (default 1; 0 hides the coin)
 */
import { FogExp2, Vector3 } from "three";
import { createCoin } from "../parts/coin-model";
import { createParticleField, PALETTE } from "../parts/particles";
import { createStage, type Disposer, type MountOptions } from "../parts/stage";

const CAMERA_Z = 10;
const LOOK_AT = new Vector3(0, 0, -6);
const COIN_Z = 0.5;

interface CoinVars {
  x: number;
  y: number;
  scale: number;
}

function readCoinVars(el: HTMLElement): CoinVars {
  const cs = getComputedStyle(el);
  const num = (name: string, fallback: number) => {
    const v = parseFloat(cs.getPropertyValue(name));
    return Number.isFinite(v) ? v : fallback;
  };
  return { x: num("--coin-x", 74), y: num("--coin-y", 44), scale: num("--coin-scale", 1) };
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

  const coin = createCoin(stage);
  scene.add(coin.rig);

  let vars = readCoinVars(container);
  const placeCoin = () => {
    const depth = CAMERA_Z - COIN_Z;
    const halfH = depth * Math.tan((camera.fov * Math.PI) / 360);
    const halfW = halfH * camera.aspect;
    coin.rig.position.set(((vars.x / 100) * 2 - 1) * halfW, (1 - (vars.y / 100) * 2) * halfH, COIN_Z);
    // Diameter ≈ 34% of the canvas height (lite: smaller), capped by its width.
    const radius = Math.min(halfH * 0.34, halfW * 0.42) * (lite ? 0.78 : 1) * vars.scale;
    coin.rig.scale.setScalar(Math.max(radius, 0.0001));
    coin.rig.visible = vars.scale > 0;
  };
  stage.onResize(() => {
    vars = readCoinVars(container);
    placeCoin();
  });

  let sinceVars = 0;
  stage.start((time, delta) => {
    field.update(time);

    // Layout packages may change the vars at a breakpoint without a resize.
    sinceVars += delta;
    if (sinceVars > 1.5) {
      sinceVars = 0;
      const next = readCoinVars(container);
      if (next.x !== vars.x || next.y !== vars.y || next.scale !== vars.scale) {
        vars = next;
        placeCoin();
      }
    }

    const swayX = Math.sin(time * 0.07) * 0.35;
    const swayY = Math.cos(time * 0.05) * 0.2;
    camera.position.x = stage.pointer.x * 1.1 + swayX;
    camera.position.y = stage.pointer.y * 0.65 + swayY;
    camera.lookAt(LOOK_AT);

    if (coin.rig.visible) coin.update(time, delta);
  });

  return () => stage.dispose();
}
