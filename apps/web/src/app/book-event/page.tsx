import { generateSEO } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { BookingWizard } from "@/components/booking/booking-wizard";

export const metadata = generateSEO({
  title: "Book Event",
  description:
    "Book your event with JIJU Events — our 9-step wizard makes planning effortless.",
  path: "/book-event",
});

export default function BookEventPage() {
  return (
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
  );
}
