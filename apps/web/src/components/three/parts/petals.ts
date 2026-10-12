/**
 * Falling rose petals: instanced, cupped and curled petal geometry with a soft
 * canvas-painted petal texture (pale base, darker rim, faint veins), velvet
 * sheen, tinted blush / ivory / soft rose / deep rose, plus a few gold-leaf
 * flecks that glint as they turn. A faint rose emissive keeps edge-on and
 * back-lit petals rose-toned instead of grey or near-black, and the petals
 * nearest the camera are drawn smaller so none reads as a large blob.
 *
 * Motion is analytic — every petal's position and tumble is a pure function
 * of time — so there is no simulation state: the scaled clock of a gentle
 * stage simply slows it, and the still frame of an "off" stage is a composed,
 * repeatable arrangement. Petals recycle by wrapping: each fall cycle draws a
 * fresh column, so the pattern never visibly repeats.
 */
import {
  CanvasTexture,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  Euler,
  InstancedMesh,
  Matrix4,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  SRGBColorSpace,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three";
import type { Stage } from "./stage";

export interface PetalOptions {
  /** Petals at quality 0 (gold flecks are added on top, ~1 per 7 petals). */
  count: number;
  /** Camera-distance range the petals fall through. */
  near: number;
  far: number;
}

export interface Petals {
  meshes: InstancedMesh[];
  /** The canvas-painted petal map (for an upfront upload; disposed with its material). */
  texture: CanvasTexture;
  update(time: number): void;
  /** 0 = every petal, 1 = ~70%, 2 = ~45% (adaptive quality). */
  setQuality(level: 0 | 1 | 2): void;
}

/** Blush, ivory, soft rose, deep rose — weights sum to 1. */
const TINTS: Array<[number, number]> = [
  [0xe9b7b9, 0.38],
  [0xf3e6d8, 0.2],
  [0xd88a96, 0.24],
  [0xb04a60, 0.18],
];

/** Rose emissive floor: an unlit petal face still reads as a petal. */
const PETAL_GLOW = 0x3a1f26;

/** Small deterministic PRNG so the still frame is the same composition every time. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 0..1 hash for the per-cycle column of a petal. */
function hash(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function petalTexture(): CanvasTexture {
  const w = 128;
  const h = 160;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const outline = () => {
      ctx.beginPath();
      ctx.moveTo(64, 156);
      ctx.bezierCurveTo(30, 140, 5, 98, 9, 56);
      ctx.bezierCurveTo(13, 20, 38, 4, 57, 10);
      ctx.quadraticCurveTo(64, 15, 71, 10);
      ctx.bezierCurveTo(90, 4, 115, 20, 119, 56);
      ctx.bezierCurveTo(123, 98, 98, 140, 64, 156);
      ctx.closePath();
    };
    // Pale at the base, fuller in the body, a touch darker at the rim.
    const g = ctx.createRadialGradient(64, 150, 4, 64, 92, 112);
    g.addColorStop(0, "rgb(255,252,244)");
    g.addColorStop(0.32, "rgb(246,240,240)");
    g.addColorStop(0.78, "rgb(226,216,220)");
    g.addColorStop(1, "rgb(196,184,190)");
    outline();
    ctx.fillStyle = g;
    ctx.fill();
    // Faint veins fanning from the base.
    ctx.save();
    outline();
    ctx.clip();
    ctx.strokeStyle = "rgba(150,118,128,0.16)";
    ctx.lineWidth = 1;
    for (let i = -3; i <= 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(64, 154);
      ctx.quadraticCurveTo(64 + i * 9, 96, 64 + i * 17, 18);
      ctx.stroke();
    }
    ctx.restore();
    // Feather the edge so it reads as thin and translucent, not cut paper.
    ctx.globalCompositeOperation = "destination-out";
    outline();
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 2;
  return tex;
}

/** A plane cupped across its width and curled back toward the tip. */
function petalGeometry(): BufferGeometry {
  const geo = new PlaneGeometry(0.8, 1, 5, 7);
  const pos = geo.getAttribute("position");
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i) / 0.4; // -1..1
    const v = pos.getY(i) + 0.5; // 0 base .. 1 tip
    const cup = 0.17 * x * x * (0.45 + 0.55 * v);
    const curl = -0.16 * v * v * v;
    pos.setZ(i, cup + curl);
  }
  geo.computeVertexNormals();
  return geo;
}

interface Petal {
  depth: number;
  start: number;
  fall: number;
  swayA: number;
  swayF: number;
  phase: number;
  rot: [number, number, number];
  spin: [number, number, number];
  size: number;
}

function makePetals(n: number, rand: () => number, o: PetalOptions, fleck: boolean): Petal[] {
  return Array.from({ length: n }, () => {
    const depth = o.near + (o.far - o.near) * rand();
    // ×0.7 at the near plane, full size from 2 units behind it.
    const nearScale = 0.7 + 0.3 * Math.min(1, (depth - o.near) / 2);
    return {
      depth,
      start: rand(),
      fall: (fleck ? 0.42 : 0.34) + rand() * 0.38,
      swayA: 0.22 + rand() * 0.42,
      swayF: 0.45 + rand() * 0.5,
      phase: rand() * Math.PI * 2,
      rot: [rand() * Math.PI * 2, rand() * Math.PI * 2, rand() * Math.PI * 2],
      spin: fleck
        ? [1.4 + rand() * 1.6, 0.8 + rand() * 1.2, rand() * 0.6]
        : [0.35 + rand() * 0.7, 0.2 + rand() * 0.6, (rand() - 0.5) * 0.4],
      size: (fleck ? 0.07 + rand() * 0.05 : 0.24 + rand() * 0.2) * nearScale,
    };
  });
}

