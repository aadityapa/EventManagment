/**
 * Generate Nexyyra Events brand assets from the official master logo.
 *
 * Source: scripts/assets/nexyyra-logo-raw.png (official upload — transparent or black bg).
 * Outputs favicons, PWA icons, self-contained transparent SVGs, OG/Twitter cards,
 * and safari-pinned-tab.svg.
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

const RAW_CANDIDATES = [
  path.join(srcDir, "nexyyra-logo-raw.png"),
  path.resolve(root, "../../nexyyra without background (1).png"),
  path.resolve(root, "../../ChatGPT Image Jun 24, 2026, 07_44_08 PM.png"),
];

function resolveRaw() {
  for (const p of RAW_CANDIDATES) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error("Raw master not found. Place it at scripts/assets/nexyyra-logo-raw.png");
}

/** Luminance key — turns pure-black background transparent, keeps the logo. */
async function removeBlackBackground(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.from(data);
  const LOW = 10;
  const HIGH = 72;

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

/** Transparent master — skip keying when source already has meaningful alpha. */
async function toTransparentMaster(inputPath) {
  const meta = await sharp(inputPath).metadata();
  if (meta.hasAlpha) {
    const stats = await sharp(inputPath).ensureAlpha().stats();
    const alpha = stats.channels[3];
    const hasTransparency = alpha.min < 250;
    if (hasTransparency) {
      return sharp(inputPath).trim({ threshold: 8 }).png({ compressionLevel: 9 });
    }
  }
  return removeBlackBackground(inputPath).then((s) => s.trim({ threshold: 8 }).png({ compressionLevel: 9 }));
}

function buildEmbeddedSvg(pngBuffer, w, h, label) {
  const b64 = pngBuffer.toString("base64");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><title>${label}</title><image width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${b64}"/></svg>`;
}

/** Safari pinned tab — single-color silhouette (Safari tints via theme-color). */
function buildSafariPinnedTab(monoW, monoH) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${monoW} ${monoH}"><path fill="#000" d="M${monoW * 0.12} ${monoH * 0.08}h${monoW * 0.76}v${monoH * 0.12}H${monoW * 0.52}v${monoH * 0.8}H${monoW * 0.32}V${monoH * 0.2}H${monoW * 0.12}V${monoH * 0.08}zm${monoW * 0.08} ${monoH * 0.02}c${monoW * 0.06} 0 ${monoW * 0.1}-${monoW * 0.04} ${monoW * 0.1}-${monoW * 0.1}s-${monoW * 0.04}-${monoW * 0.1}-${monoW * 0.1}-${monoW * 0.1}-${monoW * 0.1} ${monoW * 0.04}-${monoW * 0.1} ${monoW * 0.1} ${monoW * 0.04} ${monoW * 0.1} ${monoW * 0.1} ${monoW * 0.1}z"/></svg>`;
}

async function main() {
  fs.mkdirSync(brandDir, { recursive: true });
  const rawPath = resolveRaw();

  const transparentMaster = await toTransparentMaster(rawPath);
  const masterBuf = await transparentMaster.toBuffer();
  const masterMeta = await sharp(masterBuf).metadata();
  const mW = masterMeta.width ?? 1024;
  const mH = masterMeta.height ?? 1024;

  const EMBED_MAX = 720;
  const goldEmbed = await sharp(masterBuf)
    .resize({ width: EMBED_MAX, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 90 })
    .toBuffer();
  const goldMeta = await sharp(goldEmbed).metadata();
  const gw = goldMeta.width ?? mW;
  const gh = goldMeta.height ?? mH;

  const goldSvg = buildEmbeddedSvg(goldEmbed, gw, gh, "Nexyyra Events");
  fs.writeFileSync(path.join(brandDir, "nexyyra-logo.svg"), goldSvg);
  fs.writeFileSync(path.join(brandDir, "nexyyra-logo-dark.svg"), goldSvg);

  const monoCropH = Math.round(mH * 0.56);
  const monogramBuf = await sharp(masterBuf)
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
  fs.writeFileSync(path.join(publicDir, "safari-pinned-tab.svg"), buildSafariPinnedTab(512, 512));

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
  fs.writeFileSync(path.join(publicDir, "favicon-32x32.png"), fav32);
  fs.writeFileSync(path.join(publicDir, "favicon-16x16.png"), fav16);
  fs.writeFileSync(path.join(publicDir, "favicon-32.png"), fav32);
  fs.writeFileSync(path.join(publicDir, "favicon-16.png"), fav16);

  try {
    const toIco = (await import("to-ico")).default;
    fs.writeFileSync(path.join(publicDir, "favicon.ico"), await toIco([fav16, fav32]));
  } catch {
    fs.writeFileSync(path.join(publicDir, "favicon.ico"), fav32);
    console.warn("  (to-ico unavailable — favicon.ico written as PNG payload)");
  }

  const ogLogo = await sharp(masterBuf)
    .resize(1040, 540, { fit: "inside", withoutEnlargement: true })
    .toBuffer();
  const ogCard = sharp({
    create: { width: 1200, height: 630, channels: 4, background: { r: 8, g: 8, b: 10, alpha: 1 } },
  }).composite([{ input: ogLogo, gravity: "center" }]);

  await ogCard.png().toFile(path.join(brandDir, "nexyyra-og.png"));
  await ogCard.png().toFile(path.join(brandDir, "nexyyra-twitter.png"));

  const lightPath = path.join(brandDir, "nexyyra-logo-light.svg");
  if (fs.existsSync(lightPath)) fs.unlinkSync(lightPath);

  const svgSize = (n) => (fs.statSync(path.join(brandDir, n)).size / 1024).toFixed(1) + "KB";
  console.log(`✓ Brand assets generated from ${path.basename(rawPath)}`);
  console.log(`  Transparent master: ${mW}×${mH}px`);
  console.log(`  Monogram: ${monoW}×${monoH}px`);
  console.log(`  nexyyra-logo-dark.svg: ${svgSize("nexyyra-logo-dark.svg")}`);
  console.log(`  nexyyra-monogram.svg: ${svgSize("nexyyra-monogram.svg")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
