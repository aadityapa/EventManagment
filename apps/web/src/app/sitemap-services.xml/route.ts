import { NextResponse } from "next/server";
import { buildServicesSitemapEntries } from "@/lib/sitemap-entries";
import { renderUrlset, SITEMAP_XML_HEADERS } from "@/lib/sitemap-xml";

export function GET() {
  const xml = renderUrlset(buildServicesSitemapEntries());
  return new NextResponse(xml, { headers: SITEMAP_XML_HEADERS });
}
