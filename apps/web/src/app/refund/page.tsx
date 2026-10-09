import { LEGAL_DOCS, LegalPage, type LegalSection } from "@/brand/templates/legal-page";
import { SITE_CONFIG } from "@/lib/constants";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: LEGAL_DOCS.refund.title,
  description: "Refund, cancellation and rescheduling policy for bookings with Nexyyra Events.",
  path: LEGAL_DOCS.refund.href,
});

const SECTIONS: LegalSection[] = [
  {
    id: "booking-confirmation",
    title: "Booking confirmation",
    body: (
      <p>
        A 30% advance payment is required to confirm all bookings with {SITE_CONFIG.shortName}. The remaining balance is due
        according to your event contract schedule.
      </p>
    ),
  },
  {
    id: "cancellation-by-client",
    title: "Cancellation by the client",
    body: (
      <ul>
        <li>More than 90 days before the event: 80% of the advance is refundable</li>
        <li>61–90 days before the event: 50% of the advance is refundable</li>
        <li>30–60 days before the event: 25% of the advance is refundable</li>
        <li>Less than 30 days: no refund on the advance; vendor costs may apply</li>
      </ul>
    ),
  },
  {
    id: "rescheduling",
    title: "Rescheduling",
    body: (
      <p>
        One complimentary date change is permitted if requested at least 45 days before the event, subject to venue and vendor
        availability. Additional changes may incur fees.
      </p>
    ),
  },
  {
    id: "force-majeure",
    title: "Force majeure",
    body: (
      <p>
        In cases of government restrictions, natural disasters or circumstances beyond our control, we will work with you to
        reschedule or provide credit toward a future event.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        For refund requests, write to{" "}
        <a href={`mailto:${SITE_CONFIG.email}`} data-cta="legal_refund_email" data-cta-location="legal_body">
          {SITE_CONFIG.email}
        </a>{" "}
        or call{" "}
        <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} data-cta="legal_refund_call" data-cta-location="legal_body">
          {SITE_CONFIG.phone}
        </a>
        .
      </p>
    ),
  },
];

export default function RefundPage() {
  return (
    <LegalPage
      doc="refund"
      lead="How cancellations, date changes and refunds of the advance work for bookings with us."
      sections={SECTIONS}
    />
  );
}
