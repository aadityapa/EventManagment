import type { MediaManifest } from "./types";
import { readMediaManifest } from "./manifest-read";
import { isMediaReadonly } from "./runtime";
import { shouldUseLiveDriveSync, getLiveDriveManifest } from "./live-drive-manifest";

export { readMediaManifest, writeMediaManifest } from "./manifest-read";

/** Read manifest — live from Google Drive when enabled, else build-time file. */
export async function getOrRebuildManifest(force = false): Promise<MediaManifest> {
  if (shouldUseLiveDriveSync()) {
    if (!force) {
      return getLiveDriveManifest();
    }
    const { fetchLiveDriveManifestUncached } = await import("./live-drive-manifest");
    return fetchLiveDriveManifestUncached();
  }

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

/** Reindex — bust live cache on production or rescan locally. */
export async function refreshMediaManifest(): Promise<MediaManifest> {
  if (shouldUseLiveDriveSync()) {
    const { revalidateTag } = await import("next/cache");
    const { LIVE_DRIVE_CACHE_TAG, fetchLiveDriveManifestUncached } = await import(
      "./live-drive-manifest"
    );
    revalidateTag(LIVE_DRIVE_CACHE_TAG, "max");
    revalidateTag("media-manifest-v2", "max");
    return fetchLiveDriveManifestUncached();
  }

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
