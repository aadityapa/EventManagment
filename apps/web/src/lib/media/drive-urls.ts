import { MEDIA_VARIANT_WIDTHS } from "./paths";
import type { MediaVariant } from "./types";

/** Direct image URL via Google CDN (works for publicly shared Drive files). */
export function driveImageUrl(fileId: string, width = 1920): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w${width}`;
}

/** Fallback export URL when lh3 CDN is unavailable. */
export function driveExportUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export function buildDriveVariants(
  fileId: string,
  aspectRatio = 1.5
): MediaVariant[] {
  return MEDIA_VARIANT_WIDTHS.map((width) => ({
    width,
    src: driveImageUrl(fileId, width),
    height: Math.round(width / aspectRatio),
  }));
}

export function isGoogleDriveSrc(src: string): boolean {
  return (
    src.includes("googleusercontent.com/d/") ||
    src.includes("drive.google.com/uc?") ||
    src.includes("drive.google.com/file/d/")
  );
}
