import { unstable_cache } from "next/cache";
import type { MediaAsset, MediaImageFolder, MediaQuery, MediaVideoAsset } from "./types";
import { getMediaProvider } from "./providers";

const CACHE_TAG = "media-manifest";

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
  { revalidate: 60, tags: [CACHE_TAG] }
);

export const getMediaVideos = unstable_cache(
  async () => fetchVideosUncached(),
  ["media-videos"],
  { revalidate: 60, tags: [CACHE_TAG] }
);

export async function getHeroMedia(limit = 8): Promise<MediaAsset[]> {
  return getMediaAssets(JSON.stringify({ folder: "hero", limit }));
}

export async function getGalleryMedia(): Promise<MediaAsset[]> {
  const gallery = await getMediaAssets(JSON.stringify({ folder: "gallery" }));
  if (gallery.length) return gallery;
  return getMediaAssets(JSON.stringify({ limit: 24 }));
}

export async function getPortfolioMedia(): Promise<MediaAsset[]> {
  const portfolio = await getMediaAssets(JSON.stringify({ folder: "portfolio" }));
  if (portfolio.length) return portfolio;
  return getMediaAssets(JSON.stringify({ folder: ["weddings", "corporate", "destination"] as MediaImageFolder[], limit: 12 }));
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
  if (!folder) return getMediaAssets(JSON.stringify({ limit }));
  const assets = await getMediaAssets(JSON.stringify({ folder, limit }));
  return assets;
}

export async function getCategoryMedia(category: MediaQuery["category"]): Promise<MediaAsset[]> {
  return getMediaAssets(JSON.stringify({ category }));
}

export { CACHE_TAG as MEDIA_CACHE_TAG };
