/**
 * Scan public/images + public/videos, generate WebP variants + media-manifest.json
 */
import {
  ensureMediaDirectories,
  rebuildMediaManifest,
} from "../src/lib/media/manifest-service";

async function main() {
  console.log("📸 Nexyyra media sync — scanning library…");
  await ensureMediaDirectories();
  const manifest = await rebuildMediaManifest();
  console.log(`✓ Indexed ${manifest.assets.length} images, ${manifest.videos.length} videos`);
  console.log(`✓ Manifest: public/media-manifest.json (${manifest.generatedAt})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
