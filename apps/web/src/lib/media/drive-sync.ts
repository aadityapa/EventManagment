import type { MediaAsset, MediaImageFolder, MediaManifest, MediaSidecarMeta } from "./types";
import { MEDIA_IMAGE_FOLDERS } from "./types";
import { categoryFromFolder, humanizeFilename } from "./categories";
import {
  getDriveFolderId,
  listAllDriveFilesInFolder,
  type DriveFile,
} from "./drive-client";
import { buildDriveVariants, driveImageUrl } from "./drive-urls";
import { writeMediaManifest } from "./manifest-io";
import { scanMediaLibrary } from "./manifest-service";

const MANIFEST_VERSION = 1;
const IMAGE_MIME_PREFIX = "image/";

const FOLDER_ALIASES: Record<string, MediaImageFolder> = {
  hero: "hero",
  heroes: "hero",
  wedding: "weddings",
  weddings: "weddings",
  corporate: "corporate",
  destination: "destination",
  destinations: "destination",
  celebrity: "celebrity",
  celebrities: "celebrity",
  venue: "venues",
  venues: "venues",
  portfolio: "portfolio",
  story: "stories",
  stories: "stories",
  gallery: "gallery",
  galleries: "gallery",
};

function normalizeFolderName(name: string): MediaImageFolder | null {
  const key = name.toLowerCase().replace(/[^a-z0-9-]/g, "");
  return FOLDER_ALIASES[key] ?? (MEDIA_IMAGE_FOLDERS.includes(key as MediaImageFolder) ? (key as MediaImageFolder) : null);
}

function isImageFile(file: DriveFile): boolean {
  if (file.mimeType.startsWith(IMAGE_MIME_PREFIX)) return true;
  return /\.(jpe?g|png|webp|gif|avif)$/i.test(file.name);
}

function isFolder(file: DriveFile): boolean {
  return file.mimeType === "application/vnd.google-apps.folder";
}

function parseSidecarMeta(filename: string): MediaSidecarMeta | null {
  const match = filename.match(/^(.+)\.meta\.json$/i);
  if (!match) return null;
  return null;
}

function assetFromDriveFile(
  folder: MediaImageFolder,
  file: DriveFile,
  sidecar?: MediaSidecarMeta | null
): MediaAsset | null {
  if (!isImageFile(file)) return null;

  const baseName = file.name.replace(/\.[^.]+$/, "");
  const category = sidecar?.category ?? categoryFromFolder(folder);
  const title = sidecar?.title ?? humanizeFilename(baseName);
  const alt = sidecar?.alt ?? `${title} — Nexyyra Events`;

  const meta = file.imageMediaMetadata;
  const width = meta?.width ?? 1920;
  const height = meta?.height ?? 1280;
  const aspectRatio = width / height;

  return {
    id: `${folder}-${baseName}`,
    type: "image",
    folder,
    category,
    src: driveImageUrl(file.id, 1920),
    filename: file.name,
    title,
    alt,
    width,
    height,
    aspectRatio,
    blurDataURL: "",
    variants: buildDriveVariants(file.id, aspectRatio),
    featured: sidecar?.featured,
    sortOrder: sidecar?.sortOrder,
    createdAt: file.createdTime ?? new Date().toISOString(),
    updatedAt: file.modifiedTime ?? file.createdTime ?? new Date().toISOString(),
  };
}

async function indexDriveFolderTree(
  rootFolderId: string
): Promise<{ assets: MediaAsset[]; sidecars: Map<string, MediaSidecarMeta> }> {
  const rootFiles = await listAllDriveFilesInFolder(rootFolderId);
  const sidecars = new Map<string, MediaSidecarMeta>();
  const assets: MediaAsset[] = [];

  const subfolders = rootFiles.filter(isFolder);
  const rootImages = rootFiles.filter((f) => !isFolder(f));

  for (const file of rootFiles) {
    if (file.name.endsWith(".meta.json")) {
      try {
        // Sidecar JSON files aren't directly readable via list API without download.
        // Filename pattern: photo.jpg.meta.json → associate by base name when indexing images.
        parseSidecarMeta(file.name);
      } catch {
        /* ignore */
      }
    }
  }

  for (const subfolder of subfolders) {
    const folder = normalizeFolderName(subfolder.name);
    if (!folder) {
      console.warn(`  ⚠ Skipping unknown Drive subfolder: ${subfolder.name}`);
      continue;
    }

    const files = await listAllDriveFilesInFolder(subfolder.id);
    for (const file of files) {
      if (isFolder(file)) continue;
      const baseName = file.name.replace(/\.[^.]+$/, "");
      const sidecar = sidecars.get(`${folder}/${baseName}`);
      const asset = assetFromDriveFile(folder, file, sidecar);
      if (asset) assets.push(asset);
    }
  }

  // Flat uploads at root — infer folder from filename prefix or default to gallery
  for (const file of rootImages) {
    if (file.name.endsWith(".meta.json")) continue;
    const asset = assetFromDriveFile("gallery", file);
    if (asset) assets.push(asset);
  }

  assets.sort((a, b) => {
    const orderA = a.sortOrder ?? 9999;
    const orderB = b.sortOrder ?? 9999;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return { assets, sidecars };
}

export async function syncMediaFromGoogleDrive(): Promise<MediaManifest> {
  const folderId = getDriveFolderId();
  console.log(`☁️  Syncing media from Google Drive folder ${folderId}…`);

  const { assets } = await indexDriveFolderTree(folderId);

  const manifest: MediaManifest = {
    version: MANIFEST_VERSION,
    generatedAt: new Date().toISOString(),
    provider: "google-drive",
    assets,
    videos: [],
  };

  if (assets.length === 0) {
    console.warn("  ⚠ Google Drive folder returned 0 images.");
    return manifest;
  }

  await writeMediaManifest(manifest);
  console.log(`  ✓ Indexed ${assets.length} images from Google Drive`);
  return manifest;
}

/** Drive sync with local filesystem fallback when Drive is empty or unavailable. */
export async function syncMediaWithDrivePreference(): Promise<MediaManifest> {
  try {
    const driveManifest = await syncMediaFromGoogleDrive();
    if (driveManifest.assets.length > 0) {
      return driveManifest;
    }
  } catch (err) {
    console.warn("  ⚠ Google Drive sync failed:", err instanceof Error ? err.message : err);
  }

  console.log("📸 Falling back to local public/images scan…");
  return scanMediaLibrary();
}
