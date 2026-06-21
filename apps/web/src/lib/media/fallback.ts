import type { MediaAsset, MediaImageFolder } from "./types";
import { categoryFromFolder, humanizeFilename } from "./categories";
import { BRAND_BLUR } from "@/brand/data/imagery";

/** Minimal asset when a folder has no uploads yet */
export function staticUrlToMediaAsset(
  src: string,
  folder: MediaImageFolder,
  index: number,
  category?: MediaAsset["category"]
): MediaAsset {
  const id = `local-${folder}-${index}`;
  return {
    id,
    type: "image",
    folder,
    category: category ?? categoryFromFolder(folder),
    src,
    filename: pathBasename(src),
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

function pathBasename(src: string): string {
  const parts = src.split("/");
  return parts[parts.length - 1] ?? "image.jpg";
}

/** Use uploaded library only — no stock photo fallback */
export function mergeWithStaticFallback(
  assets: MediaAsset[],
  _fallbackUrls: readonly string[],
  _folder: MediaImageFolder
): MediaAsset[] {
  return assets;
}
