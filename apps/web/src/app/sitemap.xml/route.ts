import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";
import { SITEMAP_CHILDREN } from "@/lib/sitemap-entries";
import { maxLastMod, renderSitemapIndex, SITEMAP_XML_HEADERS } from "@/lib/sitemap-xml";

export function GET() {
  const sitemaps = SITEMAP_CHILDREN.map((child) => ({
    loc: `${SITE_CONFIG.url}${child.path}`,
    lastmod: maxLastMod(child.build()),
  }));

  const xml = renderSitemapIndex(
    sitemaps.map((s) => ({
      loc: s.loc,
      ...(s.lastmod ? { lastmod: s.lastmod } : {}),
    })),
  );

  return new NextResponse(xml, { headers: SITEMAP_XML_HEADERS });
}
