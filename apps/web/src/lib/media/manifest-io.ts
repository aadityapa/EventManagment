import type { MediaManifest } from "./types";
import { readMediaManifest, writeMediaManifest } from "./manifest-read";
import { isMediaReadonly } from "./runtime";

export { readMediaManifest, writeMediaManifest } from "./manifest-read";

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
