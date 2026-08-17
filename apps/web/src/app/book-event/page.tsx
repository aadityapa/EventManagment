import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import { BookView } from "@/brand";

type BookEventPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function hasTrackingQuery(params: Record<string, string | string[] | undefined>) {
  return Object.entries(params).some(([, value]) => {
    if (Array.isArray(value)) return value.some((v) => v.trim() !== "");
    return typeof value === "string" && value.trim() !== "";
  });
}

export async function generateMetadata({ searchParams }: BookEventPageProps): Promise<Metadata> {
  const params = await searchParams;

  return generateSEO({
    title: "Book Consultation",
    description: "Book your luxury event consultation with Nexyyra Events.",
    path: "/book-event",
    // Pre-filled booking links (?service=, ?world=) are UX variants of one page — keep
    // canonical on /book-event and tell crawlers not to index parameterized URLs.
    noIndex: hasTrackingQuery(params),
  });
}

export default function BookEventPage() {
  return <BookView />;
}
