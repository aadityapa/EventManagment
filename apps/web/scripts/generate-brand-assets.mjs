/**
 * Generate Nexyyra brand assets from official master PNG.
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

const MASTER_SRC = path.resolve(
  root,
  "../../.cursor/projects/c-Users-IT-Pune-Desktop-JIJU/assets/c__Users_IT.Pune_AppData_Roaming_Cursor_User_workspaceStorage_c5c439e45f79efa64abcb4bd1608c375_images_OpenAI_Playground_2026-06-24_at_17.25.22-cd9e7ff6-278e-4d8e-bd8d-62796d03a7ab.png",
);

const ALT_SRCS = [
  path.join(brandDir, "nexyyra-logo-source.png"),
  MASTER_SRC,
  path.resolve(
    root,
    "../../.cursor/projects/c-Users-IT-Pune-Desktop-JIJU/assets/c__Users_IT.Pune_AppData_Roaming_Cursor_User_workspaceStorage_c5c439e45f79efa64abcb4bd1608c375_images_OpenAI_Playground_2026-06-24_at_17.25.22-cd9e7ff6-278e-4d8e-bd8d-62796d03a7ab.png",
  ),
];

function resolveMaster() {
  for (const p of ALT_SRCS) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error("Official logo PNG not found. Place master at public/brand/nexyyra-logo-source.png");
}

async function writeSvgEmbed(pngName, svgName, label, viewW, viewH) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="${label}" viewBox="0 0 ${viewW} ${viewH}">
  <title>${label}</title>
  <image href="/brand/${pngName}" width="${viewW}" height="${viewH}" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
  fs.writeFileSync(path.join(brandDir, svgName), svg.trim());
}

async function main() {
  fs.mkdirSync(brandDir, { recursive: true });
  const masterPath = resolveMaster();
  const master = sharp(masterPath);
  const meta = await master.metadata();
  const w = meta.width ?? 1024;
  const h = meta.height ?? 1024;

  const masterPng = path.join(brandDir, "nexyyra-logo.png");
  await master.png({ compressionLevel: 9, quality: 95 }).toFile(masterPng);

  const lightPng = path.join(brandDir, "nexyyra-logo-light.png");
  await sharp(masterPath)
    .modulate({ brightness: 0.42, saturation: 0.15 })
    .png({ compressionLevel: 9 })
    .toFile(lightPng);

  const darkPng = path.join(brandDir, "nexyyra-logo-dark.png");
  await sharp(masterPath).png({ compressionLevel: 9 }).toFile(darkPng);

  const cropH = Math.round(h * 0.42);
  const monogramBuf = await sharp(masterPath)
    .extract({ left: 0, top: 0, width: w, height: cropH })
    .trim()
    .toBuffer();

  const monogramMeta = await sharp(monogramBuf).metadata();
  const monoPng = path.join(brandDir, "nexyyra-monogram.png");
  await sharp(monogramBuf).png({ compressionLevel: 9 }).toFile(monoPng);

  const ogPng = path.join(brandDir, "nexyyra-og.png");
  await sharp(masterPath)
    .resize(1200, 630, { fit: "contain", background: { r: 10, g: 10, b: 10, alpha: 1 } })
    .png()
    .toFile(ogPng);

  await writeSvgEmbed("nexyyra-logo.png", "nexyyra-logo.svg", "Nexyyra Events", w, h);
  await writeSvgEmbed("nexyyra-logo-dark.png", "nexyyra-logo-dark.svg", "Nexyyra Events", w, h);
  await writeSvgEmbed("nexyyra-logo-light.png", "nexyyra-logo-light.svg", "Nexyyra Events", w, h);

  const monoW = monogramMeta.width ?? 512;
  const monoH = monogramMeta.height ?? 512;
  const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="Nexyyra" viewBox="0 0 ${monoW} ${monoH}">
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

  console.log(`✓ Brand assets generated from ${path.basename(masterPath)}`);
  console.log(`  Full logo: ${w}×${h}px`);
  console.log(`  Monogram: ${monoW}×${monoH}px`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
