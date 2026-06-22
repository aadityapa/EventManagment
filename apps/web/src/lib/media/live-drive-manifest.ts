import { unstable_cache } from "next/cache";
import { buildDriveManifest } from "./drive-sync";
import { shouldUseGoogleDrive } from "./drive-client";
import { readMediaManifest } from "./manifest-read";
import type { MediaManifest } from "./types";

export const LIVE_DRIVE_CACHE_TAG = "live-drive-manifest";

const REVALIDATE_SECONDS = Number(process.env.MEDIA_REVALIDATE_SECONDS ?? 120);

/** True when runtime should pull fresh listings from Google Drive (not only build-time manifest). */
export function shouldUseLiveDriveSync(): boolean {
  if (process.env.MEDIA_LIVE_SYNC === "0") return false;
  return shouldUseGoogleDrive();
}

/** Fetch Drive folder listing without writing to disk — falls back to committed manifest. */
export async function fetchLiveDriveManifestUncached(): Promise<MediaManifest> {
  try {
    const manifest = await buildDriveManifest();
    if (manifest.assets.length > 0) {
      return manifest;
    }
  } catch (err) {
    console.warn(
      "[media] Live Google Drive sync failed:",
      err instanceof Error ? err.message : err
    );
  }

  const fallback = await readMediaManifest();
  if (fallback?.assets.length) {
    return fallback;
  }

  throw new Error(
    "No media assets found. Upload photos to Google Drive or run npm run media:sync."
  );
}

/** Cached live manifest — auto-refreshes every MEDIA_REVALIDATE_SECONDS (default 2 min). */
export const getLiveDriveManifest = unstable_cache(
  fetchLiveDriveManifestUncached,
  ["live-drive-manifest-v1"],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: [LIVE_DRIVE_CACHE_TAG, "media-manifest-v2"],
  }
);
