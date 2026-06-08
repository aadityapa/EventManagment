import { CinematicHero } from "@/components/shared/cinematic-hero";
import { PageSection } from "@/components/shared/page-section";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { generateSEO } from "@/lib/seo";
import { IMAGES } from "@/lib/images";

export const metadata = generateSEO({
  title: "Book Consultation — Luxury Event Planner",
  description: "Book your luxury event consultation with Glitz Events & Promotions. Weddings, corporate events, and destination celebrations.",
  path: "/book-event",
});

export default function BookEventPage() {
  return (
    <>
      <CinematicHero
        label="Start Your Journey"
        title="Book Your Extraordinary Event"
        subtitle="Our luxury planning wizard guides you from vision to celebration."
        image={IMAGES.hero.wedding}
        size="full"
      />
      <PageSection>
        <BookingWizard />
      </PageSection>
    </>
  );
}
