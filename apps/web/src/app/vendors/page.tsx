import { StitchRoute } from "@/components/stitch/stitch-route";
import { stitchMetadata } from "@/lib/stitch/pages";
import { PageHero } from "@/components/shared/page-hero";
import { VendorMarketplace } from "@/components/vendors/vendor-marketplace";

export const metadata = stitchMetadata("vendors");

export default function VendorsPage() {
  return (
    <StitchRoute screen="vendors">
      <PageHero
        title="Vendor Marketplace"
        subtitle="Connect with verified professionals for your event"
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VendorMarketplace />
        </div>
      </section>
    </StitchRoute>
  );
}
