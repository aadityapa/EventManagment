import { PageHero } from "@/components/shared/page-hero";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { StitchRoute } from "@/components/stitch/stitch-route";
import { stitchMetadata } from "@/lib/stitch/pages";

export const metadata = stitchMetadata("book-event");

export default function BookEventPage() {
  return (
    <StitchRoute screen="book-event">
    <>
      <PageHero
        title="Book Your Event"
        subtitle="Complete our 9-step wizard to plan your extraordinary celebration"
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BookingWizard />
        </div>
      </section>
    </>
    </StitchRoute>
  );
}
