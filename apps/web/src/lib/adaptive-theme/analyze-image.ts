import { cacheKey, getCachedAnalysis, setCachedAnalysis } from "./cache";
import { BRIGHTNESS_THRESHOLD, colorWarmth, relativeLuminance } from "./color-utils";
import type { ImageAnalysis, SampleRegion } from "./types";

const SAMPLE_SIZE = 64;

function regionBounds(region: SampleRegion, w: number, h: number) {
  switch (region) {
    case "left-third":
      return { x: 0, y: 0, width: Math.floor(w / 3), height: h };
    case "center":
      return { x: Math.floor(w / 4), y: Math.floor(h / 4), width: Math.floor(w / 2), height: Math.floor(h / 2) };
    default:
      return { x: 0, y: 0, width: w, height: h };
  }
}

function analyzeImageData(data: ImageData): ImageAnalysis {
  const { data: px, width, height } = data;
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let lumSum = 0;
  let count = 0;

  const step = Math.max(1, Math.floor((width * height) / 4096));

  for (let i = 0; i < px.length; i += 4 * step) {
    const a = px[i + 3];
    if (a < 32) continue;
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    rSum += r;
    gSum += g;
    bSum += b;
    lumSum += relativeLuminance(r, g, b);
    count++;
  }

  if (!count) {
    return { brightness: 0.5, dominant: [128, 128, 128], warmth: 0, isWarm: true, isDark: false };
  }

  const dominant: [number, number, number] = [rSum / count, gSum / count, bSum / count];
  const brightness = lumSum / count;
  const warmth = colorWarmth(dominant[0], dominant[1], dominant[2]);

  return {
    brightness,
    dominant,
    warmth,
    isWarm: warmth > 0.06,
    isDark: brightness < BRIGHTNESS_THRESHOLD,
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function sampleImage(img: HTMLImageElement, region: SampleRegion): ImageAnalysis {
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, SAMPLE_SIZE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.floor(img.naturalWidth * scale));
  const h = Math.max(1, Math.floor(img.naturalHeight * scale));
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return { brightness: 0.5, dominant: [128, 128, 128], warmth: 0, isWarm: true, isDark: false };
  }

  ctx.drawImage(img, 0, 0, w, h);
  const bounds = regionBounds(region, w, h);
  const imageData = ctx.getImageData(bounds.x, bounds.y, bounds.width, bounds.height);
  return analyzeImageData(imageData);
}

export function analyzeVideoFrame(video: HTMLVideoElement, region: SampleRegion = "left-third"): ImageAnalysis | null {
  if (video.readyState < 2 || !video.videoWidth) return null;

  const canvas = document.createElement("canvas");
  const scale = Math.min(1, SAMPLE_SIZE / Math.max(video.videoWidth, video.videoHeight));
  const w = Math.max(1, Math.floor(video.videoWidth * scale));
  const h = Math.max(1, Math.floor(video.videoHeight * scale));
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  try {
    ctx.drawImage(video, 0, 0, w, h);
    const bounds = regionBounds(region, w, h);
    const imageData = ctx.getImageData(bounds.x, bounds.y, bounds.width, bounds.height);
    return analyzeImageData(imageData);
  } catch {
    return null;
  }
}

export async function analyzeImageUrl(src: string, region: SampleRegion = "left-third"): Promise<ImageAnalysis> {
  const key = cacheKey(src, region);
  const cached = getCachedAnalysis(key);
  if (cached) return cached;

  try {
    const img = await loadImage(src);
    const analysis = sampleImage(img, region);
    setCachedAnalysis(key, analysis);
    return analysis;
  } catch {
    const fallback: ImageAnalysis = {
      brightness: 0.5,
      dominant: [200, 190, 175],
      warmth: 0.2,
      isWarm: true,
      isDark: false,
    };
    setCachedAnalysis(key, fallback);
    return fallback;
  }
}

export async function analyzeFromElement(
  img: HTMLImageElement | null,
  region: SampleRegion = "left-third"
): Promise<ImageAnalysis | null> {
  if (!img?.complete || !img.naturalWidth) return null;
  const src = img.currentSrc || img.src;
  if (!src) return null;

  const key = cacheKey(src, region);
  const cached = getCachedAnalysis(key);
  if (cached) return cached;

  const analysis = sampleImage(img, region);
  setCachedAnalysis(key, analysis);
  return analysis;
}
