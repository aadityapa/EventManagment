import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection } from "@/brand/primitives/brand-section";
import { HomeAiPlanner } from "@/brand/sections/home/ai-planner";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { BRAND_IMAGES } from "@/brand/data/imagery";

export function BookView() {
  return (
    <div className="brand-root">
      <BrandPageHero label="Consultation" title="Book Your Extraordinary Event" subtitle="Our luxury planning wizard guides you from vision to celebration." image={BRAND_IMAGES.hero.wedding} />
      <BrandSection><BookingWizard /></BrandSection>
      <HomeAiPlanner />
    </div>
  );
}
