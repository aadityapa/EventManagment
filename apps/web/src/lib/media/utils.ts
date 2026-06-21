import type { MediaAsset } from "./types";
import { driveImageUrl, isGoogleDriveSrc } from "./drive-urls";

export function pickBestVariantSrc(asset: MediaAsset, targetWidth: number): string {
  if (!asset.variants.length) {
    if (isGoogleDriveSrc(asset.src)) {
      const fileIdMatch = asset.src.match(/\/d\/([^=/?]+)/);
      if (fileIdMatch) return driveImageUrl(fileIdMatch[1], targetWidth);
    }
    return asset.src;
  }
  const sorted = [...asset.variants].sort((a, b) => a.width - b.width);
  const match = sorted.find((v) => v.width >= targetWidth);
  return match?.src ?? sorted[sorted.length - 1]?.src ?? asset.src;
}

export function buildSizesAttr(breakpoints: Record<string, string>): string {
  return Object.entries(breakpoints)
    .map(([bp, size]) => `(max-width: ${bp}) ${size}`)
    .concat(["100vw"])
    .join(", ");
}

export function masonryHeightForAsset(asset: MediaAsset, columnWidth = 400): number {
  const ratio = asset.aspectRatio || 1.5;
  return Math.round(columnWidth / ratio);
}
