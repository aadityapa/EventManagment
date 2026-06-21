/**
 * Sync media manifest from Google Drive (preferred) or local public/images.
 * Run before build — writes media-manifest.json + brand-images.generated.ts
 */
process.env.MEDIA_FAST_INDEX ??= "1";

import { shouldUseGoogleDrive } from "../src/lib/media/drive-client";
import { syncMediaWithDrivePreference } from "../src/lib/media/drive-sync";
import {
  ensureMediaDirectories,
  rebuildMediaManifest,
} from "../src/lib/media/manifest-service";
import { writeBrandImagesModule } from "../src/lib/media/brand-images";
import { readMediaManifest, writeMediaManifest } from "../src/lib/media/manifest-io";

async function preserveOrUse(manifest: Awaited<ReturnType<typeof syncMediaWithDrivePreference>>) {
  if (manifest.assets.length > 0) {
    if (manifest.provider !== "google-drive") {
      await writeMediaManifest(manifest);
    }
    await writeBrandImagesModule(manifest.assets);
    return manifest;
  }

  const existing = await readMediaManifest();
  if (existing?.assets.length) {
    console.warn("⚠ No new images indexed — keeping committed manifest");
    await writeBrandImagesModule(existing.assets);
    return existing;
  }

  throw new Error(
    "No media assets found. Upload photos to Google Drive and set GOOGLE_DRIVE_API_KEY, " +
      "or add images under public/images/ locally, then rerun media:sync."
  );
}

async function main() {
  await ensureMediaDirectories();

  let manifest;
  if (shouldUseGoogleDrive()) {
    console.log("📸 Nexyyra media sync — Google Drive source");
    const scanned = await syncMediaWithDrivePreference();
    manifest = await preserveOrUse(scanned);
  } else {
    console.log("📸 Nexyyra media sync — scanning local library…");
    const scanned = await rebuildMediaManifest();
    manifest = await preserveOrUse(scanned);
  }

  console.log(`✓ Provider: ${manifest.provider}`);
  console.log(`✓ Indexed ${manifest.assets.length} images, ${manifest.videos.length} videos`);
  console.log(`✓ Brand images: src/brand/data/brand-images.generated.ts`);
  console.log(`✓ Manifest: public/media-manifest.json (${manifest.generatedAt})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
