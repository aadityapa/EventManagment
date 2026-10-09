/**
 * Globe scene — a dotted, hairline-graticule gold globe turned to face India,
 * swaying slowly, with pins at the Indian service cities and arcs from Pune to
 * each one carrying a travelling glint. Used only where an existing "where we
 * work / service areas" element already sits.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Points,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
} from "three";
import { createSpriteTexture, PALETTE } from "../parts/particles";
import { createStage, type Disposer, type MountOptions } from "../parts/stage";

/** [name, lat, lon] — Pune first (origin of every arc). */
export const SERVICE_CITIES: ReadonlyArray<readonly [string, number, number]> = [
  ["Pune", 18.5204, 73.8567],
  ["Mumbai", 19.076, 72.8777],
  ["Delhi", 28.6139, 77.209],
  ["Bangalore", 12.9716, 77.5946],
  ["Hyderabad", 17.385, 78.4867],
  ["Jaipur", 26.9124, 75.7873],
  ["Indore", 22.7196, 75.8577],
  ["Nashik", 19.9975, 73.7898],
  ["Nagpur", 21.1458, 79.0882],
  ["Ahmedabad", 23.0225, 72.5714],
  ["Surat", 21.1702, 72.8311],
  ["Goa", 15.2993, 74.124],
  ["Udaipur", 24.5854, 73.7125],
];

const FOV = 35;
const DEG = Math.PI / 180;

function toVec(lat: number, lon: number, r = 1) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return new Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

const dotVertex = /* glsl */ `
uniform float uTime;
uniform float uPx;
attribute float aSize;
attribute float aPulse;
attribute vec3 aColor;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 n = normalize(normalMatrix * position);
  float facing = smoothstep(-0.05, 0.85, n.z);
  float pulse = 1.0 + aPulse * 0.45 * sin(uTime * 2.2 + position.x * 40.0);
  gl_PointSize = aSize * uPx * pulse / -mv.z;
  gl_Position = projectionMatrix * mv;
  vAlpha = mix(0.18, 1.0, facing) * (aPulse > 0.0 ? 1.0 : 0.75);
  vColor = aColor;
}`;

const dotFragment = /* glsl */ `
uniform sampler2D uSprite;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float a = texture2D(uSprite, gl_PointCoord).a * vAlpha;
  if (a < 0.002) discard;
  gl_FragColor = vec4(vColor, 1.0);
  #include <colorspace_fragment>
  gl_FragColor = vec4(gl_FragColor.rgb * a, a);
}`;

const arcVertex = /* glsl */ `
attribute float aT;
attribute float aOffset;
varying float vT;
varying float vOffset;
void main() {
  vT = aT;
  vOffset = aOffset;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const arcFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
varying float vT;
varying float vOffset;
void main() {
  float head = fract(uTime * 0.18 + vOffset) * 1.5 - 0.25;
  float trail = clamp(1.0 - (head - vT) / 0.3, 0.0, 1.0) * step(vT, head);
  float a = 0.3 + 0.7 * trail * trail;
  gl_FragColor = vec4(uColor, 1.0);
  #include <colorspace_fragment>
  gl_FragColor = vec4(gl_FragColor.rgb * a, a);
}`;

