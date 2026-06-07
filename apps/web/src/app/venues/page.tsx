import { generateSEO } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { VenueMarketplace } from "@/components/venues/venue-marketplace";

export const metadata = generateSEO({
  title: "Venues",
  description:
    "Discover premium event venues across India — ballrooms, gardens, convention centers, and beachfront estates.",
  path: "/venues",
});

export default function VenuesPage() {
  return (
    <>
      <PageHero
        title="Venue Marketplace"
        subtitle="Find the perfect setting for your extraordinary event"
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VenueMarketplace />
        </div>
      </section>
    </>
  );
}
