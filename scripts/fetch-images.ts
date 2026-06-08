/**
 * Image Fetch & Optimization Pipeline
 * Fetches royalty-free images from Unsplash/Pexels/Pixabay APIs
 * Downloads, optimizes with sharp, and generates responsive sizes
 *
 * Usage: npm run images:fetch
 * Requires: UNSPLASH_ACCESS_KEY and/or PEXELS_API_KEY in .env
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

const OUTPUT_DIR = path.join(__dirname, "../apps/web/public/images");
const SIZES = [640, 828, 1200, 1920];

const EVENT_QUERIES: Record<string, string> = {
  corporate: "corporate event conference",
  wedding: "luxury wedding ceremony",
  destinationWedding: "destination beach wedding",
  birthday: "birthday party celebration",
  productLaunch: "product launch event",
  conference: "business conference speakers",
  exhibition: "trade show exhibition",
  concert: "concert live music stage",
  celebrity: "red carpet gala event",
  brandPromotion: "brand activation event",
  fashionShow: "fashion show runway",
  musicFestival: "music festival crowd",
  awardFunction: "awards ceremony gala",
  hero: "luxury event ballroom",
  gallery: "event celebration party",
};

async function fetchUnsplash(query: string, count = 1): Promise<string[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    console.warn("⚠ UNSPLASH_ACCESS_KEY not set, using fallback URLs");
    return [`https://source.unsplash.com/featured/1920x1080/?${encodeURIComponent(query)}`];
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}` } });
  if (!res.ok) throw new Error(`Unsplash API error: ${res.status}`);
  const data = await res.json();
  return data.results.map((r: { urls: { regular: string } }) => r.urls.regular);
}

async function fetchPexels(query: string, count = 1): Promise<string[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.photos.map((p: { src: { large2x: string } }) => p.src.large2x);
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirect = response.headers.location;
        if (redirect) return downloadFile(redirect, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", reject);
  });
}

async function optimizeImage(inputPath: string, outputDir: string, basename: string) {
  try {
    const sharp = (await import("sharp")).default;
    for (const width of SIZES) {
      const outPath = path.join(outputDir, `${basename}-${width}w.webp`);
      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outPath);
      console.log(`  ✓ Generated ${basename}-${width}w.webp`);
    }
  } catch {
    console.warn("  ⚠ sharp not available, skipping optimization");
  }
}

async function main() {
  console.log("🖼  Glitz Events & Promotions — Image Fetch Pipeline\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const manifest: Record<string, string[]> = {};

  for (const [category, query] of Object.entries(EVENT_QUERIES)) {
    console.log(`\n📸 Fetching: ${category} ("${query}")`);

    let urls: string[] = [];
    try {
      urls = await fetchUnsplash(query, category === "gallery" ? 4 : 1);
      if (urls.length === 0) urls = await fetchPexels(query, 1);
    } catch (err) {
      console.error(`  ✗ Failed: ${(err as Error).message}`);
      continue;
    }

    manifest[category] = [];

    for (let i = 0; i < urls.length; i++) {
      const basename = `${category}${urls.length > 1 ? `-${i}` : ""}`;
      const rawPath = path.join(OUTPUT_DIR, `${basename}-raw.jpg`);

      try {
        await downloadFile(urls[i], rawPath);
        console.log(`  ✓ Downloaded ${basename}`);
        await optimizeImage(rawPath, OUTPUT_DIR, basename);
        manifest[category].push(`/images/${basename}-1200w.webp`);
        fs.unlinkSync(rawPath);
      } catch (err) {
        console.error(`  ✗ Download failed: ${(err as Error).message}`);
        manifest[category].push(urls[i]);
      }
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log("\n✅ Image pipeline complete!");
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   Manifest: ${path.join(OUTPUT_DIR, "manifest.json")}`);
}

main().catch(console.error);