export function mount(container: HTMLElement, opts: MountOptions): Disposer {
  const stage = createStage(container, opts.preset, { fov: FOV, z: 5, far: 40 }, opts.motion);
  const { scene, camera } = stage;
  const lite = opts.preset === "lite";
  const intensity = Math.min(1, Math.max(0, opts.intensity));
  const sprite = createSpriteTexture(64);
  stage.track(sprite);

  const tilt = new Group();
  const spin = new Group();
  tilt.add(spin);
  scene.add(tilt);

  // Depth-only occluder hides the far hemisphere.
  const occluder = new Mesh(new SphereGeometry(0.992, 48, 32), new MeshBasicMaterial({ colorWrite: false }));
  spin.add(occluder);

  // Graticule every 20°.
  const grid: number[] = [];
  const ring = (fn: (a: number) => Vector3) => {
    for (let i = 0; i < 96; i += 1) grid.push(...fn((i / 96) * 360).toArray(), ...fn(((i + 1) / 96) * 360).toArray());
  };
  for (let lat = -60; lat <= 60; lat += 20) ring((a) => toVec(lat, a - 180, 1.001));
  for (let lon = -180; lon < 180; lon += 20) ring((a) => toVec(a / 2 - 90, lon, 1.001));
  const gridGeo = new BufferGeometry();
  gridGeo.setAttribute("position", new BufferAttribute(new Float32Array(grid), 3));
  const gridMat = new LineBasicMaterial({ color: PALETTE.gold, transparent: true, opacity: 0.13 * intensity, depthWrite: false });
  spin.add(new LineSegments(gridGeo, gridMat));

  // Fibonacci dot shell + city pins in one draw.
  const shell = lite ? 900 : 1800;
  const total = shell + SERVICE_CITIES.length;
  const pos = new Float32Array(total * 3);
  const size = new Float32Array(total);
  const pulse = new Float32Array(total);
  const col = new Float32Array(total * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const gold = new Color(PALETTE.gold);
  const champagne = new Color(PALETTE.champagne);
  const purple = new Color(PALETTE.purple);
  for (let i = 0; i < shell; i += 1) {
    const y = 1 - (i / (shell - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    pos.set([Math.cos(golden * i) * r, y, Math.sin(golden * i) * r], i * 3);
    size[i] = lite ? 0.024 : 0.02;
    col.set(gold.toArray(), i * 3);
  }
  SERVICE_CITIES.forEach(([, lat, lon], k) => {
    const i = shell + k;
    pos.set(toVec(lat, lon, 1.012).toArray(), i * 3);
    size[i] = k === 0 ? 0.15 : 0.095;
    pulse[i] = 1;
    col.set((k === 0 ? purple : champagne).toArray(), i * 3);
  });
  const dotGeo = new BufferGeometry();
  dotGeo.setAttribute("position", new BufferAttribute(pos, 3));
  dotGeo.setAttribute("aSize", new BufferAttribute(size, 1));
  dotGeo.setAttribute("aPulse", new BufferAttribute(pulse, 1));
  dotGeo.setAttribute("aColor", new BufferAttribute(col, 3));
  const dotMat = new ShaderMaterial({
    vertexShader: dotVertex,
    fragmentShader: dotFragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    premultipliedAlpha: true,
    uniforms: { uTime: { value: 0 }, uPx: { value: 1 }, uSprite: { value: sprite } },
  });
  spin.add(new Points(dotGeo, dotMat));

  // Arcs from Pune, lifted in proportion to distance, as one LineSegments draw.
  const origin = toVec(SERVICE_CITIES[0][1], SERVICE_CITIES[0][2]);
  const arcPos: number[] = [];
  const arcT: number[] = [];
  const arcOff: number[] = [];
  const steps = lite ? 24 : 40;
  SERVICE_CITIES.slice(1).forEach(([, lat, lon], k) => {
    const end = toVec(lat, lon);
    const angle = origin.angleTo(end);
    const lift = 0.025 + angle * 0.9;
    const at = (t: number) =>
      origin.clone().lerp(end, t).normalize().multiplyScalar(1.005 + lift * Math.sin(Math.PI * t));
    for (let s = 0; s < steps; s += 1) {
      arcPos.push(...at(s / steps).toArray(), ...at((s + 1) / steps).toArray());
      arcT.push(s / steps, (s + 1) / steps);
      arcOff.push(k * 0.137, k * 0.137);
    }
  });
  const arcGeo = new BufferGeometry();
  arcGeo.setAttribute("position", new BufferAttribute(new Float32Array(arcPos), 3));
  arcGeo.setAttribute("aT", new BufferAttribute(new Float32Array(arcT), 1));
  arcGeo.setAttribute("aOffset", new BufferAttribute(new Float32Array(arcOff), 1));
  const arcMat = new ShaderMaterial({
    vertexShader: arcVertex,
    fragmentShader: arcFragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    premultipliedAlpha: true,
    uniforms: { uTime: { value: 0 }, uColor: { value: new Color(PALETTE.champagne) } },
  });
  spin.add(new LineSegments(arcGeo, arcMat));

  // Atmosphere glow behind the limb.
  const halo = new Sprite(
    new SpriteMaterial({ map: createSpriteTexture(64), color: PALETTE.gold, blending: AdditiveBlending, transparent: true, opacity: 0.22 * intensity, depthWrite: false }),
  );
  halo.scale.setScalar(3.4);
  tilt.add(halo);

  // Turn India (≈ 21°N, 78°E) to face the camera.
  const india = toVec(21, 78);
  const baseYaw = -Math.atan2(india.x, india.z);
  const turned = india.clone().applyAxisAngle(new Vector3(0, 1, 0), baseYaw);
  const basePitch = Math.atan2(turned.y, turned.z);
  tilt.rotation.x = basePitch;

  let distance = 5;
  stage.onResize(() => {
    distance = 1.16 / Math.tan((FOV * Math.PI) / 360) / Math.min(1, camera.aspect);
    dotMat.uniforms.uPx.value = (stage.size.height * stage.size.pixelRatio * 0.5) / Math.tan((FOV * Math.PI) / 360);
  });

  stage.start((time) => {
    spin.rotation.y = baseYaw + Math.sin(time * 0.09) * 0.42 + stage.pointer.x * 0.12;
    tilt.rotation.x = basePitch - stage.pointer.y * 0.08;
    dotMat.uniforms.uTime.value = time;
    arcMat.uniforms.uTime.value = time;
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
  });

  return () => stage.dispose();
}
