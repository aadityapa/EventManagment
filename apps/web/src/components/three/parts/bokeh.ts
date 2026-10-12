/**
 * Out-of-focus event lights: large soft bokeh discs (warm gold, champagne, a
 * little blush and purple) far behind the gold particles, the look of fairy
 * lights strung across a reception tent seen through a fast lens.
 *
 * One instanced draw call of camera-facing quads (no point-size limits), an
 * analytic disc with a faint brighter rim in the fragment shader (no texture),
 * additive blending, drifting and breathing very slowly. Draw count steps
 * down with the stage's adaptive quality, fading the dropped discs out (and
 * back in) over ~1 s instead of cutting them.
 */
import {
  AdditiveBlending,
  Color,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
} from "three";
import { createShareFade, type Stage } from "./stage";

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uAspect;
uniform float uIntensity;
uniform float uCut;      // adaptive quality: discs ranked above the cut fade out
uniform float uBand;
attribute vec3 aCenter;  // x in units of the band height (widened by uAspect), y, z
attribute vec4 aSeed;    // phase, speed, world size, edge softness
attribute vec4 aColor;   // rgb, brightness
attribute float aRank;   // 0..1 draw order
varying vec2 vUv;
varying vec3 vColor;
varying float vAlpha;
varying float vSoft;

void main() {
  vec3 c = aCenter;
  float t = uTime * aSeed.y;
  c.x = c.x * uAspect + sin(t * 0.05 + aSeed.x) * 0.9 + sin(t * 0.021 + aSeed.x * 2.3) * 0.55;
  c.y += cos(t * 0.043 + aSeed.x * 1.3) * 0.6;

  vec4 mv = modelViewMatrix * vec4(c, 1.0);
  mv.xy += position.xy * aSeed.z;  // billboard in view space
  gl_Position = projectionMatrix * mv;

  // Breathes over ~25-40 s: never a flicker.
  float breathe = 0.74 + 0.26 * sin(uTime * 0.17 * aSeed.y + aSeed.x * 4.0);
  vUv = position.xy * 2.0;
  vColor = aColor.rgb;
  vAlpha = uIntensity * aColor.a * breathe * clamp((uCut - aRank) / uBand, 0.0, 1.0);
  vSoft = aSeed.w;
}
`;

const fragmentShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vColor;
varying float vAlpha;
varying float vSoft;

void main() {
  float r = length(vUv);
  float disc = 1.0 - smoothstep(1.0 - vSoft, 1.0, r);
  if (disc <= 0.001) discard;
  // A lens disc is nearly flat with a slightly brighter edge.
  float rim = smoothstep(0.5, 0.9, r) * (1.0 - smoothstep(0.9, 1.0, r));
  float a = disc * (0.58 + 0.42 * rim) * vAlpha;
  gl_FragColor = vec4(vColor, 1.0);
  #include <colorspace_fragment>
  gl_FragColor = vec4(gl_FragColor.rgb * a, a);
}
`;

export interface BokehOptions {
  count: number;
  /** Camera-distance range of the discs (far behind the particle field). */
  near: number;
  far: number;
  /** Overall alpha, before per-light brightness. */
  intensity: number;
}

export interface Bokeh {
  mesh: Mesh;
  update(time: number): void;
  /** 0 = every light, 1 = ~70%, 2 = ~45% (adaptive quality). */
  setQuality(level: 0 | 1 | 2): void;
}

// Warm gold, champagne, warm white, blush, purple — weights sum to 1.
const SWATCHES: Array<[number, number]> = [
  [0xd8b26a, 0.38],
  [0xf4d08d, 0.3],
  [0xfff1d6, 0.1],
  [0xe9b0a8, 0.13],
  [0xb47cff, 0.09],
];

function pick(roll: number): Color {
  let acc = 0;
  for (const [hex, weight] of SWATCHES) {
    acc += weight;
    if (roll < acc) return new Color(hex);
  }
  return new Color(SWATCHES[0][0]);
}

export function createBokeh(stage: Stage, o: BokehOptions): Bokeh {
  const { camera } = stage;
  const tanHalf = Math.tan((camera.fov * Math.PI) / 360);
  const count = Math.max(1, Math.round(o.count));

  const center = new Float32Array(count * 3);
  const seed = new Float32Array(count * 4);
  const color = new Float32Array(count * 4);
  const rank = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    rank[i] = i / count;
    const d = o.near + (o.far - o.near) * Math.random();
    const halfH = d * tanHalf;
    // Biased toward the top of the frame, where strung lights hang.
    const y = (1 - 2 * Math.pow(Math.random(), 1.35)) * halfH * 1.05;
    const x = (Math.random() * 2 - 1) * halfH * 1.12;
    const depthFade = 1 - 0.4 * ((d - o.near) / Math.max(o.far - o.near, 0.001));
    const c = pick(Math.random());
    center.set([x, y, camera.position.z - d], i * 3);
    seed.set(
      [
        Math.random() * Math.PI * 2,
        0.6 + Math.random() * 0.8,
        // 5-16% of the view height across.
        2 * halfH * (0.05 + Math.pow(Math.random(), 1.6) * 0.11),
        0.06 + Math.random() * 0.22,
      ],
      i * 4,
    );
    color.set([c.r, c.g, c.b, (0.55 + Math.random() * 0.45) * depthFade], i * 4);
  }

  const quad = new PlaneGeometry(1, 1);
  const geometry = new InstancedBufferGeometry();
  geometry.index = quad.index;
  geometry.setAttribute("position", quad.getAttribute("position"));
  geometry.setAttribute("aCenter", new InstancedBufferAttribute(center, 3));
  geometry.setAttribute("aSeed", new InstancedBufferAttribute(seed, 4));
  geometry.setAttribute("aColor", new InstancedBufferAttribute(color, 4));
  geometry.setAttribute("aRank", new InstancedBufferAttribute(rank, 1));
  geometry.instanceCount = count;
  quad.dispose();

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    premultipliedAlpha: true,
    uniforms: {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uIntensity: { value: o.intensity },
      uCut: { value: 2 },
      uBand: { value: 0.12 },
    },
  });
  const fade = createShareFade([1, 0.7, 0.45]);
  material.uniforms.uBand.value = fade.band;

  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1;

  stage.onResize(() => {
    material.uniforms.uAspect.value = Math.min(Math.max(stage.size.width / stage.size.height, 0.55), 2.6);
  });

  return {
    mesh,
    update(time) {
      material.uniforms.uTime.value = time;
      material.uniforms.uCut.value = fade.update(time);
      geometry.instanceCount = Math.max(1, fade.count(count));
    },
    setQuality(level) {
      fade.set(level);
    },
  };
}
