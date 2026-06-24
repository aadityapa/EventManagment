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
  "#venues": "/venues",
  "#vendors": "/vendors",
};

function sanitizeStitchHtml(html: string): string {
  let out = html;

  out = out.replace(
    /(<img[^>]*alt="[^"]*logo[^"]*"[^>]*src=")[^"]*(")/gi,
    '$1/brand/nexyyra-logo-dark.png$2'
  );

  out = out.replace(/<canvas[^>]*id="particleCanvas"[^>]*><\/canvas>/gi, "");
  out = out.replace(/<canvas[^>]*class="[^"]*particle-canvas[^"]*"[^>]*><\/canvas>/gi, "");

  out = out.replace(
    /<a[^>]*aria-label="WhatsApp[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
    ""
  );

  out = out.replace(
    /class="[^"]*\bfixed\b[^"]*\bbottom-[^"]*"[^"]*"/gi,
    (match) => match.replace(/\bfixed\b/g, "").replace(/\s+/g, " ")
  );

  out = out.replace(/opacity-30/g, "opacity-50");
  out = out.replace(
    /from-bg-primary\/80 via-bg-primary\/90 to-bg-primary/g,
    "from-[#faf8f5]/50 via-[#faf8f5]/70 to-[#faf8f5]"
  );
  out = out.replace(
    /from-bg-primary\/80 via-bg-primary\/90 to-bg-primary/gi,
    "from-[#faf8f5]/50 via-[#faf8f5]/70 to-[#faf8f5]"
  );

  out = out.replace(/text-text-primary/g, "text-[#1c1814]");
  out = out.replace(/text-on-surface-variant/g, "text-[#5a5248]");

  out = out.replace(/w-32 h-32/g, "w-24 h-24 sm:w-28 sm:h-28");

  out = out.replace(
    /\.gallery-item\s*\{[^}]*opacity:\s*0[^}]*\}/gi,
    ".gallery-item { opacity: 1; transform: none; }"
  );

  out = out.replace(/class="gallery-item group"/g, 'class="gallery-item group visible"');

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

  const html = sanitizeStitchHtml(fs.readFileSync(htmlPath, "utf8"));
  const meta = fs.existsSync(metaPath)
    ? (JSON.parse(fs.readFileSync(metaPath, "utf8")) as StitchScreenMeta)
    : null;

  return { html, meta };
}

export function hasStitchScreen(name: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "src/lib/stitch/exports", `${name}.html`));
}
