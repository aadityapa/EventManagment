/**
 * Champagne-gold particle field: soft canvas-generated sprites, sorted back to
 * front, drifting through a divergence-free (curl-like) sinusoidal flow with a
 * slow rise, depth-of-field bokeh and exponential fog into the navy.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  LinearFilter,
  Points,
  ShaderMaterial,
  type Texture,
} from "three";
import type { Stage } from "./stage";

export const PALETTE = {
  gold: 0xd8b26a,
  champagne: 0xf4d08d,
  purple: 0xb47cff,
  navy: 0x050816,
} as const;

/** Soft round sprite: bright core, wide falloff. Sampled from the alpha channel. */
export function createSpriteTexture(px = 128): Texture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = px;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const r = px / 2;
    const g = ctx.createRadialGradient(r, r, 0, r, r, r);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.1, "rgba(255,255,255,0.9)");
    g.addColorStop(0.24, "rgba(255,255,255,0.42)");
    g.addColorStop(0.48, "rgba(255,255,255,0.12)");
    g.addColorStop(0.75, "rgba(255,255,255,0.03)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, px, px);
  }
  const tex = new CanvasTexture(canvas);
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uScale;
uniform float uSize;
uniform float uDrift;
uniform float uRise;
uniform float uFog;
uniform float uFocus;
uniform float uIntensity;
uniform float uMaxPx;
uniform float uAspect;  // x is stored in units of the band height; widened live
attribute vec4 aSeed;   // phase, speed, size, twinkle
attribute float aSpan;  // half height of this particle's wrap band
attribute vec3 aColor;
varying vec3 vColor;
varying float vAlpha;

// Each component ignores its own axis, so the field is divergence-free (ABC-style).
vec3 flow(vec3 p, float t, float ph) {
  return vec3(
    sin(p.z * 0.31 + t * 0.13 + ph) + 0.5 * cos(p.y * 0.73 - t * 0.07 + ph * 0.5),
    sin(p.x * 0.29 + t * 0.11 + ph * 1.7) + 0.5 * cos(p.z * 0.67 + t * 0.05),
    cos(p.y * 0.33 - t * 0.09 + ph) + 0.5 * sin(p.x * 0.71 + t * 0.06)
  );
}

void main() {
  vec3 p = position;
  float span = aSpan * 2.0;
  p.y = mod(p.y + uTime * uRise * aSeed.y + aSpan, span) - aSpan;
  float band = (p.y + aSpan) / span;
  float edge = smoothstep(0.0, 0.1, band) * smoothstep(1.0, 0.9, band);
  p.x *= uAspect;
  p += flow(p, uTime * aSeed.y, aSeed.x) * uDrift;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float depth = max(-mv.z, 0.001);
  gl_Position = projectionMatrix * mv;

  float blur = clamp(abs(depth - uFocus) / uFocus, 0.0, 1.0);
  float px = uSize * aSeed.z * (1.0 + blur * 1.6) * uScale / depth;
  gl_PointSize = min(px, uMaxPx);

  float fog = exp(-uFog * uFog * depth * depth);
  float twinkle = 0.7 + 0.3 * sin(uTime * (0.5 + aSeed.w * 1.5) + aSeed.x * 6.2831);
  float near = smoothstep(0.8, 3.0, depth);
  float shrink = px > uMaxPx ? uMaxPx / px : 1.0;
  vAlpha = uIntensity * fog * twinkle * edge * near * (1.0 - blur * 0.45) * shrink;
  vColor = aColor;
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D uSprite;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float a = texture2D(uSprite, gl_PointCoord).a * vAlpha;
  if (a < 0.002) discard;
  gl_FragColor = vec4(vColor, 1.0);
  #include <colorspace_fragment>
  gl_FragColor = vec4(gl_FragColor.rgb * a, a);
}
`;

export interface FieldOptions {
  count: number;
  /** Camera-distance range the particles occupy. */
  near: number;
  far: number;
  /** World-space sprite diameter at the focal distance. */
  size: number;
  drift: number;
  rise: number;
  purpleShare: number;
  intensity: number;
  fog: number;
  focus: number;
}

export interface ParticleField {
  points: Points;
  update(time: number): void;
}

export function createParticleField(stage: Stage, o: FieldOptions): ParticleField {
  const { camera } = stage;
  const tanHalf = Math.tan((camera.fov * Math.PI) / 360);
  const gold = new Color(PALETTE.gold);
  const champagne = new Color(PALETTE.champagne);
  const purple = new Color(PALETTE.purple);
  const warm = new Color(0xfff1d6);

  type P = { x: number; y: number; z: number; span: number; seed: number[]; c: Color };
  const list: P[] = [];
  for (let i = 0; i < o.count; i += 1) {
    // Bias towards the back so the field reads as deep, not as a flat sheet.
    const d = o.near + (o.far - o.near) * Math.pow(Math.random(), 0.85);
    const halfH = d * tanHalf * 1.18;
    // Stored without the aspect ratio; the shader widens x by uAspect so a
    // resize or rotation never leaves the field narrower than the view.
    const halfW = halfH * 1.06;
    const roll = Math.random();
    const c =
      roll < o.purpleShare ? purple : roll < 0.62 ? gold : roll < 0.94 ? champagne : warm;
    list.push({
      x: (Math.random() * 2 - 1) * halfW,
      y: (Math.random() * 2 - 1) * halfH,
      z: camera.position.z - d,
      span: halfH,
      seed: [
        Math.random() * Math.PI * 2,
        0.55 + Math.random() * 0.9,
        0.45 + Math.pow(Math.random(), 3) * 1.9,
        Math.random(),
      ],
      c,
    });
  }
  // Depth-sort once, back to front; the camera only parallaxes, so order holds.
  list.sort((a, b) => a.z - b.z);

  const pos = new Float32Array(o.count * 3);
  const seed = new Float32Array(o.count * 4);
  const span = new Float32Array(o.count);
  const col = new Float32Array(o.count * 3);
  list.forEach((p, i) => {
    pos.set([p.x, p.y, p.z], i * 3);
    seed.set(p.seed, i * 4);
    span[i] = p.span;
    col.set([p.c.r, p.c.g, p.c.b], i * 3);
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(pos, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seed, 4));
  geometry.setAttribute("aSpan", new BufferAttribute(span, 1));
  geometry.setAttribute("aColor", new BufferAttribute(col, 3));

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    premultipliedAlpha: true,
    uniforms: {
      uTime: { value: 0 },
      uScale: { value: 1 },
      uSize: { value: o.size },
      uDrift: { value: o.drift },
      uRise: { value: o.rise },
      uFog: { value: o.fog },
      uFocus: { value: o.focus },
      uIntensity: { value: o.intensity },
      uMaxPx: { value: 64 },
      uAspect: { value: 1 },
      uSprite: { value: createSpriteTexture(stage.preset === "lite" ? 64 : 128) },
    },
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false;

  stage.onResize(() => {
    const dpr = stage.size.pixelRatio;
    material.uniforms.uScale.value = (stage.size.height * dpr * 0.5) / tanHalf;
    material.uniforms.uMaxPx.value = 72 * dpr;
    material.uniforms.uAspect.value = Math.min(Math.max(stage.size.width / stage.size.height, 0.55), 2.6);
  });

  return {
    points,
    update(time) {
      material.uniforms.uTime.value = time;
    },
  };
}
