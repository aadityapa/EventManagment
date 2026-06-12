import dynamic from "next/dynamic";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { HomeAiPlanner } from "@/brand/sections/home/ai-planner";
import { LeadMagnetsSection, CallbackRequestForm } from "@/components/cro/conversion-sections";
import { InlineBudgetCalculator } from "@/components/cro/budget-calculator";
import { BRAND_IMAGES } from "@/brand/data/imagery";

const BookingWizard = dynamic(
  () => import("@/components/booking/booking-wizard").then((m) => m.BookingWizard),
  { loading: () => <div className="min-h-[320px] animate-pulse rounded-xl bg-[var(--glitz-surface)]" /> }
);

export function BookView() {
  return (
    <div className="brand-root">
      <BrandPageHero
        label="Consultation"
        title="Book Your Extraordinary Event"
        subtitle="Our luxury planning wizard guides you from vision to celebration."
        image={BRAND_IMAGES.hero.wedding}
      />
      <BrandSection>
        <BookingWizard />
      </BrandSection>
      <InlineBudgetCalculator />
      <HomeAiPlanner />
      <LeadMagnetsSection />
      <BrandSection id="callback" alt>
        <BrandHeader label="Speak With Us" title="Request a Callback" subtitle="Leave your details — a luxury specialist will reach out within 2 hours." center />
        <div className="mx-auto max-w-md brand-surface p-6 sm:p-8">
          <CallbackRequestForm />
        </div>
      </BrandSection>
    </div>
  );
}
