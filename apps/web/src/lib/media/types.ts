/**
 * Nexyyra Events — Media system types (CMS-ready)
 * Swap MediaProvider implementation via MEDIA_PROVIDER env.
 */

export const MEDIA_CATEGORIES = [
  "wedding",
  "corporate",
  "destination",
  "celebrity",
  "brand-activation",
  "venue",
  "award-ceremony",
  "fashion-show",
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];

export const MEDIA_IMAGE_FOLDERS = [
  "hero",
  "weddings",
  "corporate",
  "destination",
  "celebrity",
  "venues",
  "portfolio",
  "stories",
  "gallery",
] as const;

export type MediaImageFolder = (typeof MEDIA_IMAGE_FOLDERS)[number];

export type MediaAssetType = "image" | "video";

export interface MediaVariant {
  width: number;
  src: string;
  height: number;
}

export interface MediaAsset {
  id: string;
  type: MediaAssetType;
  folder: MediaImageFolder | "videos" | "logos";
  category: MediaCategory;
  src: string;
  filename: string;
  title: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: number;
  blurDataURL: string;
  variants: MediaVariant[];
  featured?: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaVideoAsset {
  id: string;
  type: "video";
  folder: "videos";
  category: MediaCategory;
  src: string;
  filename: string;
  title: string;
  poster?: string;
  createdAt: string;
}

export interface MediaManifest {
  version: number;
  generatedAt: string;
  provider: string;
  assets: MediaAsset[];
  videos: MediaVideoAsset[];
}

export interface MediaQuery {
  folder?: MediaImageFolder | MediaImageFolder[];
  category?: MediaCategory | MediaCategory[];
  featured?: boolean;
  limit?: number;
  type?: MediaAssetType;
}

export interface MediaUploadInput {
  folder: MediaImageFolder;
  category?: MediaCategory;
  title?: string;
  alt?: string;
  featured?: boolean;
}

export interface MediaProvider {
  readonly name: string;
  getManifest(): Promise<MediaManifest>;
  query(query?: MediaQuery): Promise<MediaAsset[]>;
  getVideos(): Promise<MediaVideoAsset[]>;
  upload(file: Buffer, filename: string, input: MediaUploadInput): Promise<MediaAsset>;
  reindex(): Promise<MediaManifest>;
}

export interface MediaSidecarMeta {
  category?: MediaCategory;
  title?: string;
  alt?: string;
  featured?: boolean;
  sortOrder?: number;
}
