import type { MediaAsset, MediaImageFolder } from "./types";
import { readMediaManifest } from "./manifest-read";
import { isComingSoonImage } from "./placeholders";

const SERVICE_FOLDER_MAP: Record<string, MediaImageFolder> = {
  "wedding-planning": "weddings",
  "corporate-events": "corporate",
  "destination-weddings": "destination",
  "celebrity-management": "celebrity",
  "brand-promotions": "corporate",
  "fashion-shows": "gallery",
  "award-functions": "gallery",
};

const GALLERY_FOLDER_ORDER: Record<string, number> = {
  gallery: 0,
  weddings: 1,
  venues: 2,
  hero: 3,
  celebrity: 4,
  corporate: 5,
  destination: 6,
  portfolio: 7,
  stories: 8,
};

function sortGalleryAssets(assets: MediaAsset[]): MediaAsset[] {
  return [...assets].sort((a, b) => {
    const folderDelta =
      (GALLERY_FOLDER_ORDER[a.folder] ?? 99) - (GALLERY_FOLDER_ORDER[b.folder] ?? 99);
    if (folderDelta !== 0) return folderDelta;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

/** Read-only service gallery — manifest only, no filesystem scan. */
export async function getServiceMediaFromManifest(
  serviceSlug: string,
  limit = 8
): Promise<MediaAsset[]> {
  const manifest = await readMediaManifest();
  if (!manifest?.assets.length) return [];

  const folder = SERVICE_FOLDER_MAP[serviceSlug];
  if (folder) {
    const folderAssets = manifest.assets.filter(
      (asset) => asset.folder === folder && !isComingSoonImage(asset.src)
    );
    if (folderAssets.length) return folderAssets.slice(0, limit);
  }

  const gallery = sortGalleryAssets(
    manifest.assets.filter((asset) => !isComingSoonImage(asset.src))
  );
  return gallery.slice(0, limit);
}
