import Link from "next/link";
import { LEGAL_DOCS, LegalPage, type LegalSection } from "@/brand/templates/legal-page";
import { SITE_CONFIG } from "@/lib/constants";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: LEGAL_DOCS.terms.title,
  description: "The terms that apply when you use the Nexyyra Events website or book our event planning services.",
  path: LEGAL_DOCS.terms.href,
});

const { legalName, shortName } = SITE_CONFIG;

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of terms",
    body: (
      <p>
        By accessing the {shortName} website or booking our services, you agree to be bound by these Terms and Conditions. If you
        do not agree, please do not use our services.
      </p>
    ),
  },
  {
    id: "services",
    title: "Services",
    body: (
      <p>
        {legalName} provides event planning, management and coordination services. Service scope, deliverables and pricing are
        defined in individual booking agreements and proposals.
      </p>
    ),
  },
  {
    id: "booking-and-payments",
    title: "Booking and payments",
    body: (
      <p>
        A 30% advance payment is required to confirm all bookings. Remaining payments follow the schedule outlined in your
        contract. We accept payment through Razorpay, bank transfer and UPI. All prices are subject to 18% GST unless otherwise
        stated.
      </p>
    ),
  },
  {
    id: "cancellation",
    title: "Cancellation",
    body: (
      <p>
        Cancellations, refunds of the advance and date changes are governed by our{" "}
        <Link href={LEGAL_DOCS.refund.href} prefetch={false}>
          {LEGAL_DOCS.refund.title}
        </Link>
        . Force majeure events are handled on a case-by-case basis.
      </p>
    ),
  },
  {
    id: "client-responsibilities",
    title: "Client responsibilities",
    body: (
      <p>
        Clients must provide accurate event information, timely approvals and access to venues as required. Delays caused by
        client inaction may incur additional charges.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <p>
        {legalName}&rsquo;s liability is limited to the total fees paid for the specific event. We are not liable for indirect,
        incidental or consequential damages arising from event execution.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <p>
        All website content, designs and marketing materials are owned by {legalName}. Event photography and videography usage
        rights are defined in individual service agreements.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in
        Mumbai, Maharashtra.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      doc="terms"
      lead="The terms that apply when you use this website or book our event planning services."
      sections={SECTIONS}
    />
  );
}
