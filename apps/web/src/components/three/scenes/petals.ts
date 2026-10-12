/**
 * Petals scene — rose petals and a few gold-leaf flecks falling softly with a
 * gentle wind sway (parts/petals), lit by a warm key, a faint purple rim and
 * a blush fill from every side (a hemisphere with a warm ground plus a soft
 * ambient), so a petal turned away from the key stays rose, never dark.
 * Transparent canvas: it sits over a photo or a plate and under the copy (the
 * host's CSS dims and masks it where text sits).
 *
 * ≈ 70 petals on full, 28 on lite, scaled by intensity. The stage supplies the
 * motion level (time pre-scaled for gentle, pointer only on full, one composed
 * still frame for off), offscreen pause and adaptive quality. The petal
 * texture is uploaded and the programs compiled before the loop starts, so the
 * first frame is not a long one.
 */
import { AmbientLight, DirectionalLight, HemisphereLight, Vector3 } from "three";
import { createPetals } from "../parts/petals";
import { createStage, type Disposer, type MountOptions } from "../parts/stage";

const LOOK_AT = new Vector3(0, 0, 0);

export function mount(container: HTMLElement, opts: MountOptions): Disposer {
  const stage = createStage(container, opts.preset, { fov: 45, z: 10, far: 40 }, opts.motion);
  const { scene, camera } = stage;
  const lite = opts.preset === "lite";
  const intensity = Math.min(1, Math.max(0, opts.intensity));

  scene.add(new HemisphereLight(0xfff3e6, 0xb48a95, 1.2), new AmbientLight(0xffe9ee, 0.35));
  const key = new DirectionalLight(0xffe2b8, 2.1);
  key.position.set(-3, 5, 6);
  const rim = new DirectionalLight(0xc9a0ff, 0.55);
  rim.position.set(4, -2, -5);
  scene.add(key, rim);

  const petals = createPetals(stage, {
    count: Math.round((lite ? 28 : 70) * (0.4 + 0.6 * intensity)),
    near: 5,
    far: 15,
  });
  scene.add(...petals.meshes);
  stage.onQualityChange((level) => petals.setQuality(level));

  const frame = (time: number) => {
    petals.update(time);
    camera.position.x = stage.pointer.x * 0.45;
    camera.position.y = stage.pointer.y * 0.28;
    camera.lookAt(LOOK_AT);
  };

  // Upload the canvas texture and compile the petal / fleck programs here, in the
  // (idle) mount slot, instead of inside the first rAF; the stage's data-scene
  // stays unset until that first real frame renders.
  const begin = () => {
    if (!stage.isDisposed()) stage.start(frame);
  };
  stage.renderer.initTexture(petals.texture);
  stage.renderer.compileAsync(scene, camera).then(begin, begin);

  return () => stage.dispose();
}
