import { NextResponse } from "next/server";
import { buildVenuesSitemapEntries } from "@/lib/sitemap-entries";
import { renderUrlset, SITEMAP_XML_HEADERS } from "@/lib/sitemap-xml";

export const dynamic = "force-static";

export function GET() {
  const xml = renderUrlset(buildVenuesSitemapEntries());
  return new NextResponse(xml, { headers: SITEMAP_XML_HEADERS });
}
