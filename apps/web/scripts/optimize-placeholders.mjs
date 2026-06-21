/**
 * Compress placeholder PNGs to WebP for faster LCP fallbacks.
 * Run: node scripts/optimize-placeholders.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const dir = path.join(process.cwd(), "public", "images", "placeholders");

if (!fs.existsSync(dir)) {
  console.log("No placeholders directory — skip");
  process.exit(0);
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));

for (const file of files) {
  const input = path.join(dir, file);
  const output = path.join(dir, file.replace(/\.png$/i, ".webp"));
  const before = fs.statSync(input).size;
  await sharp(input)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 78, effort: 4 })
    .toFile(output);
  const after = fs.statSync(output).size;
  console.log(`${file} → ${path.basename(output)} (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`);
}

console.log("Done.");
