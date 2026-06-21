import type { MediaAsset, MediaCategory } from "./types";
import { categoryFromFolder, humanizeFilename } from "./categories";
import type { MediaImageFolder } from "./types";
import { BRAND_BLUR } from "@/brand/data/imagery";

/** Fallback when local media folders are empty — keeps site functional */
export function staticUrlToMediaAsset(
  src: string,
  folder: MediaImageFolder,
  index: number,
  category?: MediaCategory
): MediaAsset {
  const id = `static-${folder}-${index}`;
  return {
    id,
    type: "image",
    folder,
    category: category ?? categoryFromFolder(folder),
    src,
    filename: `static-${index}.jpg`,
    title: humanizeFilename(`${folder} ${index + 1}`),
    alt: `Nexyyra Events ${folder} showcase`,
    width: 1400,
    height: 933,
    aspectRatio: 1.5,
    blurDataURL: BRAND_BLUR,
    variants: [],
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  };
}

export function mergeWithStaticFallback(
  assets: MediaAsset[],
  fallbackUrls: readonly string[],
  folder: MediaImageFolder
): MediaAsset[] {
  if (assets.length > 0) return assets;
  return fallbackUrls.map((src, i) => staticUrlToMediaAsset(src, folder, i));
}
