/**
 * Generate the Nexyyra Events favicon / app-icon set from the official master.
 *
 *   node scripts/generate-brand-assets.mjs            # icon set only
 *   node scripts/generate-brand-assets.mjs --lockups  # also rewrite the two lock-up SVGs
 *
 * Source (not served): scripts/assets/nexyyra-logo-raw.png — the full lock-up
 * on a transparent (or pure black) background. The NX monogram is the top
 * ~56% of that frame, trimmed.
 *
 * Outputs (public/):
 *   favicon.ico (16/32/48 PNG layers), favicon.svg, favicon-16x16.png,
 *   favicon-32x32.png, safari-pinned-tab.svg (monochrome vector)
 * Outputs (public/brand/):
 *   apple-touch-icon.png 180 (navy), android-chrome-192/512.png (transparent),
 *   icon-192/512-maskable.png (navy, 20% safe-zone padding)
 *   --lockups: nexyyra-logo-dark.svg, nexyyra-monogram.svg (self-contained WebP embeds)
 *
 * Budget: every file ≤ 60 KB except android-chrome-512.png ≤ 120 KB; the run
 * fails if a file exceeds it. OG cards live in scripts/build-og.mjs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const brandDir = path.join(root, "public", "brand");
const publicDir = path.join(root, "public");
const RAW_PATH = path.join(__dirname, "assets", "nexyyra-logo-raw.png");
const WRITE_LOCKUPS = process.argv.includes("--lockups");

// --lux-bg from src/styles/tokens.css — the only colour the icon set uses.
const NAVY = { r: 5, g: 8, b: 22, alpha: 1 };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };
const KB = 1024;
const BUDGET = { default: 60 * KB, "android-chrome-512.png": 120 * KB };

/** Luminance key — turns a pure-black background transparent, keeps the logo. */
async function removeBlackBackground(inputPath) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.from(data);
  const LOW = 10;
  const HIGH = 72;
  for (let i = 0; i < out.length; i += channels) {
    const m = Math.max(out[i], out[i + 1], out[i + 2]);
    const a = m <= LOW ? 0 : m >= HIGH ? 255 : Math.round(((m - LOW) / (HIGH - LOW)) * 255);
    out[i + 3] = Math.round((a * out[i + 3]) / 255);
  }
  return sharp(out, { raw: { width, height, channels } }).png();
}

/** Transparent master — skip keying when the source already carries alpha. */
async function transparentMaster() {
  if (!fs.existsSync(RAW_PATH)) throw new Error(`Raw master not found at ${RAW_PATH}`);
  const meta = await sharp(RAW_PATH).metadata();
  if (meta.hasAlpha) {
    const alpha = (await sharp(RAW_PATH).ensureAlpha().stats()).channels[3];
    if (alpha.min < 250) return sharp(RAW_PATH).trim({ threshold: 8 }).png().toBuffer();
  }
  return (await removeBlackBackground(RAW_PATH)).trim({ threshold: 8 }).png().toBuffer();
}

/** Square tile: the monogram fitted inside `size - 2*pad`, on navy or transparent. */
async function tile(monogram, size, pad, background, palette = true) {
  const inner = size - pad * 2;
  const fitted = await sharp(monogram).resize(inner, inner, { fit: "contain", background: CLEAR }).toBuffer();
  const png = sharp({ create: { width: size, height: size, channels: 4, background } }).composite([
    { input: fitted, gravity: "center" },
  ]);
  return palette
    ? png.png({ palette: true, quality: 90, compressionLevel: 9, effort: 10 }).toBuffer()
    : png.png({ compressionLevel: 9 }).toBuffer();
}

/** ICO container with PNG-compressed layers (Vista+/all evergreen browsers). */
function buildIco(layers) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(layers.length, 4);
  const dir = Buffer.alloc(16 * layers.length);
  let offset = 6 + dir.length;
  layers.forEach(({ size, png }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(png.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += png.length;
  });
  return Buffer.concat([header, dir, ...layers.map((l) => l.png)]);
}

/** favicon.svg — a vector wrapper around a small WebP of the monogram (crisp at 2×). */
async function buildFaviconSvg(monogram) {
  const webp = await sharp(monogram)
    .resize(128, 128, { fit: "contain", background: CLEAR })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toBuffer();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Nexyyra"><title>Nexyyra</title><image width="64" height="64" href="data:image/webp;base64,${webp.toString("base64")}"/></svg>`;
}

