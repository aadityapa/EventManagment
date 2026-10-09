import type { CurationAsset } from "@/brand/data/image-curation";
import { Cover, Gallery, InquiryPanel, Pagination, Section, Tabs } from "@/components/ui";
import { ARCHIVE_FILTERS, type ArchiveFilter } from "@/lib/media/query-readonly";

type GalleryViewProps = {
  /** This page's tiles, already filtered, paginated and packed. */
  items: CurationAsset[];
  filter: ArchiveFilter;
  page: number;
  pageCount: number;
  /** Photographs in the current filter, across all pages. */
  total: number;
  counts: Record<ArchiveFilter, number>;
};

const CHAPTER_TITLE: Record<ArchiveFilter, string> = {
  all: "Every photograph",
  weddings: "Weddings and décor",
  venues: "Venues",
};

/** Crawlable filter + page links: `/gallery`, `/gallery?f=venues`, `/gallery?f=venues&page=2`. */
export function galleryHref(filter: ArchiveFilter, page = 1): string {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("f", filter);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/gallery?${query}` : "/gallery";
}

export function GalleryView({ items, filter, page, pageCount, total, counts }: GalleryViewProps) {
  const pageNote = pageCount > 1 ? `, page ${page} of ${pageCount}` : "";
  return (
    <div className="lux-page">
      <Cover
        size="text"
        eyebrow="Gallery"
        title="The archive"
        lead="Photographs from Nexyyra productions and venue walkthroughs."
        primary={{ href: "#inquire", cta: "gallery_cover_proposal" }}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Gallery", href: "/gallery" },
        ]}
      />

      <Section
        id="photographs"
        number="01"
        eyebrow="Photographs"
        title={CHAPTER_TITLE[filter]}
        lead={`${total} photographs${pageNote}. Select any frame to view it full screen.`}
      >
        <div className="pg-gallery-body">
          <Tabs
            ariaLabel="Filter photographs"
            current={galleryHref(filter)}
            items={ARCHIVE_FILTERS.map((f) => ({ href: galleryHref(f.value), label: f.label, count: counts[f.value] }))}
          />
          <Gallery assets={items} />
          <Pagination page={page} pageCount={pageCount} hrefFor={(p) => galleryHref(filter, p)} ariaLabel="Gallery pages" />
        </div>
      </Section>

      <InquiryPanel source="contact" variant="compact" className="pg-portfolio-inquiry" />
    </div>
  );
}
