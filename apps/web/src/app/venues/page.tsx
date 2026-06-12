import { generateSEO, venueSchema } from "@/lib/seo";
import { VenuesView } from "@/brand";
import { venues } from "@/data/cms";

export const metadata = generateSEO({
  title: "Luxury Venues",
  description: "Exclusive venues across Pune, Mumbai, Goa, Jaipur, and Udaipur.",
  path: "/venues",
});

export default function VenuesPage() {
  const schemas = venues.map((v) =>
    venueSchema({
      name: v.name,
      description: v.description,
      slug: v.slug,
      city: v.city,
      capacity: v.capacity,
      image: v.images[0],
    })
  );

  return (
    <>
      {schemas.map((schema, i) => (
        <script key={venues[i].id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <VenuesView />
    </>
  );
}
