import { generateSEO, organizationSchema } from "@/lib/seo";
import { HeroSection } from "@/components/home/hero-section";
import { TrustBar } from "@/components/home/trust-bar";
import { StatsSection } from "@/components/home/stats-section";
import { ServicesSection } from "@/components/home/services-section";
import { WhyChooseSection } from "@/components/home/why-choose-section";
import { PortfolioSection } from "@/components/home/portfolio-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { EventJourneySection } from "@/components/home/event-journey-section";
import { VenueShowcaseSection } from "@/components/home/venue-showcase-section";
import { GalleryPreviewSection } from "@/components/home/gallery-preview-section";
import { LuxuryPlannerSection } from "@/components/home/luxury-planner-section";
import { AiPlannerSection } from "@/components/home/ai-planner-section";
import { CTASection } from "@/components/home/cta-section";

export const metadata = generateSEO({
  title: "Luxury Event Management Company Pune",
  description:
    "Glitz Events & Promotions — India's premier luxury wedding planner, corporate event organizer, and destination celebration specialist. 1800+ events, 12+ years of excellence.",
  keywords: [
    "Wedding Planner Pune",
    "Corporate Event Planner Pune",
    "Destination Wedding Planner India",
    "Luxury Wedding Planner India",
    "Event Management Company Pune",
    "Celebrity Event Management",
    "Luxury Event Planner India",
  ],
  path: "/",
});

export default function HomePage() {
  const schema = organizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HeroSection />
      <TrustBar />
      <StatsSection />
      <ServicesSection />
      <WhyChooseSection />
      <PortfolioSection />
      <TestimonialsSection />
      <EventJourneySection />
      <VenueShowcaseSection />
      <GalleryPreviewSection />
      <LuxuryPlannerSection />
      <AiPlannerSection />
      <CTASection />
    </>
  );
}
