import fs from "fs";
import path from "path";

export type StitchScreenMeta = {
  projectId: string;
  screenId: string;
};

const ROUTE_MAP: Record<string, string> = {
  "#": "/",
  "#home": "/",
  "#services": "/services",
  "#portfolio": "/portfolio",
  "#testimonials": "/testimonials",
  "#contact": "/contact",
  "#about": "/about",
  "#pricing": "/pricing",
  "#gallery": "/gallery",
  "#faqs": "/faqs",
  "#blog": "/blog",
};

function normalizeStitchHtml(html: string): string {
  let out = html;

  out = out.replace(
    /(<img[^>]*alt="[^"]*logo[^"]*"[^>]*src=")[^"]*(")/gi,
    '$1/logo.jpg$2'
  );

  out = out.replace(/\bpx-24\b/g, "px-6 md:px-12 lg:px-24");
  out = out.replace(/\bpy-64\b/g, "py-16 md:py-32 lg:py-64");
  out = out.replace(/\bpy-32\b/g, "py-16 md:py-24 lg:py-32");

  for (const [hash, route] of Object.entries(ROUTE_MAP)) {
    out = out.replace(new RegExp(`href="${hash}"`, "gi"), `href="${route}"`);
  }

  out = out.replace(/href="\/privacy-policy"/gi, 'href="/privacy"');
  out = out.replace(/href="\/terms-of-service"/gi, 'href="/terms"');
  out = out.replace(/href="\/book"/gi, 'href="/book-event"');

  return out;
}

export function loadStitchScreen(name: string): { html: string; meta: StitchScreenMeta | null } {
  const base = path.join(process.cwd(), "src/lib/stitch/exports");
  const htmlPath = path.join(base, `${name}.html`);
  const metaPath = path.join(base, `${name}.meta.json`);

  if (!fs.existsSync(htmlPath)) {
    return { html: "", meta: null };
  }

  const html = normalizeStitchHtml(fs.readFileSync(htmlPath, "utf8"));
  const meta = fs.existsSync(metaPath)
    ? (JSON.parse(fs.readFileSync(metaPath, "utf8")) as StitchScreenMeta)
    : null;

  return { html, meta };
}

export function hasStitchScreen(name: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "src/lib/stitch/exports", `${name}.html`));
}
