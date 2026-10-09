/**
 * Rebuild src/brand/data/brand-images.generated.ts from the committed
 * public/media-manifest.json — no Google Drive call, no credentials.
 *
 * Use after editing src/brand/data/image-curation.ts:  npm run media:regen
 * (media:sync does the same but re-indexes Drive first.)
 */
import { writeBrandImagesModule } from "../src/lib/media/brand-images";
import { readMediaManifest } from "../src/lib/media/manifest-read";

async function main() {
  const manifest = await readMediaManifest();
  if (!manifest?.assets.length) {
    throw new Error(
      "public/media-manifest.json is missing or empty — run `npm run media:sync` first."
    );
  }

  const map = await writeBrandImagesModule(manifest.assets);
  console.log(
    `✓ brand-images.generated.ts rebuilt from ${manifest.assets.length} assets ` +
      `(${manifest.provider}, manifest ${manifest.generatedAt})`
  );
  console.log(`  hero.poster → ${map.hero.poster}`);
}

main().catch((err: Error) => {
  console.error(err);
  process.exit(1);
});
