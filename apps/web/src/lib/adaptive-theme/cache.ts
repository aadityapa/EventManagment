import type { AdaptivePalette, ImageAnalysis } from "./types";

const analysisCache = new Map<string, ImageAnalysis>();
const paletteCache = new Map<string, AdaptivePalette>();

export function getCachedAnalysis(key: string) {
  return analysisCache.get(key);
}

export function setCachedAnalysis(key: string, value: ImageAnalysis) {
  analysisCache.set(key, value);
}

export function getCachedPalette(key: string) {
  return paletteCache.get(key);
}

export function setCachedPalette(key: string, value: AdaptivePalette) {
  paletteCache.set(key, value);
}

export function cacheKey(src: string, region: string) {
  return `${src}::${region}`;
}
