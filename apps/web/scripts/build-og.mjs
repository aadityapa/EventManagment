/**
 * Build the Open Graph cards (1200×630 PNG) with sharp — no runtime
 * ImageResponse, no font downloads (DESIGN.md §8.7, amended).
 *
 *   npm run brand:og
 *
 * Layout: navy field; left 60% = logo lock-up (the WebP embedded in
 * public/brand/nexyyra-logo-dark.svg), eyebrow in gold caps, title in a serif
 * (Georgia; max two lines), a 1px gold rule and the entity line; right 40% =
 * the page's curated photo at 3:2 with a 1px gold inset frame.
 *
 * Photos come from src/brand/data/image-curation.ts (`og` for the default
 * card, `service-cover-<slug>` per service): the local cover WebP when the
 * curation package has exported it, else the Drive 1200 variant fetched once
 * into NEXYYRA_PHOTO_CACHE (default <os tmp>/nexyyra-og). Outputs:
 *   public/brand/og-default.png
 *   public/brand/og/service-<slug>.png ×12
 * Each ≤ 300 KB — the run fails if one is not.
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { assetForRole, assetsForService, driveUrl } from "../src/brand/data/image-curation";
import { services } from "../src/data/cms";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const BRAND = path.join(PUBLIC, "brand");
const OG_DIR = path.join(BRAND, "og");
const LOGO_SVG = path.join(BRAND, "nexyyra-logo-dark.svg");
const CACHE = process.env.NEXYYRA_PHOTO_CACHE ?? path.join(os.tmpdir(), "nexyyra-og");

// --lux-* tokens (src/styles/tokens.css); fonts are system faces the renderer has.
const NAVY = "#050816";
const GOLD = "#d8b26a";
const WHITE = "#f7f7f7";
const MUTED = "#b6b8c6";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

const W = 1200;
const H = 630;
const LEFT = 72; // text column: 72 → 672
const COL = 600;
const PHOTO = { x: 720, y: 163, w: 456, h: 304 }; // 3:2 inside the right 40%
const FRAME_INSET = 12;
const LOGO_W = 200;
const KB = 1024;
const BUDGET = 300 * KB;
const ENTITY_LINE = "Nexyyra Events · Pune";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/** The gold lock-up lives inside nexyyra-logo-dark.svg as a base64 raster. */
async function logoPng(width) {
  const svg = await fs.readFile(LOGO_SVG, "utf8");
  const m = /href="data:image\/(?:webp|png);base64,([^"]+)"/.exec(svg);
  if (!m) throw new Error("No embedded raster found in nexyyra-logo-dark.svg");
  const buf = await sharp(Buffer.from(m[1], "base64")).resize({ width }).png().toBuffer();
  const meta = await sharp(buf).metadata();
  return { buf, height: meta.height ?? width };
}

