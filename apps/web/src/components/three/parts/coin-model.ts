/**
 * The Nexyyra monogram coin: reeded metallic gold rim, raised lips, enamel
 * faces carrying the monogram on both sides, a warm-gold key light, a purple
 * rim light and a RoomEnvironment reflection map so the gold reads as metal.
 */
import {
  AdditiveBlending,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PMREMGenerator,
  RepeatWrapping,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
} from "three";
import { createSpriteTexture, PALETTE } from "./particles";
import type { Stage } from "./stage";

export const COIN_TEXTURE_SRC = "/brand/android-chrome-512.png";
const THICKNESS = 0.14;

export interface Coin {
  /** Position / scale this (lights travel with it). */
  rig: Group;
  update(time: number, delta: number): void;
}

function reedingTexture() {
  const c = document.createElement("canvas");
  c.width = 16;
  c.height = 4;
  const ctx = c.getContext("2d");
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, 16, 0);
    g.addColorStop(0, "#000");
    g.addColorStop(0.5, "#fff");
    g.addColorStop(1, "#000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 4);
  }
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(140, 1);
  return t;
}

function paintFace(px: number, logo: HTMLImageElement | null) {
  const c = document.createElement("canvas");
  c.width = c.height = px;
  const ctx = c.getContext("2d");
  if (ctx) {
    const r = px / 2;
    const field = ctx.createRadialGradient(r * 0.8, r * 0.7, 0, r, r, r);
    field.addColorStop(0, "#1a2547");
    field.addColorStop(0.65, "#0c1430");
    field.addColorStop(1, "#060a1c");
    ctx.fillStyle = field;
    ctx.fillRect(0, 0, px, px);
    // Engraved hairline rings + a beaded border, in the site's gold.
    ctx.strokeStyle = "rgba(216,178,106,0.55)";
    ctx.lineWidth = px / 340;
    for (const k of [0.94, 0.885]) {
      ctx.beginPath();
      ctx.arc(r, r, r * k, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(244,208,141,0.7)";
    const beads = 72;
    for (let i = 0; i < beads; i += 1) {
      const a = (i / beads) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(r + Math.cos(a) * r * 0.912, r + Math.sin(a) * r * 0.912, px / 260, 0, Math.PI * 2);
      ctx.fill();
    }
    if (logo) {
      const s = px * 0.8;
      ctx.drawImage(logo, (px - s) / 2, (px - s) / 2 + px * 0.01, s, s);
    }
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

export function createCoin(stage: Stage): Coin {
  const lite = stage.preset === "lite";
  const segs = lite ? 64 : 112;
  const rig = new Group();
  const spinner = new Group();
  rig.add(spinner);

  const rimMat = new MeshStandardMaterial({
    color: PALETTE.gold,
    metalness: 1,
    roughness: 0.3,
    bumpMap: reedingTexture(),
    bumpScale: 0.8,
    envMapIntensity: 1.15,
  });
  const lipMat = new MeshStandardMaterial({
    color: PALETTE.champagne,
    metalness: 1,
    roughness: 0.2,
    envMapIntensity: 1.25,
  });
  const faceTex = paintFace(lite ? 256 : 512, null);
  const faceMat = new MeshStandardMaterial({
    map: faceTex,
    emissiveMap: faceTex,
    emissive: 0xffffff,
    emissiveIntensity: 0.1,
    metalness: 0.72,
    roughness: 0.36,
  });

  const edge = new Mesh(new CylinderGeometry(1, 1, THICKNESS, segs, 1, true), rimMat);
  edge.rotation.x = Math.PI / 2;
  spinner.add(edge);
  for (const side of [1, -1]) {
    const lip = new Mesh(new TorusGeometry(0.962, 0.046, lite ? 10 : 16, segs), lipMat);
    lip.position.z = (side * THICKNESS) / 2;
    spinner.add(lip);
    const face = new Mesh(new CircleGeometry(0.93, segs), faceMat);
    face.position.z = (side * THICKNESS) / 2 - side * 0.004;
    if (side < 0) face.rotation.y = Math.PI;
    spinner.add(face);
  }

  // Soft halo behind the coin.
  const halo = new Sprite(
    new SpriteMaterial({
      map: createSpriteTexture(64),
      color: PALETTE.gold,
      blending: AdditiveBlending,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      fog: false,
    }),
  );
  halo.scale.setScalar(4.2);
  halo.position.z = -0.6;
  rig.add(halo);

  const key = new DirectionalLight(PALETTE.champagne, 2.6);
  key.position.set(-3, 4, 5);
  const rimLight = new DirectionalLight(PALETTE.purple, 3.4);
  rimLight.position.set(4, 1, -3.5);
  const fill = new DirectionalLight(0xffffff, 0.35);
  fill.position.set(2, -3, 4);
  for (const l of [key, rimLight, fill]) {
    rig.add(l, l.target);
  }

  // Reflections: RoomEnvironment is an addon, so it is imported on demand.
  let envReady = false;
  void import("three/examples/jsm/environments/RoomEnvironment.js")
    .then(({ RoomEnvironment }) => {
      if (stage.isDisposed()) return;
      const pmrem = new PMREMGenerator(stage.renderer);
      const room = new RoomEnvironment();
      const target = stage.track(pmrem.fromScene(room, 0.035));
      stage.scene.environment = target.texture;
      stage.scene.environmentIntensity = 0.9;
      room.dispose();
      pmrem.dispose();
    })
    .catch(() => undefined)
    .finally(() => {
      envReady = true;
      stage.invalidate();
    });

  let logoReady = false;
  const img = new Image();
  img.decoding = "async";
  img.src = COIN_TEXTURE_SRC;
  img
    .decode()
    .then(() => {
      if (stage.isDisposed()) return;
      const painted = paintFace(lite ? 256 : 512, img);
      faceMat.map = painted;
      faceMat.emissiveMap = painted;
      faceMat.needsUpdate = true;
      faceTex.dispose();
    })
    .catch(() => undefined)
    .finally(() => {
      logoReady = true;
      stage.invalidate();
    });

  let arrival = 0;
  spinner.scale.setScalar(0.001);
  spinner.rotation.y = -0.9;

  return {
    rig,
    update(time, delta) {
      if (stage.still) {
        // Motion "reduced": one flattering still — face turned 3/4 toward the warm
        // key light (upper left) so the reeded rim catches the purple rim light.
        // Hidden until the logo and reflections are in, then shown at rest.
        const ready = envReady && logoReady;
        spinner.scale.setScalar(ready ? 1 : 0.001);
        halo.material.opacity = ready ? 0.32 : 0;
        spinner.rotation.set(0.14, -0.62, -0.05);
        spinner.position.y = 0;
        return;
      }
      if (envReady && logoReady && arrival < 1) arrival = Math.min(1, arrival + delta / 1.6);
      const eased = 1 - Math.pow(1 - arrival, 3);
      spinner.scale.setScalar(arrival > 0 ? 0.82 + 0.18 * eased : 0.001);
      halo.material.opacity = 0.32 * eased;
      spinner.rotation.y += delta * (0.42 + (1 - eased) * 1.6);
      spinner.rotation.x = 0.2 * Math.sin(time * 0.5) + stage.pointer.y * 0.16;
      spinner.rotation.z = 0.07 * Math.sin(time * 0.37) - stage.pointer.x * 0.08;
      spinner.position.y = 0.06 * Math.sin(time * 0.8);
    },
  };
}
