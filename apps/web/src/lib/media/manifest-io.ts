import fs from "node:fs/promises";
import type { MediaManifest } from "./types";
import { getManifestFilePath } from "./paths";
import { isMediaReadonly } from "./runtime";

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
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

export async function writeMediaManifest(manifest: MediaManifest): Promise<void> {
  const filePath = getManifestFilePath();
  await fs.writeFile(filePath, JSON.stringify(manifest, null, 2), "utf8");
}

/** Read build-time manifest; avoid filesystem scans on Vercel. */
export async function getOrRebuildManifest(force = false): Promise<MediaManifest> {
  if (isMediaReadonly()) {
    const existing = await readMediaManifest();
    if (existing) return existing;
    throw new Error("Media manifest missing — ensure prebuild runs media:sync");
  }

  if (!force) {
    const existing = await readMediaManifest();
    if (existing && existing.assets.length > 0) return existing;
  }

  const { rebuildMediaManifest } = await import("./manifest-service");
  return rebuildMediaManifest();
}

/** Reindex: full scan locally; manifest refresh only on Vercel. */
export async function refreshMediaManifest(): Promise<MediaManifest> {
  if (isMediaReadonly()) {
    const existing = await readMediaManifest();
    if (!existing) {
      throw new Error("Media manifest missing — ensure prebuild runs media:sync");
    }
    return existing;
  }

  const { rebuildMediaManifest } = await import("./manifest-service");
  return rebuildMediaManifest();
}
