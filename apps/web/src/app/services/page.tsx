import { generateSEO, itemListSchema, collectionPageSchema } from "@/lib/seo";
import { ServicesView } from "@/brand";
import { services } from "@/data/cms";

export const metadata = generateSEO({
  title: "Luxury Event Services",
  description: "Luxury weddings, corporate galas, destination celebrations, concerts, exhibitions, and premium experiences across India.",
  path: "/services",
});

export default function ServicesPage() {
  const collectionLd = collectionPageSchema(
    "Luxury Event Services",
    "/services",
    "Full-service luxury event experiences by Nexyyra Events — weddings, corporate, destination, concerts, and more.",
  );
  const listLd = itemListSchema(
    services.map((s) => ({
      name: s.title,
      url: `/services/${s.slug}`,
      image: s.image,
    })),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      <ServicesView />
    </>
  );
}
