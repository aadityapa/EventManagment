import { notFound } from "next/navigation";
import { LocalPage } from "@/brand/templates/local-page";
import { getLocationPage, LOCATION_PAGES } from "@/lib/location-pages";
import { generateSEO } from "@/lib/seo";

type Props = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return LOCATION_PAGES.map((p) => ({ city: p.slug }));
}

// Only the 13 published cities exist; anything else is a 404, not an on-demand render.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { city } = await params;
  const page = getLocationPage(city);
  if (!page) notFound();
  return generateSEO({
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    path: `/locations/${page.slug}`,
  });
}

export default async function LocationRoute({ params }: Props) {
  const { city } = await params;
  const page = getLocationPage(city);
  if (!page) notFound();
  return <LocalPage variant="city" page={page} />;
}
