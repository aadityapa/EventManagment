import { ServicesView } from "@/brand/views/services-view";
import { JsonLd, SERVICE_GROUPS } from "@/components/ui";
import { services } from "@/data/cms";
import { collectionPageSchema, generateSEO, itemListSchema } from "@/lib/seo";

const DESCRIPTION =
  "Twelve event services from Nexyyra Events: weddings, destination weddings, corporate events, conferences, launches and production, each with a starting price.";

export const metadata = generateSEO({
  title: "Event Services and Starting Prices",
  description: DESCRIPTION,
  path: "/services",
});

export default function ServicesPage() {
  // ItemList in the order the index renders the rows (breadcrumb + FAQ JSON-LD come from the rendered primitives).
  const ordered = SERVICE_GROUPS.flatMap((g) => g.slugs).flatMap((slug) => {
    const s = services.find((x) => x.slug === slug);
    return s ? [{ name: s.title, url: `/services/${s.slug}` }] : [];
  });

  return (
    <>
      <JsonLd data={collectionPageSchema({ name: "Event services", path: "/services", description: DESCRIPTION })} />
      <JsonLd data={itemListSchema(ordered)} />
      <ServicesView />
    </>
  );
}
