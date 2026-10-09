import { unstable_cache } from "next/cache";
import type { MediaAsset, MediaImageFolder, MediaQuery, MediaVideoAsset } from "./types";
import { getMediaProvider } from "./providers";
import { isComingSoonImage } from "./placeholders";
import { buildBrandImageMap, type BrandImageMap } from "./brand-images";
import { LIVE_DRIVE_CACHE_TAG } from "./live-drive-manifest";

const REVALIDATE_SECONDS = Number(process.env.MEDIA_REVALIDATE_SECONDS ?? 120);
const CACHE_TAG = "media-manifest-v2";

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

function dedupeAssets(assets: MediaAsset[]): MediaAsset[] {
  const seen = new Set<string>();
  return assets.filter((asset) => {
    if (seen.has(asset.src)) return false;
    seen.add(asset.src);
    return true;
  });
}

function sortGalleryAssets(assets: MediaAsset[]): MediaAsset[] {
  return [...assets].sort((a, b) => {
    const folderDelta =
      (GALLERY_FOLDER_ORDER[a.folder] ?? 99) - (GALLERY_FOLDER_ORDER[b.folder] ?? 99);
    if (folderDelta !== 0) return folderDelta;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

async function fetchAssetsUncached(query?: MediaQuery): Promise<MediaAsset[]> {
  const provider = getMediaProvider();
  return provider.query(query);
}

async function fetchVideosUncached(): Promise<MediaVideoAsset[]> {
  const provider = getMediaProvider();
  return provider.getVideos();
}

/** Server-side cached media queries — revalidate on upload/reindex */
export const getMediaAssets = unstable_cache(
  async (queryJson: string) => {
    const query = queryJson ? (JSON.parse(queryJson) as MediaQuery) : undefined;
    return fetchAssetsUncached(query);
  },
  ["media-assets"],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG, LIVE_DRIVE_CACHE_TAG] }
);

export const getMediaVideos = unstable_cache(
  async () => fetchVideosUncached(),
  ["media-videos"],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG, LIVE_DRIVE_CACHE_TAG] }
);

export const getBrandImageMap = unstable_cache(
  async (): Promise<BrandImageMap> => {
    const provider = getMediaProvider();
    const manifest = await provider.getManifest();
    return buildBrandImageMap(manifest.assets);
  },
  ["brand-image-map"],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG, LIVE_DRIVE_CACHE_TAG] }
);

export async function getHeroMedia(limit = 8): Promise<MediaAsset[]> {
  return getMediaAssets(JSON.stringify({ folder: "hero", limit }));
}

export async function getGalleryMedia(): Promise<MediaAsset[]> {
  const all = await getMediaAssets(JSON.stringify({ type: "image" }));
  const real = all.filter((asset) => !isComingSoonImage(asset.src));
  return sortGalleryAssets(dedupeAssets(real));
}

export async function getVenueMedia(): Promise<MediaAsset[]> {
  return getMediaAssets(JSON.stringify({ folder: "venues" }));
}

export async function getStoryMedia(): Promise<MediaAsset[]> {
  return getMediaAssets(JSON.stringify({ folder: "stories" }));
}

export async function getFolderMedia(folder: MediaImageFolder): Promise<MediaAsset[]> {
  return getMediaAssets(JSON.stringify({ folder }));
}

const SERVICE_FOLDER_MAP: Record<string, MediaImageFolder> = {
  "wedding-planning": "weddings",
  "corporate-events": "corporate",
  "destination-weddings": "destination",
  "celebrity-management": "celebrity",
  "brand-promotions": "corporate",
  "fashion-shows": "gallery",
  "award-functions": "gallery",
};

/** Service pages — auto-load images from mapped folder */
export async function getServiceMedia(serviceSlug: string, limit = 8): Promise<MediaAsset[]> {
  const folder = SERVICE_FOLDER_MAP[serviceSlug];
  if (!folder) return (await getGalleryMedia()).slice(0, limit);
  const assets = await getMediaAssets(JSON.stringify({ folder, limit }));
  const real = assets.filter((asset) => !isComingSoonImage(asset.src));
  if (real.length) return real;
  return (await getGalleryMedia()).slice(0, limit);
}

export async function getCategoryMedia(category: MediaQuery["category"]): Promise<MediaAsset[]> {
  return getMediaAssets(JSON.stringify({ category }));
}

export { CACHE_TAG as MEDIA_CACHE_TAG, LIVE_DRIVE_CACHE_TAG };
