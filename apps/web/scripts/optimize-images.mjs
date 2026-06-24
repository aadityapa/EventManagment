/**
 * Compress public raster assets for LCP and below-fold sections.
 * Run: node scripts/optimize-images.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.join(process.cwd(), "public");
const heroDir = path.join(publicDir, "images", "hero");
const placeholdersDir = path.join(publicDir, "images", "placeholders");

const HERO_REMOTE =
  "https://lh3.googleusercontent.com/d/1c5nKDx-AEuP223fKQFSOe0j_-bzLUn1D=w1920";

const TARGETS = [
  {
    name: "hero",
    output: path.join(heroDir, "hero.avif"),
    maxBytes: 200 * 1024,
    width: 1400,
    quality: 52,
    remote: HERO_REMOTE,
  },
];

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function writeAvif({ name, input, output, maxBytes, width, quality, remote }) {
  fs.mkdirSync(path.dirname(output), { recursive: true });

  let buffer;
  if (input && fs.existsSync(input)) {
    buffer = fs.readFileSync(input);
  } else if (remote) {
    console.log(`Fetching ${name} from remote…`);
    buffer = await fetchBuffer(remote);
  } else {
    console.warn(`Skip ${name} — no input`);
    return;
  }

  let q = quality;
  let attempt = 0;
  while (attempt < 6) {
    await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: q, effort: 4 })
      .toFile(output);

    const size = fs.statSync(output).size;
    console.log(
      `${name}: ${path.basename(output)} — ${Math.round(size / 1024)}KB (q=${q})`
    );
    if (size <= maxBytes) return;
    q -= 8;
    attempt += 1;
  }

  console.warn(`${name}: still above ${Math.round(maxBytes / 1024)}KB after retries`);
}

async function optimizePlaceholders() {
  if (!fs.existsSync(placeholdersDir)) {
    console.log("No placeholders directory — skip");
    return;
  }

  const files = fs.readdirSync(placeholdersDir).filter((f) => /\.(png|jpe?g)$/i.test(f));
  for (const file of files) {
    const input = path.join(placeholdersDir, file);
    const output = path.join(placeholdersDir, file.replace(/\.(png|jpe?g)$/i, ".avif"));
    const before = fs.statSync(input).size;
    await sharp(input)
      .resize({ width: 1200, withoutEnlargement: true })
      .avif({ quality: 55, effort: 4 })
      .toFile(output);
    const after = fs.statSync(output).size;
    console.log(
      `placeholder ${file} → ${path.basename(output)} (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`
    );
  }
}

async function main() {
  for (const target of TARGETS) {
    await writeAvif(target);
  }
  await optimizePlaceholders();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