export function createPetals(stage: Stage, o: PetalOptions): Petals {
  const { camera } = stage;
  const lite = stage.preset === "lite";
  const tanHalf = Math.tan((camera.fov * Math.PI) / 360);
  const baseZ = camera.position.z;
  const rand = mulberry32(0x5eed + o.count);

  const petalCount = Math.max(1, Math.round(o.count));
  const fleckCount = Math.max(2, Math.round(petalCount / 7));
  const petals = makePetals(petalCount, rand, o, false);
  const flecks = makePetals(fleckCount, rand, o, true);

  const map = petalTexture(); // disposed with its material by the stage teardown
  // Velvet sheen on full; plain standard shading on lite. Alpha-to-coverage
  // gives soft petal edges wherever the renderer has MSAA (full preset).
  const petalMaterial: Material = lite
    ? new MeshStandardMaterial({ map, roughness: 0.62, side: DoubleSide, alphaTest: 0.45, emissive: PETAL_GLOW, emissiveIntensity: 0.35 })
    : new MeshPhysicalMaterial({
        map,
        emissive: PETAL_GLOW,
        emissiveIntensity: 0.35,
        roughness: 0.58,
        sheen: 1,
        sheenRoughness: 0.42,
        sheenColor: new Color(0xffd9de),
        side: DoubleSide,
        alphaTest: 0.08,
        alphaToCoverage: true,
      });
  // Gold leaf: a champagne-gold emissive floor (no env map here, so a fully metallic
  // leaf turned edge-on to the key read as a dark brown chip), still glinting on the turn.
  const fleckMaterial = new MeshStandardMaterial({
    color: 0xd8b26a,
    emissive: 0xd8b26a,
    emissiveIntensity: 0.5,
    metalness: 0.6,
    roughness: 0.32,
    side: DoubleSide,
  });

  const petalMesh = new InstancedMesh(petalGeometry(), petalMaterial, petalCount);
  const fleckMesh = new InstancedMesh(new PlaneGeometry(1, 0.8), fleckMaterial, fleckCount);
  const color = new Color();
  for (let i = 0; i < petalCount; i += 1) {
    let acc = 0;
    const roll = rand();
    const hex = TINTS.find(([, w]) => (acc += w) > roll)?.[0] ?? TINTS[0][0];
    petalMesh.setColorAt(i, color.setHex(hex));
  }
  for (const mesh of [petalMesh, fleckMesh]) {
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    mesh.frustumCulled = false;
  }

  const m = new Matrix4();
  const p = new Vector3();
  const q = new Quaternion();
  const s = new Vector3();
  const e = new Euler();
  const margin = 0.7;

  // Adaptive quality never pops a petal in or out mid-air: a petal only joins or
  // leaves the fall when it wraps (below the frame → above it, both offscreen).
  // `keep` is the target count; `on` / `seen` hold each petal's state for its
  // current cycle. Dropped petals below the top live index draw at scale 0.
  type Fall = { list: Petal[]; keep: number; on: Uint8Array; seen: Float64Array };
  const fall = (list: Petal[]): Fall => ({
    list,
    keep: list.length,
    on: new Uint8Array(list.length).fill(1),
    seen: new Float64Array(list.length).fill(Number.NaN),
  });
  const petalFall = fall(petals);
  const fleckFall = fall(flecks);
  const hidden = new Matrix4().makeScale(0, 0, 0);

  const place = (mesh: InstancedMesh, f: Fall, time: number, salt: number) => {
    // A shared, bounded breeze: the whole fall leans and eases back.
    const wind = 0.38 * Math.sin(time * 0.11) + 0.2 * Math.sin(time * 0.047 + 1.3);
    let top = 0;
    for (let i = 0; i < f.list.length; i += 1) {
      const it = f.list[i];
      const halfH = it.depth * tanHalf;
      const halfW = halfH * camera.aspect;
      const span = 2 * (halfH + margin);
      const travel = it.start * span + time * it.fall;
      const cycle = Math.floor(travel / span);
      if (cycle !== f.seen[i]) {
        f.seen[i] = cycle;
        f.on[i] = i < f.keep ? 1 : 0;
      }
      if (!f.on[i]) {
        mesh.setMatrixAt(i, hidden);
        continue;
      }
      top = i + 1;
      const y = halfH + margin - (travel - cycle * span);
      const column = hash(i * 31.7 + cycle * 7.13 + salt) * 2 - 1;
      const sway = Math.sin(time * it.swayF + it.phase);
      const x = column * (halfW + 0.3) + sway * it.swayA + wind * (0.6 + 0.4 * it.swayA);
      p.set(x, y, baseZ - it.depth);
      // Flutter is coupled to the sway, so a petal tips as it swings.
      e.set(
        it.rot[0] + time * it.spin[0] + sway * 0.55,
        it.rot[1] + time * it.spin[1],
        it.rot[2] + time * it.spin[2] + Math.cos(time * it.swayF * 0.7 + it.phase) * 0.45,
      );
      q.setFromEuler(e);
      s.setScalar(it.size);
      mesh.setMatrixAt(i, m.compose(p, q, s));
    }
    mesh.count = Math.max(1, top);
    mesh.instanceMatrix.needsUpdate = true;
  };

  return {
    meshes: [petalMesh, fleckMesh],
    texture: map,
    update(time) {
      place(petalMesh, petalFall, time, 0);
      place(fleckMesh, fleckFall, time, 97);
    },
    setQuality(level) {
      const keep = [1, 0.7, 0.45][level];
      petalFall.keep = Math.max(1, Math.round(petalCount * keep));
      fleckFall.keep = Math.max(1, Math.round(fleckCount * keep));
    },
  };
}
