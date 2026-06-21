import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type {
  MediaAsset,
  MediaImageFolder,
  MediaManifest,
  MediaSidecarMeta,
  MediaUploadInput,
  MediaVideoAsset,
} from "./types";
import {
  MEDIA_IMAGE_FOLDERS,
} from "./types";
import { categoryFromFolder, humanizeFilename } from "./categories";
import {
  getImagesRoot,
  getLogosRoot,
  getManifestFilePath,
  getPublicRoot,
  getVideosRoot,
  isGeneratedVariant,
  MEDIA_SOURCE_EXTENSIONS,
  MEDIA_VARIANT_WIDTHS,
  MEDIA_VIDEO_EXTENSIONS,
  masterWebpFilename,
  variantFilename,
} from "./paths";

const MANIFEST_VERSION = 1;

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function readSidecarMeta(imagePath: string): Promise<MediaSidecarMeta | null> {
  const sidecar = imagePath.replace(/\.[^.]+$/, ".meta.json");
  if (!(await fileExists(sidecar))) return null;
  try {
    const raw = await fs.readFile(sidecar, "utf8");
    return JSON.parse(raw) as MediaSidecarMeta;
  } catch {
    return null;
  }
}

async function generateBlurDataURL(buffer: Buffer): Promise<string> {
  const { data, info } = await sharp(buffer)
    .resize(16, null, { withoutEnlargement: true })
    .webp({ quality: 40 })
    .toBuffer({ resolveWithObject: true });

  return `data:image/webp;base64,${data.toString("base64")}`;
}

async function processImageFile(
  folder: MediaImageFolder,
  absolutePath: string,
  relativePublicPath: string
): Promise<MediaAsset | null> {
  const filename = path.basename(absolutePath);
  const ext = path.extname(filename).toLowerCase();

  if (!MEDIA_SOURCE_EXTENSIONS.has(ext) || isGeneratedVariant(filename)) {
    return null;
  }

  const baseName = path.basename(filename, ext);
  const dir = path.dirname(absolutePath);
  const sidecar = await readSidecarMeta(absolutePath);
  const category = sidecar?.category ?? categoryFromFolder(folder);
  const title = sidecar?.title ?? humanizeFilename(baseName);
  const alt = sidecar?.alt ?? `${title} — Nexyyra Events`;

  const sourceBuffer = await fs.readFile(absolutePath);
  const metadata = await sharp(sourceBuffer).metadata();
  const sourceWidth = metadata.width ?? 1920;
  const sourceHeight = metadata.height ?? 1280;

  const masterName = masterWebpFilename(baseName);
  const masterPath = path.join(dir, masterName);
  const masterPublic = `${relativePublicPath}/${masterName}`;

  const sourceStat = await fs.stat(absolutePath);
  let masterStat = sourceStat;
  if (!(await fileExists(masterPath)) || (await fs.stat(masterPath)).mtime < sourceStat.mtime) {
    await sharp(sourceBuffer)
      .webp({ quality: 88, effort: 4 })
      .toFile(masterPath);
    masterStat = await fs.stat(masterPath);
  }

  const variants: MediaAsset["variants"] = [];
  for (const width of MEDIA_VARIANT_WIDTHS) {
    if (width > sourceWidth * 1.1) continue;
    const vName = variantFilename(baseName, width);
    const vPath = path.join(dir, vName);
    const vPublic = `${relativePublicPath}/${vName}`;

    if (!(await fileExists(vPath)) || (await fs.stat(vPath)).mtime < sourceStat.mtime) {
      await sharp(sourceBuffer)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toFile(vPath);
    }

    const vMeta = await sharp(vPath).metadata();
    variants.push({
      width,
      src: vPublic,
      height: vMeta.height ?? Math.round((sourceHeight / sourceWidth) * width),
    });
  }

  const blurDataURL = await generateBlurDataURL(sourceBuffer);
  const masterMeta = await sharp(masterPath).metadata();
  const width = masterMeta.width ?? sourceWidth;
  const height = masterMeta.height ?? sourceHeight;

  return {
    id: `${folder}-${baseName}`,
    type: "image",
    folder,
    category,
    src: masterPublic,
    filename: masterName,
    title,
    alt,
    width,
    height,
    aspectRatio: width / height,
    blurDataURL,
    variants: variants.sort((a, b) => a.width - b.width),
    featured: sidecar?.featured,
    sortOrder: sidecar?.sortOrder,
    createdAt: sourceStat.birthtime.toISOString(),
    updatedAt: masterStat.mtime.toISOString(),
  };
}

