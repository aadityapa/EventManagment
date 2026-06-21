import type { MediaAsset, MediaImageFolder, MediaManifest, MediaSidecarMeta } from "./types";
import { MEDIA_IMAGE_FOLDERS } from "./types";
import { categoryFromFolder, humanizeFilename } from "./categories";
import {
  getDriveFolderId,
  listAllDriveFilesInFolder,
  type DriveFile,
} from "./drive-client";
import { listPublicDriveFolderFiles } from "./drive-public-list";
import { buildDriveVariants, driveImageUrl } from "./drive-urls";
import { readMediaManifest, writeMediaManifest } from "./manifest-io";
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

function isImageFile(file: Pick<DriveFile, "mimeType" | "name">): boolean {
  if (file.mimeType?.startsWith(IMAGE_MIME_PREFIX)) return true;
  return /\.(jpe?g|png|webp|gif|avif)$/i.test(file.name);
}

function isFolder(file: DriveFile): boolean {
  return file.mimeType === "application/vnd.google-apps.folder";
}

function normalizeFilename(name: string): string {
  return name.trim().toLowerCase();
}

async function buildFilenameFolderMap(): Promise<Map<string, MediaImageFolder>> {
  const map = new Map<string, MediaImageFolder>();
  const existing = await readMediaManifest();
  if (!existing) return map;

  for (const asset of existing.assets) {
    if (!asset.filename) continue;
    if (!MEDIA_IMAGE_FOLDERS.includes(asset.folder as MediaImageFolder)) continue;
    map.set(normalizeFilename(asset.filename), asset.folder as MediaImageFolder);
  }
  return map;
}

function resolveFolderForFilename(
  filename: string,
  folderByFilename: Map<string, MediaImageFolder>,
  fallback: MediaImageFolder = "gallery"
): MediaImageFolder {
  return folderByFilename.get(normalizeFilename(filename)) ?? fallback;
}

function assetFromDriveEntry(
  folder: MediaImageFolder,
  file: { id: string; name: string; createdTime?: string; modifiedTime?: string; imageMediaMetadata?: DriveFile["imageMediaMetadata"] },
  sidecar?: MediaSidecarMeta | null
): MediaAsset | null {
  if (!isImageFile({ mimeType: file.imageMediaMetadata ? "image/jpeg" : "", name: file.name })) {
    if (!/\.(jpe?g|png|webp|gif|avif)$/i.test(file.name)) return null;
  }

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

function hasDriveCredentials(): boolean {
  return Boolean(
    process.env.GOOGLE_DRIVE_API_KEY ??
      process.env.GOOGLE_API_KEY ??
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  );
}

function sortAssets(assets: MediaAsset[]): MediaAsset[] {
  return [...assets].sort((a, b) => {
    const orderA = a.sortOrder ?? 9999;
    const orderB = b.sortOrder ?? 9999;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

async function indexDriveFolderTreeViaApi(
  rootFolderId: string,
  folderByFilename: Map<string, MediaImageFolder>
): Promise<MediaAsset[]> {
  const rootFiles = await listAllDriveFilesInFolder(rootFolderId);
  const assets: MediaAsset[] = [];

  const subfolders = rootFiles.filter(isFolder);
  const rootImages = rootFiles.filter((f) => !isFolder(f));

  for (const subfolder of subfolders) {
    const folder = normalizeFolderName(subfolder.name);
    if (!folder) {
      console.warn(`  ⚠ Skipping unknown Drive subfolder: ${subfolder.name}`);
      continue;
    }

    const files = await listAllDriveFilesInFolder(subfolder.id);
    for (const file of files) {
      if (isFolder(file)) continue;
      const asset = assetFromDriveEntry(folder, file);
      if (asset) assets.push(asset);
    }
  }

  for (const file of rootImages) {
    if (file.name.endsWith(".meta.json")) continue;
    const folder = resolveFolderForFilename(file.name, folderByFilename);
    const asset = assetFromDriveEntry(folder, file);
    if (asset) assets.push(asset);
  }

  return sortAssets(assets);
}

async function indexDriveFolderViaPublicEmbed(
  rootFolderId: string,
  folderByFilename: Map<string, MediaImageFolder>
): Promise<MediaAsset[]> {
  console.log("  ↳ Using public folder embed listing (no Drive API key)");
  const files = await listPublicDriveFolderFiles(rootFolderId);
  const assets: MediaAsset[] = [];

  for (const file of files) {
    const folder = resolveFolderForFilename(file.name, folderByFilename);
    const asset = assetFromDriveEntry(folder, file);
    if (asset) assets.push(asset);
  }

  return sortAssets(assets);
}

async function indexDriveFolder(
  rootFolderId: string,
  folderByFilename: Map<string, MediaImageFolder>
): Promise<MediaAsset[]> {
  if (hasDriveCredentials()) {
    try {
      const assets = await indexDriveFolderTreeViaApi(rootFolderId, folderByFilename);
      if (assets.length > 0) return assets;
    } catch (err) {
      console.warn(
        "  ⚠ Drive API listing failed:",
        err instanceof Error ? err.message : err
      );
    }
  }

  return indexDriveFolderViaPublicEmbed(rootFolderId, folderByFilename);
}

export async function syncMediaFromGoogleDrive(): Promise<MediaManifest> {
  const folderId = getDriveFolderId();
  console.log(`☁️  Syncing media from Google Drive folder ${folderId}…`);

  const folderByFilename = await buildFilenameFolderMap();
  const assets = await indexDriveFolder(folderId, folderByFilename);

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
