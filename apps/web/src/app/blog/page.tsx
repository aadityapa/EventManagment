import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogView, blogListingHref, resolveBlogListing } from "@/brand/views/blog-view";
import { JsonLd } from "@/components/ui";
import { collectionPageSchema, generateSEO } from "@/lib/seo";

type BlogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const DESCRIPTION =
  "Planning notes from Nexyyra Events: practical guides to weddings, corporate events and celebrations, from budgets and venues to timelines.";

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/**
 * An unknown `?c=` or a bad or out-of-range `?page=` is a 404. notFound() runs
 * in generateMetadata as well as the page, so a bad URL never gets listing
 * metadata of its own.
 */
async function listingFor(searchParams: BlogPageProps["searchParams"]) {
  const params = await searchParams;
  const listing = resolveBlogListing(first(params.c), first(params.page));
  if (!listing) notFound();
  return listing;
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const listing = await listingFor(searchParams);
  const href = blogListingHref(listing.page, listing.categorySlug);
  if (href === "/blog") return generateSEO({ title: "Planning notes", description: DESCRIPTION, path: "/blog" });

  // Category and page views re-list posts from /blog: kept out of the index
  // but followed (so every post stays reachable), with /blog as canonical.
  const scope = listing.category ? `Planning notes: ${listing.category}` : "Planning notes";
  const topic = listing.category
    ? `Nexyyra Events planning notes on ${listing.category.toLowerCase()}: practical guides and the questions to ask before you book.`
    : DESCRIPTION;
  return generateSEO({
    title: listing.page > 1 ? `${scope} · Page ${listing.page}` : scope,
    description: listing.page > 1 ? `${topic} Page ${listing.page}.` : topic,
    path: href,
    noIndex: true,
    follow: true,
    canonicalPath: "/blog",
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const listing = await listingFor(searchParams);

  return (
    <>
      <JsonLd
        data={collectionPageSchema(
          listing.category ? `Planning notes: ${listing.category}` : "Planning notes",
          blogListingHref(listing.page, listing.categorySlug),
          DESCRIPTION
        )}
      />
      <BlogView listing={listing} />
    </>
  );
}
