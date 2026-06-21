import type { MediaCategory, MediaImageFolder } from "./types";

/** User-facing category labels */
export const MEDIA_CATEGORY_LABELS: Record<MediaCategory, string> = {
  wedding: "Wedding",
  corporate: "Corporate",
  destination: "Destination",
  celebrity: "Celebrity",
  "brand-activation": "Brand Activation",
  venue: "Venue",
  "award-ceremony": "Award Ceremony",
  "fashion-show": "Fashion Show",
};

export const GALLERY_FILTER_LABELS = [
  "All",
  ...Object.values(MEDIA_CATEGORY_LABELS),
] as const;

/** Default category per image folder */
export const FOLDER_DEFAULT_CATEGORY: Record<MediaImageFolder, MediaCategory> = {
  hero: "wedding",
  weddings: "wedding",
  corporate: "corporate",
  destination: "destination",
  celebrity: "celebrity",
  venues: "venue",
  portfolio: "wedding",
  stories: "wedding",
  gallery: "wedding",
};

export const FOLDER_TO_SERVICE_SLUG: Partial<Record<MediaImageFolder, string>> = {
  weddings: "wedding-planning",
  corporate: "corporate-events",
  destination: "destination-weddings",
  celebrity: "celebrity-management",
  venues: "venue-management",
  portfolio: "portfolio",
  gallery: "gallery",
};

export function categoryFromFolder(folder: MediaImageFolder): MediaCategory {
  return FOLDER_DEFAULT_CATEGORY[folder];
}

export function humanizeFilename(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export function matchesCategoryFilter(
  assetCategory: MediaCategory,
  filter: string
): boolean {
  if (filter === "All") return true;
  const label = MEDIA_CATEGORY_LABELS[assetCategory];
  return label === filter;
}
