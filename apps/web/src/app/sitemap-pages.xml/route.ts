import { NextResponse } from "next/server";
import { buildPagesSitemapEntries } from "@/lib/sitemap-entries";
import { renderUrlset, SITEMAP_XML_HEADERS } from "@/lib/sitemap-xml";

export const dynamic = "force-static";

export function GET() {
  const xml = renderUrlset(buildPagesSitemapEntries());
  return new NextResponse(xml, { headers: SITEMAP_XML_HEADERS });
}
