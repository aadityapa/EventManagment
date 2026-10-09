import { HomeView } from "@/brand";
import { JsonLd, SERVICE_GROUPS } from "@/components/ui";
import { services } from "@/data/cms";
import { generateSEO, itemListSchema } from "@/lib/seo";

export const metadata = {
  ...generateSEO({
    description:
      "Nexyyra Events is a luxury event management company in Pune, planning weddings, corporate events, celebrations and destination events across India.",
    path: "/",
  }),
  // Exact brand-first homepage title — strongest entity/site-name signal for Google.
  title: "Nexyyra Events | Luxury Event Management Company in Pune",
};

/**
 * JSON-LD mirrors only what the page renders: the twelve-service index here;
 * the FAQPage for the six rendered questions is emitted by the home FAQ
 * Accordion itself. No BreadcrumbList — the homepage shows no trail, and a
 * one-item list says nothing.
 */
export default function HomePage() {
  // Same order as the rendered index; no images (the index rows show none).
  const serviceList = SERVICE_GROUPS.flatMap((g) => g.slugs).flatMap((slug) => {
    const service = services.find((s) => s.slug === slug);
    return service ? [{ title: service.title, slug: service.slug }] : [];
  });

  return (
    <>
      <JsonLd data={itemListSchema(serviceList)} />
      <HomeView />
    </>
  );
}
