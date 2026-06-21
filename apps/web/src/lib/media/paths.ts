import path from "node:path";

export const MEDIA_VARIANT_WIDTHS = [640, 828, 1200, 1920] as const;

export const MEDIA_SOURCE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
]);

export const MEDIA_VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov"]);

export const MEDIA_MANIFEST_PATH = "media-manifest.json";

export function getPublicRoot(): string {
  return path.join(process.cwd(), "public");
}

export function getImagesRoot(): string {
  return path.join(getPublicRoot(), "images");
}

export function getVideosRoot(): string {
  return path.join(getPublicRoot(), "videos");
}

export function getLogosRoot(): string {
  return path.join(getPublicRoot(), "logos");
}

export function getManifestFilePath(): string {
  return path.join(getPublicRoot(), MEDIA_MANIFEST_PATH);
}

/** Skip generated responsive variants when scanning */
export function isGeneratedVariant(filename: string): boolean {
  return /-\d+w\.webp$/i.test(filename);
}

export function variantFilename(base: string, width: number): string {
  return `${base}-${width}w.webp`;
}

export function masterWebpFilename(base: string): string {
  return `${base}.webp`;
}
