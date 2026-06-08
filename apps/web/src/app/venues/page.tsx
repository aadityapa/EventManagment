import { StitchRoute } from "@/components/stitch/stitch-route";
import { stitchMetadata } from "@/lib/stitch/pages";
import { PageHero } from "@/components/shared/page-hero";
import { VenueMarketplace } from "@/components/venues/venue-marketplace";

export const metadata = stitchMetadata("venues");

export default function VenuesPage() {
  return (
    <StitchRoute screen="venues">
      <PageHero
        title="Venue Marketplace"
        subtitle="Find the perfect setting for your extraordinary event"
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VenueMarketplace />
        </div>
      </section>
    </StitchRoute>
  );
}