/**
 * safari-pinned-tab.svg — Safari needs a single-colour vector. The monogram
 * alpha is sampled on a 64-grid and each horizontal run becomes one rect of
 * the path, so the silhouette is a true path (Safari tints it via `color`).
 */
async function buildPinnedTab(monogram) {
  const N = 64;
  const { data } = await sharp(monogram)
    .resize(N, N, { fit: "contain", background: CLEAR })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const parts = [];
  for (let y = 0; y < N; y++) {
    let x = 0;
    while (x < N) {
      if (data[(y * N + x) * 4 + 3] < 110) {
        x++;
        continue;
      }
      let w = 0;
      while (x + w < N && data[(y * N + x + w) * 4 + 3] >= 110) w++;
      parts.push(`M${x} ${y}h${w}v1h-${w}z`);
      x += w;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${N} ${N}"><path fill="#000" d="${parts.join("")}"/></svg>`;
}

function embeddedSvg(webp, w, h, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><title>${label}</title><image width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" href="data:image/webp;base64,${webp.toString("base64")}"/></svg>`;
}

const written = [];
function write(file, buffer) {
  fs.writeFileSync(file, buffer);
  written.push(file);
}

async function main() {
  fs.mkdirSync(brandDir, { recursive: true });
  const master = await transparentMaster();
  const { width: mW = 1024, height: mH = 1024 } = await sharp(master).metadata();

  // The NX monogram sits in the top ~56% of the lock-up.
  const monogram = await sharp(master)
    .extract({ left: 0, top: 0, width: mW, height: Math.round(mH * 0.56) })
    .trim({ threshold: 8 })
    .png()
    .toBuffer();

  // The monogram's box is airy (sparkle + trailing dots), so these pads are tight.
  write(path.join(brandDir, "apple-touch-icon.png"), await tile(monogram, 180, 12, NAVY));
  write(path.join(brandDir, "android-chrome-192.png"), await tile(monogram, 192, 8, CLEAR));
  write(path.join(brandDir, "android-chrome-512.png"), await tile(monogram, 512, 20, CLEAR));
  // Maskable: content inside the central 60% survives every platform mask.
  write(path.join(brandDir, "icon-192-maskable.png"), await tile(monogram, 192, 38, NAVY));
  write(path.join(brandDir, "icon-512-maskable.png"), await tile(monogram, 512, 102, NAVY));

  const fav16 = await tile(monogram, 16, 1, CLEAR, false);
  const fav32 = await tile(monogram, 32, 2, CLEAR, false);
  const fav48 = await tile(monogram, 48, 3, CLEAR, false);
  write(path.join(publicDir, "favicon-16x16.png"), fav16);
  write(path.join(publicDir, "favicon-32x32.png"), fav32);
  write(
    path.join(publicDir, "favicon.ico"),
    buildIco([
      { size: 16, png: fav16 },
      { size: 32, png: fav32 },
      { size: 48, png: fav48 },
    ]),
  );
  write(path.join(publicDir, "favicon.svg"), await buildFaviconSvg(monogram));
  write(path.join(publicDir, "safari-pinned-tab.svg"), await buildPinnedTab(monogram));

  if (WRITE_LOCKUPS) {
    const lockup = await sharp(master).resize({ width: 520, withoutEnlargement: true }).webp({ quality: 88 }).toBuffer();
    const lm = await sharp(lockup).metadata();
    write(path.join(brandDir, "nexyyra-logo-dark.svg"), embeddedSvg(lockup, lm.width, lm.height, "Nexyyra Events"));
    const mono = await sharp(monogram).resize(256, 256, { fit: "contain", background: CLEAR }).webp({ quality: 88 }).toBuffer();
    write(path.join(brandDir, "nexyyra-monogram.svg"), embeddedSvg(mono, 256, 256, "Nexyyra Events"));
  }

  let over = 0;
  for (const file of written) {
    const name = path.basename(file);
    const size = fs.statSync(file).size;
    const budget = BUDGET[name] ?? BUDGET.default;
    const flag = size > budget ? "  OVER BUDGET" : "";
    if (flag) over++;
    console.log(`${flag ? "✗" : "✓"} ${path.relative(root, file)}  ${(size / KB).toFixed(1)} KB${flag}`);
  }
  if (over) throw new Error(`${over} file(s) exceed the size budget`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