async function scanVideoFolder(): Promise<MediaVideoAsset[]> {
  const root = getVideosRoot();
  if (!(await fileExists(root))) return [];

  const entries = await fs.readdir(root, { withFileTypes: true });
  const videos: MediaVideoAsset[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!MEDIA_VIDEO_EXTENSIONS.has(ext)) continue;

    const absolutePath = path.join(root, entry.name);
    const stat = await fs.stat(absolutePath);
    const base = path.basename(entry.name, ext);
    const sidecar = await readSidecarMeta(absolutePath);
    const posterPath = path.join(root, `${base}-poster.webp`);
    const posterPublic = (await fileExists(posterPath))
      ? `/videos/${base}-poster.webp`
      : undefined;

    videos.push({
      id: `video-${base}`,
      type: "video",
      folder: "videos",
      category: sidecar?.category ?? "wedding",
      src: `/videos/${entry.name}`,
      filename: entry.name,
      title: sidecar?.title ?? humanizeFilename(base),
      poster: posterPublic,
      createdAt: stat.birthtime.toISOString(),
    });
  }

  return videos.sort((a, b) => a.title.localeCompare(b.title));
}

export async function scanMediaLibrary(): Promise<MediaManifest> {
  const imagesRoot = getImagesRoot();
  const assets: MediaAsset[] = [];

  for (const folder of MEDIA_IMAGE_FOLDERS) {
    const folderPath = path.join(imagesRoot, folder);
    if (!(await fileExists(folderPath))) continue;

    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const absolutePath = path.join(folderPath, entry.name);
      const relativePublic = `/images/${folder}`;
      const asset = await processImageFile(folder, absolutePath, relativePublic);
      if (asset) assets.push(asset);
    }
  }

  assets.sort((a, b) => {
    const orderA = a.sortOrder ?? 9999;
    const orderB = b.sortOrder ?? 9999;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const videos = await scanVideoFolder();

  return {
    version: MANIFEST_VERSION,
    generatedAt: new Date().toISOString(),
    provider: "filesystem",
    assets,
    videos,
  };
}

export async function writeMediaManifest(manifest: MediaManifest): Promise<void> {
  const filePath = getManifestFilePath();
  await fs.writeFile(filePath, JSON.stringify(manifest, null, 2), "utf8");
}

export async function readMediaManifest(): Promise<MediaManifest | null> {
  const filePath = getManifestFilePath();
  if (!(await fileExists(filePath))) return null;
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as MediaManifest;
  } catch {
    return null;
  }
}

export async function rebuildMediaManifest(): Promise<MediaManifest> {
  const manifest = await scanMediaLibrary();
  await writeMediaManifest(manifest);
  return manifest;
}

export async function getOrRebuildManifest(force = false): Promise<MediaManifest> {
  if (!force) {
    const existing = await readMediaManifest();
    if (existing) return existing;
  }
  return rebuildMediaManifest();
}

export async function uploadMediaFile(
  buffer: Buffer,
  originalFilename: string,
  input: MediaUploadInput
): Promise<MediaAsset> {
  const ext = path.extname(originalFilename).toLowerCase() || ".jpg";
  const safeBase = path
    .basename(originalFilename, ext)
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .slice(0, 80);

  const timestamp = Date.now();
  const filename = `${safeBase || "upload"}-${timestamp}${ext}`;
  const folderPath = path.join(getImagesRoot(), input.folder);
  await fs.mkdir(folderPath, { recursive: true });

  const absolutePath = path.join(folderPath, filename);
  await fs.writeFile(absolutePath, buffer);

  if (input.category || input.title || input.alt || input.featured !== undefined) {
    const sidecar: MediaSidecarMeta = {
      category: input.category,
      title: input.title,
      alt: input.alt,
      featured: input.featured,
    };
    await fs.writeFile(
      absolutePath.replace(/\.[^.]+$/, ".meta.json"),
      JSON.stringify(sidecar, null, 2),
      "utf8"
    );
  }

  const relativePublic = `/images/${input.folder}`;
  const asset = await processImageFile(input.folder, absolutePath, relativePublic);
  if (!asset) throw new Error("Failed to process uploaded image");

  const manifest = await rebuildMediaManifest();
  const updated = manifest.assets.find((a) => a.id === asset.id);
  return updated ?? asset;
}

/** Ensure public dirs exist */
export async function ensureMediaDirectories(): Promise<void> {
  const root = getPublicRoot();
  await fs.mkdir(path.join(root, "images"), { recursive: true });
  for (const folder of MEDIA_IMAGE_FOLDERS) {
    await fs.mkdir(path.join(root, "images", folder), { recursive: true });
  }
  await fs.mkdir(getVideosRoot(), { recursive: true });
  await fs.mkdir(getLogosRoot(), { recursive: true });
}
