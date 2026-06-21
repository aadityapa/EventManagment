import { StitchRoute } from "@/components/stitch/stitch-route";
import { stitchMetadata } from "@/lib/stitch/pages";
import { PageHero } from "@/components/shared/page-hero";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = stitchMetadata("terms");

export default function TermsPage() {
  return (
    <StitchRoute screen="terms">
    <>
      <PageHero title="Terms & Conditions" subtitle="Last updated: June 1, 2026" />

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {[
              {
                title: "1. Acceptance of Terms",
                content: `By accessing ${SITE_CONFIG.name}'s website or booking our services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.`,
              },
              {
                title: "2. Services",
                content:
                  `${SITE_CONFIG.legalName} provides event planning, management, and coordination services. Service scope, deliverables, and pricing are defined in individual booking agreements and proposals.`,
              },
              {
                title: "3. Booking & Payments",
                content:
                  "A 30% advance payment is required to confirm all bookings. Remaining payments follow the schedule outlined in your contract. We accept Razorpay, Stripe, PayPal, bank transfers, and UPI. All prices are subject to 18% GST unless otherwise stated.",
              },
              {
                title: "4. Cancellation Policy",
                content:
                  "Cancellations made 90+ days before the event receive a 70% refund of amounts paid. 60-89 days: 50% refund. 30-59 days: 25% refund. Less than 30 days: no refund. Force majeure events are handled on a case-by-case basis.",
              },
              {
                title: "5. Client Responsibilities",
                content:
                  "Clients must provide accurate event information, timely approvals, and access to venues as required. Delays caused by client inaction may incur additional charges.",
              },
              {
                title: "6. Limitation of Liability",
                content:
                  `${SITE_CONFIG.legalName}'s liability is limited to the total fees paid for the specific event. We are not liable for indirect, incidental, or consequential damages arising from event execution.`,
              },
              {
                title: "7. Intellectual Property",
                content:
                  `All website content, designs, and marketing materials are owned by ${SITE_CONFIG.legalName}. Event photography and videography usage rights are defined in individual service agreements.`,
              },
              {
                title: "8. Governing Law",
                content:
                  "These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.",
              },
            ].map((section) => (
              <div key={section.title} className="glass-card p-6">
                <h2 className="font-display text-xl font-semibold">{section.title}</h2>
                <p className="mt-3 text-muted leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
    </StitchRoute>
  );
}
