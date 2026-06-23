/**
 * Sync media manifest from Google Drive (preferred) or local public/images.
 * Run before build — writes media-manifest.json + brand-images.generated.ts
 *
 * On Vercel without GOOGLE_DRIVE_API_KEY, falls back to the committed manifest
 * so builds never fail due to missing Drive credentials.
 */
import fs from "node:fs";
import path from "node:path";

function loadRootEnv() {
  const candidates = [
    path.join(process.cwd(), "..", "..", ".env"),
    path.join(process.cwd(), ".env"),
  ];
  for (const envFile of candidates) {
    if (!fs.existsSync(envFile)) continue;
    for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m || process.env[m[1]]) continue;
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

loadRootEnv();
process.env.MEDIA_FAST_INDEX ??= "1";

import { shouldUseGoogleDrive } from "../src/lib/media/drive-client";
import { syncMediaWithDrivePreference } from "../src/lib/media/drive-sync";
import {
  ensureMediaDirectories,
  rebuildMediaManifest,
} from "../src/lib/media/manifest-service";
import { writeBrandImagesModule } from "../src/lib/media/brand-images";
import { readMediaManifest, writeMediaManifest } from "../src/lib/media/manifest-read";

const MANIFEST_PATH = path.join(process.cwd(), "public", "media-manifest.json");
const ON_VERCEL = process.env.VERCEL === "1";

function hasDriveCredentials() {
  return Boolean(
    process.env.GOOGLE_DRIVE_API_KEY?.trim() ||
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim(),
  );
}

async function useCommittedManifest(reason: string) {
  const existing = await readMediaManifest();
  if (!existing?.assets.length) return false;
  console.warn(`⚠ ${reason} — using committed manifest (${existing.assets.length} assets)`);
  await writeBrandImagesModule(existing.assets);
  console.log(`✓ Manifest: public/media-manifest.json (${existing.generatedAt})`);
  return true;
}

async function preserveOrUse(manifest: Awaited<ReturnType<typeof syncMediaWithDrivePreference>>) {
  if (manifest.assets.length > 0) {
    if (manifest.provider !== "google-drive") {
      await writeMediaManifest(manifest);
    }
    await writeBrandImagesModule(manifest.assets);
    return manifest;
  }

  if (await useCommittedManifest("No new images indexed")) {
    return (await readMediaManifest())!;
  }

  throw new Error(
    "No media assets found. Upload photos to Google Drive and set GOOGLE_DRIVE_API_KEY, " +
      "or add images under public/images/ locally, then rerun media:sync.",
  );
}

async function main() {
  await ensureMediaDirectories();

  if (ON_VERCEL && !hasDriveCredentials() && fs.existsSync(MANIFEST_PATH)) {
    if (await useCommittedManifest("Vercel build without Drive credentials")) return;
  }

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

main().catch(async (err: Error) => {
  if (ON_VERCEL && fs.existsSync(MANIFEST_PATH)) {
    try {
      if (await useCommittedManifest(`Media sync failed (${err.message})`)) {
        process.exit(0);
      }
    } catch {
      /* fall through */
    }
  }
  console.error(err);
  process.exit(1);
});
