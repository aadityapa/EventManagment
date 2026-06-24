/**
 * Generate Nexyyra brand assets from official master PNGs.
 * Strips checkerboard / flat backgrounds, embeds cleaned rasters in SVG.
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

const TRANSPARENT_SRCS = [
  path.join(brandDir, "nexyyra-logo-source.png"),
  path.resolve(root, "../../OpenAI Playground 2026-06-24 at 17.25.22.png"),
  path.resolve(
    root,
    "../../.cursor/projects/c-Users-IT-Pune-Desktop-JIJU/assets/c__Users_IT_Pune_Desktop_JIJU_OpenAI_Playground_2026-06-24_at_17.25.22.png",
  ),
];

const DARK_SRCS = [
  path.join(brandDir, "nexyyra-logo-dark-source.png"),
  path.resolve(root, "../../OpenAI Playground 2026-06-24 at 16.51.33.png"),
  path.resolve(
    root,
    "../../.cursor/projects/c-Users-IT-Pune-Desktop-JIJU/assets/c__Users_IT_Pune_Desktop_JIJU_OpenAI_Playground_2026-06-24_at_16.51.33.png",
  ),
];

function resolveFirst(paths, label) {
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error(`${label} not found. Place master at public/brand/`);
}

/** Detect checkerboard / flat studio backgrounds and set alpha=0 */
function stripCheckerboard(data, info) {
  const { channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;

    if (sat > 18) continue;

    const isWhite = r >= 248 && g >= 248 && b >= 248;
    const isLightGray = r >= 176 && r <= 208 && g >= 176 && g <= 208 && b >= 176 && b <= 208;
    const isMidGray = r >= 112 && r <= 144 && g >= 112 && g <= 144 && b >= 112 && b <= 144;

    if (isWhite || isLightGray || isMidGray) {
      data[i + 3] = 0;
    }
  }
}

/** Remove near-black studio backdrops from dark-bg master */
function stripDarkBackground(data, info) {
  const { channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (lum < 28) {
      data[i + 3] = 0;
      continue;
    }

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max - min < 12 && lum < 55) {
      data[i + 3] = 0;
    }
  }
}

async function cleanRaster(inputPath, mode) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const buf = Buffer.from(data);
  if (mode === "checkerboard") stripCheckerboard(buf, info);
  else if (mode === "dark-bg") stripDarkBackground(buf, info);

  return sharp(buf, { raw: info }).png({ compressionLevel: 9 }).toBuffer();
}

function writeEmbeddedSvg(outPath, label, pngBuf, w, h) {
  const b64 = pngBuf.toString("base64");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" viewBox="0 0 ${w} ${h}">
  <title>${label}</title>
  <image href="data:image/png;base64,${b64}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
  fs.writeFileSync(outPath, svg.trim());
}

async function main() {
  fs.mkdirSync(brandDir, { recursive: true });

  const transparentPath = resolveFirst(TRANSPARENT_SRCS, "Transparent logo master");
  const darkPath = resolveFirst(DARK_SRCS, "Dark-background logo master");

  fs.copyFileSync(transparentPath, path.join(brandDir, "nexyyra-logo-source.png"));
  fs.copyFileSync(darkPath, path.join(brandDir, "nexyyra-logo-dark-source.png"));

  const transparentClean = await cleanRaster(transparentPath, "checkerboard");
  const darkClean = await cleanRaster(darkPath, "dark-bg");

  const meta = await sharp(transparentClean).metadata();
  const w = meta.width ?? 1024;
  const h = meta.height ?? 1024;

  const darkMeta = await sharp(darkClean).metadata();
  const dw = darkMeta.width ?? w;
  const dh = darkMeta.height ?? h;

  const lightClean = await sharp(transparentClean)
    .modulate({ brightness: 0.38, saturation: 0.12 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  writeEmbeddedSvg(path.join(brandDir, "nexyyra-logo.svg"), "Nexyyra Events", transparentClean, w, h);
  writeEmbeddedSvg(path.join(brandDir, "nexyyra-logo-dark.svg"), "Nexyyra Events", darkClean, dw, dh);
  writeEmbeddedSvg(path.join(brandDir, "nexyyra-logo-light.svg"), "Nexyyra Events", lightClean, w, h);

  const cropH = Math.round(h * 0.42);
  const monogramBuf = await sharp(transparentClean)
    .extract({ left: 0, top: 0, width: w, height: cropH })
    .trim()
    .toBuffer();

  const monogramMeta = await sharp(monogramBuf).metadata();
  const monoW = monogramMeta.width ?? 512;
  const monoH = monogramMeta.height ?? 512;

  const monoPng = path.join(brandDir, "nexyyra-monogram.png");
  await sharp(monogramBuf).png({ compressionLevel: 9 }).toFile(monoPng);

  const ogPng = path.join(brandDir, "nexyyra-og.png");
  await sharp(darkClean)
    .resize(1200, 630, { fit: "contain", background: { r: 10, g: 10, b: 10, alpha: 1 } })
    .png()
    .toFile(ogPng);

  const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Nexyyra" viewBox="0 0 ${monoW} ${monoH}">
  <title>Nexyyra</title>
  <image href="/brand/nexyyra-monogram.png" width="${monoW}" height="${monoH}"/>
</svg>`;
  fs.writeFileSync(path.join(publicDir, "favicon.svg"), faviconSvg.trim());
  fs.writeFileSync(path.join(brandDir, "nexyyra-monogram.svg"), faviconSvg.trim());

  const iconSizes = [
    { name: "apple-touch-icon.png", size: 180 },
    { name: "android-chrome-192.png", size: 192 },
    { name: "android-chrome-512.png", size: 512 },
    { name: "icon-192-maskable.png", size: 192 },
    { name: "icon-512-maskable.png", size: 512 },
  ];

  for (const { name, size } of iconSizes) {
    await sharp(monogramBuf)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(brandDir, name));
  }

  await sharp(monogramBuf)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, "favicon-32.png"));

  await sharp(monogramBuf)
    .resize(16, 16, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, "favicon-16.png"));

  const favicon16 = await fs.promises.readFile(path.join(publicDir, "favicon-16.png"));
  const favicon32 = await fs.promises.readFile(path.join(publicDir, "favicon-32.png"));
  try {
    const toIco = (await import("to-ico")).default;
    const ico = await toIco([favicon16, favicon32]);
    fs.writeFileSync(path.join(publicDir, "favicon.ico"), ico);
  } catch {
    fs.copyFileSync(path.join(publicDir, "favicon-32.png"), path.join(publicDir, "favicon.ico"));
    console.warn("  (to-ico unavailable — favicon.ico copied from favicon-32.png)");
  }

  for (const legacy of [
    "nexyyra-logo.png",
    "nexyyra-logo-dark.png",
    "nexyyra-logo-light.png",
  ]) {
    const p = path.join(brandDir, legacy);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  console.log(`✓ Brand assets generated`);
  console.log(`  Transparent master: ${path.basename(transparentPath)} (${w}×${h})`);
  console.log(`  Dark master: ${path.basename(darkPath)} (${dw}×${dh})`);
  console.log(`  Monogram: ${monoW}×${monoH}px`);
  console.log(`  SVG logos: embedded base64 (no external PNG deps)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
