/**
 * Dust scene — a lighter, slower gold particle field for inner-page covers and
 * the About hero. No coin, gentle pointer parallax.
 */
import { Vector3 } from "three";
import { createParticleField } from "../parts/particles";
import { createStage, type Disposer, type MountOptions } from "../parts/stage";

const LOOK_AT = new Vector3(0, 0, -8);

export function mount(container: HTMLElement, opts: MountOptions): Disposer {
  const stage = createStage(container, opts.preset, { fov: 50, z: 10, far: 70 }, opts.motion);
  const lite = opts.preset === "lite";
  const intensity = Math.min(1, Math.max(0, opts.intensity));

  const field = createParticleField(stage, {
    count: Math.round((lite ? 300 : 700) * (0.55 + 0.45 * intensity)),
    near: 2.5,
    far: 30,
    size: 0.056,
    drift: 0.4,
    rise: 0.035,
    purpleShare: 0.05,
    intensity: 1.05 * intensity,
    fog: 0.05,
    focus: 10,
  });
  stage.scene.add(field.points);

  stage.start((time) => {
    field.update(time * 0.7);
    stage.camera.position.x = stage.pointer.x * 0.6 + Math.sin(time * 0.05) * 0.25;
    stage.camera.position.y = stage.pointer.y * 0.35;
    stage.camera.lookAt(LOOK_AT);
  });

  return () => stage.dispose();
}
