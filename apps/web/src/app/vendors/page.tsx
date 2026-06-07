import { generateSEO } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { VendorMarketplace } from "@/components/vendors/vendor-marketplace";

export const metadata = generateSEO({
  title: "Vendors",
  description:
    "Browse verified event vendors — photographers, decorators, caterers, DJs, and more.",
  path: "/vendors",
});

export default function VendorsPage() {
  return (
    <>
      <PageHero
        title="Vendor Marketplace"
        subtitle="Connect with verified professionals for your event"
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <VendorMarketplace />
        </div>
      </section>
    </>
  );
}
