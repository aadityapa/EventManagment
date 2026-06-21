/**
 * Scan public/images + public/videos, index library + generate brand-images module
 */
process.env.MEDIA_FAST_INDEX ??= "1";

import {
  ensureMediaDirectories,
  rebuildMediaManifest,
} from "../src/lib/media/manifest-service";
import { writeBrandImagesModule } from "../src/lib/media/brand-images";

async function main() {
  console.log("📸 Nexyyra media sync — scanning library…");
  await ensureMediaDirectories();
  const manifest = await rebuildMediaManifest();
  await writeBrandImagesModule(manifest.assets);
  console.log(`✓ Indexed ${manifest.assets.length} images, ${manifest.videos.length} videos`);
  console.log(`✓ Brand images: src/brand/data/brand-images.generated.ts`);
  console.log(`✓ Manifest: public/media-manifest.json (${manifest.generatedAt})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
