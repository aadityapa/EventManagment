/**
 * Coin scene — the Nexyyra monogram coin alone, centred and framed to fit the
 * host (404 page, About leadership header). Pointer tilts it gently.
 */
import { createCoin } from "../parts/coin-model";
import { createStage, type Disposer, type MountOptions } from "../parts/stage";

const FOV = 32;

export function mount(container: HTMLElement, opts: MountOptions): Disposer {
  const stage = createStage(container, opts.preset, { fov: FOV, z: 6, far: 40 }, opts.motion);
  const { camera } = stage;
  const intensity = Math.min(1, Math.max(0, opts.intensity));

  const coin = createCoin(stage);
  stage.scene.add(coin.rig);

  let distance = 6;
  stage.onResize(() => {
    // Fit a coin of radius 1 (plus breathing room) inside the shorter side.
    const fit = 1.4 / Math.tan((FOV * Math.PI) / 360);
    distance = fit / Math.min(1, camera.aspect);
    coin.rig.scale.setScalar(0.85 + 0.15 * intensity);
  });

  stage.start((time, delta) => {
    camera.position.set(stage.pointer.x * 0.5, stage.pointer.y * 0.35, distance);
    camera.lookAt(0, 0, 0);
    coin.update(time, delta);
  });

  return () => stage.dispose();
}
