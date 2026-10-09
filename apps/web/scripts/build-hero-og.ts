/**
 * Build the local LCP hero posters and the Open Graph cards from the two
 * curated Drive photos named in src/brand/data/image-curation.ts
 * (HERO_POSTER_ID, OG_IMAGE_ID). Change the ID there, re-run, commit.
 *
 *   npm run brand:hero-og
 *
 * Source JPEGs are fetched once at original size into a cache directory
 * (NEXYYRA_PHOTO_CACHE, default <os tmp>/nexyyra-photos) so re-runs are
 * offline. Outputs:
 *   public/images/hero/hero-poster.webp         1920×1080, ≤ 230 KB
 *   public/images/hero/hero-poster-mobile.webp  1080×1350, ≤ 120 KB
 *   public/brand/nexyyra-og.png                 1200×630,  ≤ 350 KB
 *   public/brand/nexyyra-og-square.png          1200×1200
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import {
  HERO_POSTER_ID,
  OG_IMAGE_ID,
  curationFor,
  driveOriginalUrl,
} from "../src/brand/data/image-curation";

const ROOT = process.cwd();
const CACHE_DIR = process.env.NEXYYRA_PHOTO_CACHE ?? path.join(os.tmpdir(), "nexyyra-photos");
const HERO_DIR = path.join(ROOT, "public", "images", "hero");
const BRAND_DIR = path.join(ROOT, "public", "brand");
const LOGO_SVG = path.join(BRAND_DIR, "nexyyra-logo-dark.svg");

// Brand tokens (mirrors --lux-* in src/styles/luxury-redesign.css).
const NAVY = "#050816";
const GOLD = "#d8b26a";
const WHITE = "#f7f7f7";
const MUTED = "#b6b8c6";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

const KB = 1024;

async function fetchOriginal(id: string): Promise<string> {
  const file = path.join(CACHE_DIR, `${id}.jpg`);
  try {
    await fs.access(file);
    return file;
  } catch {
    /* not cached yet */
  }
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const res = await fetch(driveOriginalUrl(id));
  if (!res.ok) throw new Error(`Drive fetch failed for ${id}: ${res.status} ${res.statusText}`);
  await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

function parseFocal(focal: string): { x: number; y: number } {
  const m = /([\d.]+)%\s+([\d.]+)%/.exec(focal);
  return m ? { x: Number(m[1]) / 100, y: Number(m[2]) / 100 } : { x: 0.5, y: 0.5 };
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** `object-fit: cover` with `object-position: <focal>` — the crop the site shows. */
async function focalCover(file: string, width: number, height: number, focal: string) {
  const meta = await sharp(file).metadata();
  const swapped = (meta.orientation ?? 1) >= 5;
  const srcW = (swapped ? meta.height : meta.width) ?? width;
  const srcH = (swapped ? meta.width : meta.height) ?? height;

  const scale = Math.max(width / srcW, height / srcH);
  const rw = Math.ceil(srcW * scale);
  const rh = Math.ceil(srcH * scale);
  const { x, y } = parseFocal(focal);
  const left = clamp(Math.round(rw * x - width / 2), 0, rw - width);
  const top = clamp(Math.round(rh * y - height / 2), 0, rh - height);

  return sharp(file).rotate().resize(rw, rh).extract({ left, top, width, height });
}

/** Lower WebP quality in steps until the file fits the budget. */
async function webpUnder(pipeline: sharp.Sharp, maxBytes: number, startQuality: number) {
  let buffer: Buffer = Buffer.alloc(0);
  let quality = startQuality;
  for (; quality >= 40; quality -= 4) {
    buffer = await pipeline.clone().webp({ quality, effort: 6, smartSubsample: true }).toBuffer();
    if (buffer.length <= maxBytes) break;
  }
  return { buffer, quality };
}

/** Palette PNG, shrinking the palette until the file fits the budget. */
async function pngUnder(pipeline: sharp.Sharp, maxBytes: number) {
  let buffer: Buffer = Buffer.alloc(0);
  let colours = 256;
  for (; colours >= 64; colours -= 32) {
    buffer = await pipeline
      .clone()
      .png({ palette: true, colours, dither: 0.9, compressionLevel: 9, effort: 10 })
      .toBuffer();
    if (buffer.length <= maxBytes) break;
  }
  return { buffer, colours };
}

/** The gold logo lives inside nexyyra-logo-dark.svg as a base64 raster. */
async function logoPng(width: number): Promise<Buffer> {
  const svg = await fs.readFile(LOGO_SVG, "utf8");
  const m = /href="data:image\/(?:webp|png);base64,([^"]+)"/.exec(svg);
  if (!m) throw new Error("No embedded raster found in nexyyra-logo-dark.svg");
  return sharp(Buffer.from(m[1], "base64")).resize({ width }).png().toBuffer();
}

const esc = (s: string) => s.replace(/&/g, "&amp;");

