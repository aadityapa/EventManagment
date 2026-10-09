import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { GalleryView, galleryHref } from "@/brand/views/gallery-view";
import { JsonLd } from "@/components/ui";
import { archiveCounts, archivePage, getArchiveAssets, parseArchiveFilter, type ArchiveFilter } from "@/lib/media/query-readonly";
import { collectionPageSchema, generateSEO } from "@/lib/seo";

type SearchParams = { [key: string]: string | string[] | undefined };

type GalleryPageProps = {
  searchParams: Promise<SearchParams>;
};

const DESCRIPTION =
  "The Nexyyra Events archive: photographs from our productions and venue walkthroughs, from wedding décor and reception stages to venue interiors.";

const FILTER_TITLE = { all: "", weddings: "Weddings", venues: "Venues" } as const;

const FILTER_DESCRIPTION: Record<ArchiveFilter, string> = {
  all: DESCRIPTION,
  weddings: "Wedding photographs from the Nexyyra Events archive: décor and reception stages from our productions.",
  venues: "Venue photographs from the Nexyyra Events archive: interiors and spaces from our venue walkthroughs.",
};

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/**
 * Strict `?f=` / `?page=`: a value the page never links to (an unknown filter,
 * a non-numeric or out-of-range page) is a 404, not a quiet fallback. Cached so
 * generateMetadata and the page read the archive once per request.
 */
const resolveGallery = cache(async (f: string | undefined, pageParam: string | undefined) => {
  const filter = parseArchiveFilter(f);
  if (f !== undefined && filter !== f) return null;
  if (pageParam !== undefined && !/^[1-9]\d*$/.test(pageParam)) return null;

  const assets = await getArchiveAssets();
  const result = archivePage(assets, filter, pageParam ? Number(pageParam) : 1);
  if (result.page > result.pageCount) return null;
  return { filter, result, counts: archiveCounts(assets) };
});

/** notFound() runs here, in generateMetadata as well as the page, so a bad URL never gets indexable metadata. */
async function galleryFor(searchParams: Promise<SearchParams>) {
  const sp = await searchParams;
  const gallery = await resolveGallery(first(sp.f), first(sp.page));
  if (!gallery) notFound();
  return gallery;
}

export async function generateMetadata({ searchParams }: GalleryPageProps): Promise<Metadata> {
  const { filter, result } = await galleryFor(searchParams);
  const { page } = result;
  if (galleryHref(filter, page) === "/gallery") {
    return generateSEO({ title: "Gallery", description: DESCRIPTION, path: "/gallery" });
  }

  // Filter and page views re-list photos from /gallery: kept out of the index
  // but followed (so every photo stays reachable), with /gallery as canonical.
  const parts = ["Gallery", FILTER_TITLE[filter], page > 1 ? `Page ${page}` : ""].filter(Boolean);
  return generateSEO({
    title: parts.join(" · "),
    description: page > 1 ? `${FILTER_DESCRIPTION[filter]} Page ${page}.` : FILTER_DESCRIPTION[filter],
    path: galleryHref(filter, page),
    noIndex: true,
    follow: true,
    canonicalPath: "/gallery",
  });
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const { filter, result, counts } = await galleryFor(searchParams);

  return (
    <>
      <JsonLd data={collectionPageSchema({ name: "Gallery: the archive", description: DESCRIPTION, path: "/gallery" })} />
      <GalleryView
        items={result.items}
        filter={filter}
        page={result.page}
        pageCount={result.pageCount}
        total={result.total}
        counts={counts}
      />
    </>
  );
}
