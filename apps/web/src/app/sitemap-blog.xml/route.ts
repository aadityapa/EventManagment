import { NextResponse } from "next/server";
import { buildBlogSitemapEntries } from "@/lib/sitemap-entries";
import { renderUrlset, SITEMAP_XML_HEADERS } from "@/lib/sitemap-xml";

export const dynamic = "force-static";

export function GET() {
  const xml = renderUrlset(buildBlogSitemapEntries());
  return new NextResponse(xml, { headers: SITEMAP_XML_HEADERS });
}