function overlaySvg(opts: {
  w: number;
  h: number;
  title: string;
  subtitle: string;
  url: string;
  titleY: number;
  titleSize: number;
  subSize: number;
  vertical: boolean;
}) {
  const { w, h, title, subtitle, url, titleY, titleSize, subSize, vertical } = opts;
  const x = Math.round(w * 0.06);
  const gradient = vertical
    ? `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0" stop-color="${NAVY}" stop-opacity="0.35"/>
         <stop offset="0.45" stop-color="${NAVY}" stop-opacity="0.55"/>
         <stop offset="1" stop-color="${NAVY}" stop-opacity="0.97"/>
       </linearGradient>`
    : `<linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0" stop-color="${NAVY}" stop-opacity="0.97"/>
         <stop offset="0.5" stop-color="${NAVY}" stop-opacity="0.8"/>
         <stop offset="1" stop-color="${NAVY}" stop-opacity="0.25"/>
       </linearGradient>`;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    ${gradient}
    <linearGradient id="foot" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.6" stop-color="${NAVY}" stop-opacity="0"/>
      <stop offset="1" stop-color="${NAVY}" stop-opacity="0.8"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#foot)"/>
  <rect x="24" y="24" width="${w - 48}" height="${h - 48}" fill="none" stroke="${GOLD}" stroke-opacity="0.35" stroke-width="1.5"/>
  <rect x="${x}" y="${titleY - titleSize - 24}" width="64" height="3" fill="${GOLD}"/>
  <text x="${x}" y="${titleY}" font-family="${SERIF}" font-size="${titleSize}" fill="${WHITE}">${esc(title)}</text>
  <text x="${x}" y="${titleY + subSize * 1.75}" font-family="${SERIF}" font-size="${subSize}" fill="${GOLD}">${esc(subtitle)}</text>
  <text x="${x}" y="${titleY + subSize * 1.75 + 62}" font-family="${SANS}" font-size="20" letter-spacing="4" fill="${MUTED}">${esc(url)}</text>
</svg>`);
}

async function buildHeroPosters() {
  const entry = curationFor(HERO_POSTER_ID);
  if (!entry) throw new Error(`HERO_POSTER_ID ${HERO_POSTER_ID} has no curation entry`);
  const file = await fetchOriginal(HERO_POSTER_ID);
  await fs.mkdir(HERO_DIR, { recursive: true });

  const desktop = await webpUnder(await focalCover(file, 1920, 1080, entry.focal), 230 * KB, 72);
  const desktopPath = path.join(HERO_DIR, "hero-poster.webp");
  await fs.writeFile(desktopPath, desktop.buffer);
  console.log(
    `✓ hero-poster.webp 1920×1080 q${desktop.quality} ${(desktop.buffer.length / KB).toFixed(0)} KB`
  );

  const mobile = await webpUnder(await focalCover(file, 1080, 1350, entry.focal), 120 * KB, 70);
  const mobilePath = path.join(HERO_DIR, "hero-poster-mobile.webp");
  await fs.writeFile(mobilePath, mobile.buffer);
  console.log(
    `✓ hero-poster-mobile.webp 1080×1350 q${mobile.quality} ${(mobile.buffer.length / KB).toFixed(0)} KB`
  );
}

async function buildOgCards() {
  const entry = curationFor(OG_IMAGE_ID);
  if (!entry) throw new Error(`OG_IMAGE_ID ${OG_IMAGE_ID} has no curation entry`);
  const file = await fetchOriginal(OG_IMAGE_ID);
  const title = "Nexyyra Events";
  const subtitle = "Luxury Weddings & Corporate Events — Pune, India";
  const url = "WWW.NEXYYRA.COM";

  const landscape = (await focalCover(file, 1200, 630, entry.focal)).composite([
    {
      input: overlaySvg({
        w: 1200,
        h: 630,
        title,
        subtitle,
        url,
        titleY: 452,
        titleSize: 64,
        subSize: 28,
        vertical: false,
      }),
    },
    { input: await logoPng(220), left: 72, top: 56 },
  ]);
  const og = await pngUnder(landscape, 350 * KB);
  await fs.writeFile(path.join(BRAND_DIR, "nexyyra-og.png"), og.buffer);
  console.log(
    `✓ nexyyra-og.png 1200×630 ${og.colours} colours ${(og.buffer.length / KB).toFixed(0)} KB`
  );

  const square = (await focalCover(file, 1200, 1200, entry.focal)).composite([
    {
      input: overlaySvg({
        w: 1200,
        h: 1200,
        title,
        subtitle,
        url,
        titleY: 1000,
        titleSize: 76,
        subSize: 32,
        vertical: true,
      }),
    },
    { input: await logoPng(240), left: 72, top: 64 },
  ]);
  const sq = await pngUnder(square, 500 * KB);
  await fs.writeFile(path.join(BRAND_DIR, "nexyyra-og-square.png"), sq.buffer);
  console.log(
    `✓ nexyyra-og-square.png 1200×1200 ${sq.colours} colours ${(sq.buffer.length / KB).toFixed(0)} KB`
  );
}

async function main() {
  await buildHeroPosters();
  await buildOgCards();
}

main().catch((err: Error) => {
  console.error(err);
  process.exit(1);
});