/** Local cover export when present, else the Drive 1200 variant (cached). */
async function photoFile(asset) {
  if (asset.local) {
    const local = path.join(PUBLIC, `${asset.local}-1280.webp`);
    try {
      await fs.access(local);
      return local;
    } catch {
      /* not exported yet — fall through to Drive */
    }
  }
  const file = path.join(CACHE, `${asset.id}.jpg`);
  try {
    await fs.access(file);
    return file;
  } catch {
    /* not cached yet */
  }
  await fs.mkdir(CACHE, { recursive: true });
  const res = await fetch(driveUrl(asset.id, 1200));
  if (!res.ok) throw new Error(`Drive fetch failed for ${asset.id}: ${res.status} ${res.statusText}`);
  await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

/** `object-fit: cover` with `object-position: <focal>` — the crop the site shows. */
async function focalCover(file, width, height, focal) {
  const meta = await sharp(file).metadata();
  const swapped = (meta.orientation ?? 1) >= 5;
  const srcW = (swapped ? meta.height : meta.width) ?? width;
  const srcH = (swapped ? meta.width : meta.height) ?? height;
  const scale = Math.max(width / srcW, height / srcH);
  const rw = Math.ceil(srcW * scale);
  const rh = Math.ceil(srcH * scale);
  const left = clamp(Math.round(rw * focal.x - width / 2), 0, rw - width);
  const top = clamp(Math.round(rh * focal.y - height / 2), 0, rh - height);
  return sharp(file).rotate().resize(rw, rh).extract({ left, top, width, height }).png().toBuffer();
}

/** Greedy word wrap on an average-width estimate; shrinks until it fits two lines. */
function wrapTitle(title) {
  for (let size = 64; size >= 40; size -= 4) {
    const fits = (s) => s.length * size * 0.55 <= COL;
    const lines = [];
    let line = "";
    for (const word of title.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (fits(next)) line = next;
      else {
        if (line) lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    if (lines.length <= 2 && lines.every(fits)) return { size, lines };
  }
  return { size: 40, lines: [title] };
}

function textLayer({ eyebrow, title, logoH }) {
  const { size, lines } = wrapTitle(title);
  const lineH = Math.round(size * 1.1);
  const block = logoH + 44 + 60 + (lines.length - 1) * lineH + 30 + 36 + 8;
  const top = Math.round((H - block) / 2);
  const eyebrowY = top + logoH + 44;
  const titleY = eyebrowY + 60;
  const ruleY = titleY + (lines.length - 1) * lineH + 30;
  const entityY = ruleY + 36;
  const titleText = lines
    .map((l, i) => `<text x="${LEFT}" y="${titleY + i * lineH}" font-family="${SERIF}" font-size="${size}" fill="${WHITE}">${esc(l)}</text>`)
    .join("\n  ");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <text x="${LEFT}" y="${eyebrowY}" font-family="${SANS}" font-size="17" font-weight="700" letter-spacing="5" fill="${GOLD}">${esc(eyebrow.toUpperCase())}</text>
  ${titleText}
  <rect x="${LEFT}" y="${ruleY}" width="${COL}" height="1" fill="${GOLD}"/>
  <text x="${LEFT}" y="${entityY}" font-family="${SANS}" font-size="20" fill="${MUTED}">${esc(ENTITY_LINE)}</text>
  <rect x="${PHOTO.x + FRAME_INSET + 0.5}" y="${PHOTO.y + FRAME_INSET + 0.5}" width="${PHOTO.w - FRAME_INSET * 2 - 1}" height="${PHOTO.h - FRAME_INSET * 2 - 1}" fill="none" stroke="${GOLD}" stroke-width="1"/>
</svg>`;
  return { svg: Buffer.from(svg), logoTop: top };
}

/** Palette PNG, shrinking the palette until the file fits the budget. */
async function pngUnder(pipeline, maxBytes) {
  let buffer = Buffer.alloc(0);
  for (let colours = 256; colours >= 64; colours -= 32) {
    buffer = await pipeline.clone().png({ palette: true, colours, dither: 0.9, compressionLevel: 9, effort: 10 }).toBuffer();
    if (buffer.length <= maxBytes) break;
  }
  return buffer;
}

async function buildCard({ out, eyebrow, title, asset, logo }) {
  const photo = await focalCover(await photoFile(asset), PHOTO.w, PHOTO.h, asset.focal);
  const { svg, logoTop } = textLayer({ eyebrow, title, logoH: logo.height });
  const card = sharp({ create: { width: W, height: H, channels: 3, background: NAVY } }).composite([
    { input: photo, left: PHOTO.x, top: PHOTO.y },
    { input: logo.buf, left: LEFT, top: logoTop },
    { input: svg, left: 0, top: 0 },
  ]);
  const buffer = await pngUnder(card, BUDGET);
  await fs.writeFile(out, buffer);
  const kb = buffer.length / KB;
  const ok = buffer.length <= BUDGET;
  console.log(`${ok ? "✓" : "✗"} ${path.relative(ROOT, out)}  ${kb.toFixed(0)} KB  photo ${asset.id}`);
  return ok;
}

/** The curated cover for a service, with honest fallbacks for services without photography. */
function serviceAsset(slug) {
  return (
    assetForRole(`service-cover-${slug}`) ??
    assetsForService(slug).find((a) => a.people !== "close") ??
    assetForRole("cover-services")
  );
}

async function main() {
  await fs.mkdir(OG_DIR, { recursive: true });
  const logo = await logoPng(LOGO_W);
  const results = [];

  const defaultAsset = assetForRole("og") ?? assetForRole("cover-home");
  if (!defaultAsset) throw new Error("image-curation: no asset carries the `og` or `cover-home` role");
  results.push(
    await buildCard({
      out: path.join(BRAND, "og-default.png"),
      eyebrow: "Creating Experiences That Last Forever",
      title: "Luxury Weddings & Corporate Events",
      asset: defaultAsset,
      logo,
    }),
  );

  for (const service of services) {
    const asset = serviceAsset(service.slug);
    if (!asset) throw new Error(`image-curation: no photo resolves for ${service.slug}`);
    results.push(
      await buildCard({
        out: path.join(OG_DIR, `service-${service.slug}.png`),
        eyebrow: "Services",
        title: service.title,
        asset,
        logo,
      }),
    );
  }

  const over = results.filter((ok) => !ok).length;
  if (over) throw new Error(`${over} card(s) exceed ${BUDGET / KB} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
