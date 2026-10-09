/**
 * Export the above-the-fold covers to local WebP (DESIGN.md §8.9).
 *
 *   npm run media:covers            # idempotent — skips covers already on disk
 *   npm run media:covers -- --force # re-export everything
 *
 * For every curated asset carrying a `cover-*`, `service-cover-*` or
 * `concept-*` role (the three case-page covers are LCP too) the script
 * fetches the Drive original once into `.cache/media/` (git-ignored), then
 * writes to `public/images/covers/`:
 *
 *   <role>-1920.webp  full frame at 1920 wide   (desktop; 4:5 via object-fit + focal)
 *   <role>-1280.webp  full frame at 1280 wide   (laptops)
 *   <role>-768.webp   768×960 4:5 crop at the focal point (phones)
 *
 * WebP quality starts at 78 (effort 5, no sharpening, no colour change) and
 * steps down 4 at a time until the file fits its budget — 90 KB at 768w,
 * 220 KB at 1920w, 150 KB at 1280w — and the run fails if the floor (q 40)
 * still does not fit. A 24px-wide blur data URL is generated for every
 * exported cover and, from the `=w48` Drive variant, for every other asset,
 * then written back into the MEDIA_EXPORTS block of image-curation.ts.
 *
 * Runs under tsx so it can import the TypeScript curation module directly.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_CURATION, driveOriginalUrl, driveUrl } from "../src/brand/data/image-curation.ts";

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, ".cache", "media");
const OUT_DIR = path.join(ROOT, "public", "images", "covers");
const CURATION_FILE = path.join(ROOT, "src", "brand", "data", "image-curation.ts");
const PUBLIC_PREFIX = "/images/covers";

const FORCE = process.argv.includes("--force");
const KB = 1024;
const START_QUALITY = 78;
const FLOOR_QUALITY = 40;
const BUDGET = { 1920: 220 * KB, 1280: 150 * KB, 768: 90 * KB };
const BLUR_WIDTH = 24;

const isCoverRole = (role) =>
  role.startsWith("cover-") || role.startsWith("service-cover-") || role.startsWith("concept-");

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

/** Fetch a Drive URL once into the cache; later runs are offline. */
async function cached(id, suffix, url) {
  const file = path.join(CACHE_DIR, `${id}${suffix}`);
  if (await exists(file)) return file;
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Drive fetch failed for ${id}: ${res.status} ${res.statusText}`);
  await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/** `object-fit: cover` + `object-position: focal` — the exact crop the page shows. */
async function focalCrop(file, width, height, focal) {
  const meta = await sharp(file).metadata();
  const swapped = (meta.orientation ?? 1) >= 5;
  const srcW = swapped ? meta.height : meta.width;
  const srcH = swapped ? meta.width : meta.height;
  const scale = Math.max(width / srcW, height / srcH);
  const rw = Math.ceil(srcW * scale);
  const rh = Math.ceil(srcH * scale);
  const left = clamp(Math.round(rw * focal.x - width / 2), 0, rw - width);
  const top = clamp(Math.round(rh * focal.y - height / 2), 0, rh - height);
  return sharp(file).rotate().resize(rw, rh).extract({ left, top, width, height });
}

/** Lower quality in steps until the WebP fits; throws when even the floor does not. */
async function webpUnder(pipeline, maxBytes, label) {
  for (let quality = START_QUALITY; quality >= FLOOR_QUALITY; quality -= 4) {
    const buffer = await pipeline.clone().webp({ quality, effort: 5 }).toBuffer();
    if (buffer.length <= maxBytes) return { buffer, quality };
  }
  throw new Error(`${label} does not fit ${Math.round(maxBytes / KB)} KB even at quality ${FLOOR_QUALITY}`);
}

/** 24px-wide WebP as a data URL for next/image `blurDataURL`. */
async function blurDataUrl(pipeline) {
  const buffer = await pipeline.clone().resize({ width: BLUR_WIDTH }).webp({ quality: 50 }).toBuffer();
  return `data:image/webp;base64,${buffer.toString("base64")}`;
}

async function exportCover(asset, role) {
  const outBase = path.join(OUT_DIR, role);
  const publicBase = `${PUBLIC_PREFIX}/${role}`;
  const allExist =
    (await exists(`${outBase}-1920.webp`)) &&
    (await exists(`${outBase}-1280.webp`)) &&
    (await exists(`${outBase}-768.webp`));

  const original = await cached(asset.id, ".jpg", driveOriginalUrl(asset.id));
  const full = sharp(original).rotate();
  const blur = await blurDataUrl(full);
  if (allExist && !FORCE) {
    console.log(`= ${role} (exists)`);
    return { local: publicBase, blur };
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  const sizes = [];
  for (const width of [1920, 1280]) {
    const { buffer, quality } = await webpUnder(
      full.clone().resize({ width, withoutEnlargement: true }),
      BUDGET[width],
      `${role}-${width}`
    );
    await fs.writeFile(`${outBase}-${width}.webp`, buffer);
    sizes.push(`${width}w ${Math.round(buffer.length / KB)} KB q${quality}`);
  }
  const phone = await focalCrop(original, 768, 960, asset.focal);
  const { buffer, quality } = await webpUnder(phone, BUDGET[768], `${role}-768`);
  await fs.writeFile(`${outBase}-768.webp`, buffer);
  sizes.push(`768w ${Math.round(buffer.length / KB)} KB q${quality}`);
  console.log(`✓ ${role}  ${sizes.join(" · ")}`);
  return { local: publicBase, blur };
}

/** Blur for an asset that is never exported — from the tiny Drive variant. */
async function blurOnly(asset) {
  const small = await cached(asset.id, "-w48.jpg", driveUrl(asset.id, 48));
  return { blur: await blurDataUrl(sharp(small).rotate()) };
}

/** Rewrite the MEDIA_EXPORTS block in image-curation.ts. */
async function writeBack(exports) {
  const source = await fs.readFile(CURATION_FILE, "utf8");
  const open = "/* <media-exports> written by scripts/export-covers.mjs — do not edit by hand */";
  const close = "/* </media-exports> */";
  const start = source.indexOf(open);
  const end = source.indexOf(close);
  if (start < 0 || end < 0) throw new Error("MEDIA_EXPORTS markers not found in image-curation.ts");
  const body = Object.entries(exports)
    .map(([id, v]) => {
      const local = v.local ? `local: ${JSON.stringify(v.local)}, ` : "";
      return `  ${JSON.stringify(id)}: { ${local}blur: ${JSON.stringify(v.blur)} },`;
    })
    .join("\n");
  const block = `${open}\nexport const MEDIA_EXPORTS: Record<string, { local?: string; blur: string }> = {\n${body}\n};\n`;
  await fs.writeFile(CURATION_FILE, source.slice(0, start) + block + source.slice(end), "utf8");
}

async function main() {
  const exports = {};
  let covers = 0;
  for (const asset of IMAGE_CURATION) {
    if (asset.roles.length === 0) continue; // rotated / held-back frames
    const role = asset.roles.find(isCoverRole);
    if (role) {
      exports[asset.id] = await exportCover(asset, role);
      covers += 1;
    } else {
      exports[asset.id] = await blurOnly(asset);
    }
  }
  await writeBack(exports);
  console.log(`Done: ${covers} covers × 3 widths in ${path.relative(ROOT, OUT_DIR)}, ${Object.keys(exports).length} blur placeholders written to image-curation.ts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
