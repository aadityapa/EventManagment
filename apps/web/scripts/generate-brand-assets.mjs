/**
 * Generate Nexyyra Events brand assets from the official master logo.
 *
 * The raw master (`public/brand/nexyyra-logo-raw.png`) is a luxury logo on a
 * solid black background. This script:
 *   1. Removes the black background -> true transparent master.
 *   2. Embeds the transparent raster as base64 inside self-contained SVGs
 *      (so they render correctly inside <img> tags AND stay transparent —
 *      no checkerboard, no external <image href> that browsers block).
 *   3. Crops the NX monogram for favicon / PWA / launcher icons.
 *
 * Run: node scripts/generate-brand-assets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const brandDir = path.join(root, "public", "brand");
const publicDir = path.join(root, "public");
const srcDir = path.join(__dirname, "assets");

// Raw master is the official logo on a black background (NOT served to clients).
const RAW_CANDIDATES = [
  path.join(srcDir, "nexyyra-logo-raw.png"),
  path.resolve(root, "../../ChatGPT Image Jun 24, 2026, 07_44_08 PM.png"),
];

function resolveRaw() {
  for (const p of RAW_CANDIDATES) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error("Raw master not found. Place it at scripts/assets/nexyyra-logo-raw.png");
}

/** Luminance key — turns the pure-black background transparent, keeps the logo. */
async function removeBlackBackground(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.from(data);
  const LOW = 10; // <= this brightness = background
  const HIGH = 72; // >= this brightness = solid logo; between = soft edge

  for (let i = 0; i < out.length; i += channels) {
    const m = Math.max(out[i], out[i + 1], out[i + 2]);
    let a;
    if (m <= LOW) a = 0;
    else if (m >= HIGH) a = 255;
    else a = Math.round(((m - LOW) / (HIGH - LOW)) * 255);
    out[i + 3] = Math.round((a * out[i + 3]) / 255);
  }

  return sharp(out, { raw: { width, height, channels } }).png({ compressionLevel: 9 });
}

/** Build a self-contained, transparent SVG that embeds a PNG buffer as base64. */
function buildEmbeddedSvg(pngBuffer, w, h, label) {
  const b64 = pngBuffer.toString("base64");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><title>${label}</title><image width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${b64}"/></svg>`;
}

async function main() {
  fs.mkdirSync(brandDir, { recursive: true });
  const rawPath = resolveRaw();

  // 1. Transparent master (trimmed).
  const transparentMaster = await (await removeBlackBackground(rawPath))
    .trim({ threshold: 8 })
    .toBuffer();
  const masterMeta = await sharp(transparentMaster).metadata();
  const mW = masterMeta.width ?? 1024;
  const mH = masterMeta.height ?? 1024;

  // Embed master at a retina-friendly size to keep SVG light.
  const EMBED_MAX = 720;
  const goldEmbed = await sharp(transparentMaster)
    .resize({ width: EMBED_MAX, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 90 })
    .toBuffer();
  const goldMeta = await sharp(goldEmbed).metadata();

  // Charcoal variant for light backgrounds (keeps shape, darkens metal).
  const charcoalEmbed = await sharp(transparentMaster)
    .resize({ width: EMBED_MAX, withoutEnlargement: true })
    .modulate({ brightness: 0.32, saturation: 0.25 })
    .linear(0.85, -8)
    .png({ compressionLevel: 9, quality: 90 })
    .toBuffer();

  const gw = goldMeta.width ?? mW;
  const gh = goldMeta.height ?? mH;

  fs.writeFileSync(
    path.join(brandDir, "nexyyra-logo.svg"),
    buildEmbeddedSvg(goldEmbed, gw, gh, "Nexyyra Events"),
  );
  fs.writeFileSync(
    path.join(brandDir, "nexyyra-logo-dark.svg"),
    buildEmbeddedSvg(goldEmbed, gw, gh, "Nexyyra Events"),
  );
  fs.writeFileSync(
    path.join(brandDir, "nexyyra-logo-light.svg"),
    buildEmbeddedSvg(charcoalEmbed, gw, gh, "Nexyyra Events"),
  );

  // 2. NX monogram — crop the upper emblem, then trim transparent edges.
  const monoCropH = Math.round(mH * 0.56);
  const monogramBuf = await sharp(transparentMaster)
    .extract({ left: 0, top: 0, width: mW, height: monoCropH })
    .trim({ threshold: 8 })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const monoMeta = await sharp(monogramBuf).metadata();
  const monoW = monoMeta.width ?? 512;
  const monoH = monoMeta.height ?? 512;

  const monoEmbed = await sharp(monogramBuf)
    .resize({ width: 512, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const monoEmbedMeta = await sharp(monoEmbed).metadata();
  const monoSvg = buildEmbeddedSvg(
    monoEmbed,
    monoEmbedMeta.width ?? monoW,
    monoEmbedMeta.height ?? monoH,
    "Nexyyra",
  );
  fs.writeFileSync(path.join(brandDir, "nexyyra-monogram.svg"), monoSvg);
  fs.writeFileSync(path.join(publicDir, "favicon.svg"), monoSvg);

  // 3. Square monogram canvas for icons (centered, padded).
  const squareIcon = async (size, pad) => {
    const inner = size - pad * 2;
    const fitted = await sharp(monogramBuf)
      .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    return sharp({
      create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: fitted, gravity: "center" }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  };

  const icons = [
    { name: "apple-touch-icon.png", size: 180, pad: 16 },
    { name: "android-chrome-192.png", size: 192, pad: 12 },
    { name: "android-chrome-512.png", size: 512, pad: 32 },
    { name: "icon-192-maskable.png", size: 192, pad: 30 },
    { name: "icon-512-maskable.png", size: 512, pad: 80 },
  ];
  for (const { name, size, pad } of icons) {
    fs.writeFileSync(path.join(brandDir, name), await squareIcon(size, pad));
  }

  const fav32 = await squareIcon(32, 2);
  const fav16 = await squareIcon(16, 1);
  fs.writeFileSync(path.join(publicDir, "favicon-32.png"), fav32);
  fs.writeFileSync(path.join(publicDir, "favicon-16.png"), fav16);

  try {
    const toIco = (await import("to-ico")).default;
    fs.writeFileSync(path.join(publicDir, "favicon.ico"), await toIco([fav16, fav32]));
  } catch {
    fs.writeFileSync(path.join(publicDir, "favicon.ico"), fav32);
    console.warn("  (to-ico unavailable — favicon.ico written as PNG payload)");
  }

  // 4. OpenGraph / social card — transparent logo on deep luxury background.
  const ogLogo = await sharp(transparentMaster)
    .resize(1040, 540, { fit: "inside", withoutEnlargement: true })
    .toBuffer();
  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: { r: 8, g: 8, b: 10, alpha: 1 } },
  })
    .composite([{ input: ogLogo, gravity: "center" }])
    .png()
    .toFile(path.join(brandDir, "nexyyra-og.png"));

  const svgSize = (n) => (fs.statSync(path.join(brandDir, n)).size / 1024).toFixed(1) + "KB";
  console.log(`✓ Brand assets generated from ${path.basename(rawPath)}`);
  console.log(`  Transparent master: ${mW}×${mH}px`);
  console.log(`  Monogram: ${monoW}×${monoH}px`);
  console.log(`  nexyyra-logo-dark.svg: ${svgSize("nexyyra-logo-dark.svg")}`);
  console.log(`  nexyyra-logo-light.svg: ${svgSize("nexyyra-logo-light.svg")}`);
  console.log(`  nexyyra-monogram.svg: ${svgSize("nexyyra-monogram.svg")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
