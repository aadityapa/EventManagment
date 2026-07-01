import type { ChangeFrequency } from "./sitemap-lastmod";

export type SitemapEntry = {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: ChangeFrequency;
  priority?: number;
  images?: string[];
};

export const SITEMAP_XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
} as const;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function formatLastMod(date: Date | string | undefined): string | undefined {
  if (!date) return undefined;
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

export function renderUrlset(entries: SitemapEntry[], includeImages = false): string {
  const xmlns = includeImages
    ? 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

  const urls = entries
    .map((entry) => {
      const parts = [`  <url>`, `    <loc>${escapeXml(entry.url)}</loc>`];
      const lastmod = formatLastMod(entry.lastModified);
      if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
      if (entry.changeFrequency) parts.push(`    <changefreq>${entry.changeFrequency}</changefreq>`);
      if (entry.priority !== undefined) parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
      if (includeImages && entry.images?.length) {
        for (const image of entry.images) {
          parts.push(`    <image:image>`, `      <image:loc>${escapeXml(image)}</image:loc>`, `    </image:image>`);
        }
      }
      parts.push(`  </url>`);
      return parts.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${xmlns}>\n${urls}\n</urlset>`;
}

export function renderSitemapIndex(sitemaps: { loc: string; lastmod?: string }[]): string {
  const items = sitemaps
    .map((item) => {
      const parts = [`  <sitemap>`, `    <loc>${escapeXml(item.loc)}</loc>`];
      if (item.lastmod) parts.push(`    <lastmod>${item.lastmod}</lastmod>`);
      parts.push(`  </sitemap>`);
      return parts.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>`;
}

export function maxLastMod(entries: SitemapEntry[]): string | undefined {
  let latest: Date | undefined;
  for (const entry of entries) {
    if (!entry.lastModified) continue;
    const parsed = entry.lastModified instanceof Date ? entry.lastModified : new Date(entry.lastModified);
    if (Number.isNaN(parsed.getTime())) continue;
    if (!latest || parsed > latest) latest = parsed;
  }
  return latest?.toISOString();
}
