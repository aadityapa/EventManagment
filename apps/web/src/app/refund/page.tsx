import { StitchRoute } from "@/components/stitch/stitch-route";
import { stitchMetadata } from "@/lib/stitch/pages";
import { PageHero } from "@/components/shared/page-hero";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = stitchMetadata("refund");

export default function RefundPage() {
  return (
    <StitchRoute screen="refund">
    <>
      <PageHero title="Refund Policy" subtitle="Last updated: June 7, 2026" />

      <section className="py-16 md:py-24">
        <div className="container-page max-w-3xl space-y-8">
          <div className="glass-card p-6">
            <h2 className="font-display text-xl font-semibold">1. Booking Confirmation</h2>
            <p className="mt-3 leading-relaxed text-muted">
              A 30% advance payment is required to confirm all bookings with {SITE_CONFIG.name}.
              The remaining balance is due according to your event contract schedule.
            </p>
          </div>

          <div className="glass-card p-6">
            <h2 className="font-display text-xl font-semibold">2. Cancellation by Client</h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-muted">
              <li>More than 90 days before event: 80% of advance refundable</li>
              <li>60–90 days before event: 50% of advance refundable</li>
              <li>30–60 days before event: 25% of advance refundable</li>
              <li>Less than 30 days: No refund on advance; vendor costs may apply</li>
            </ul>
          </div>

          <div className="glass-card p-6">
            <h2 className="font-display text-xl font-semibold">3. Rescheduling</h2>
            <p className="mt-3 leading-relaxed text-muted">
              One complimentary date change is permitted if requested at least 45 days before the
              event, subject to venue and vendor availability. Additional changes may incur fees.
            </p>
          </div>

          <div className="glass-card p-6">
            <h2 className="font-display text-xl font-semibold">4. Force Majeure</h2>
            <p className="mt-3 leading-relaxed text-muted">
              In cases of government restrictions, natural disasters, or circumstances beyond our
              control, we will work with you to reschedule or provide credit toward a future event.
            </p>
          </div>

          <div className="glass-card p-6">
            <h2 className="font-display text-xl font-semibold">5. Contact</h2>
            <p className="mt-3 leading-relaxed text-muted">
              For refund requests, contact us at{" "}
              <a href={`mailto:${SITE_CONFIG.email}`} className="text-primary hover:underline">
                {SITE_CONFIG.email}
              </a>{" "}
              or call{" "}
              <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="text-primary hover:underline">
                {SITE_CONFIG.phone}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
    </StitchRoute>
  );
}
