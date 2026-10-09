import type { Metadata } from "next";
import { BRAND_INVESTMENTS } from "@/brand/data/content";
import { BookView } from "@/brand";
import { collectionGuests } from "@/brand/views/pricing-view";
import { collectionSlug } from "@/components/ui";
import { EVENT_TYPES } from "@/lib/constants";
import { SERVICE_EVENT_TYPE } from "@/lib/inquiry";
import { generateSEO } from "@/lib/seo";

type BookEventPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function hasTrackingQuery(params: Record<string, string | string[] | undefined>) {
  return Object.entries(params).some(([, value]) => {
    if (Array.isArray(value)) return value.some((v) => v.trim() !== "");
    return typeof value === "string" && value.trim() !== "";
  });
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export async function generateMetadata({ searchParams }: BookEventPageProps): Promise<Metadata> {
  const params = await searchParams;

  return generateSEO({
    title: "Get a Free Event Proposal",
    description:
      "Tell Nexyyra Events about your wedding, corporate event or celebration — free consultation, same-day planner reply and an itemised proposal within 48 hours.",
    path: "/book-event",
    // Pre-filled booking links (?service=, ?collection=, ?type=) are UX variants of one
    // page — keep canonical on /book-event and tell crawlers not to index them.
    noIndex: hasTrackingQuery(params),
  });
}

export default async function BookEventPage({ searchParams }: BookEventPageProps) {
  const params = await searchParams;
  const service = first(params.service);
  const type = first(params.type);
  const collectionParam = first(params.collection);

  // ?service= (service pages) wins; ?type= (the /pricing guide) must be a known event type.
  const defaultEventType =
    (service ? SERVICE_EVENT_TYPE[service] : undefined) ?? EVENT_TYPES.find((t) => t.id === type)?.id;

  const match = collectionParam ? BRAND_INVESTMENTS.find((c) => collectionSlug(c.name) === collectionParam) : undefined;
  const collection = match ? { name: match.name, from: match.from, guests: collectionGuests(match.narrative) } : undefined;

  return <BookView defaultEventType={defaultEventType} collection={collection} />;
}
