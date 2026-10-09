import Link from "next/link";
import { BRAND_REPLY_HOURS, BRAND_REPLY_HOURS_SHORT } from "@/brand/data/content";
import { EDITORIAL_BAND } from "@/brand/data/image-curation";
import { Commitments, Cover, Eyebrow, Heading, InquiryPanel, Ledger, MediaFrame, Section, type LedgerRow } from "@/components/ui";
import { ENTITY_FACTS, SITE_CONFIG } from "@/lib/constants";
import { getWhatsAppUrl } from "@/lib/utils";

const WHATSAPP_URL = getWhatsAppUrl("Hello Nexyyra Events, I would like to talk to a planner about my event.");

/* Cities only; the broad areas read better as the closing words of the line. */
const BROAD_AREAS = new Set<string>(["Maharashtra", "India", "International destinations"]);
const CITIES = ENTITY_FACTS.serviceAreas.filter((area) => !BROAD_AREAS.has(area));

const link = (href: string, cta: string, label: string, external = false) => (
  <a
    href={href}
    className="pg-conv-link"
    data-cta={cta}
    data-cta-location="contact-ledger"
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
  >
    {label}
  </a>
);

/* The registered office is the only published street address. The Pune office
   has no published street, so none is shown and no map is embedded. */
const CONTACT_ROWS: LedgerRow[] = [
  { id: "phone", term: "Phone", body: link(`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`, "contact_call", SITE_CONFIG.phone) },
  { id: "whatsapp", term: "WhatsApp", body: link(WHATSAPP_URL, "contact_whatsapp", "Message a planner", true) },
  { id: "email", term: "Email", body: link(`mailto:${SITE_CONFIG.email}`, "contact_email", SITE_CONFIG.email) },
  { id: "hours", term: "Hours", body: BRAND_REPLY_HOURS },
  {
    id: "registered",
    term: "Registered office",
    body: `${SITE_CONFIG.streetAddress}, ${SITE_CONFIG.city}, ${SITE_CONFIG.region} ${SITE_CONFIG.postalCode}`,
  },
  {
    id: "pune",
    term: "Delivery & Coordination Office — Pune",
    body: "Consultations in person, on video or at your venue.",
  },
  { id: "languages", term: "Languages", body: ENTITY_FACTS.languages.join(", ") },
  { id: "areas", term: "Service areas", body: `${CITIES.join(", ")} — and pan-India and international destinations.` },
  {
    id: "company",
    term: "Company",
    body: (
      <>
        {SITE_CONFIG.legalName} · CIN {SITE_CONFIG.cin} ·{" "}
        <Link href="/company" prefetch={false} className="pg-conv-link" data-cta="contact_company" data-cta-location="contact-ledger">
          Company information
        </Link>
      </>
    ),
  },
];

/**
 * /contact (DESIGN.md §10.12): the full form first on phones, the contact
 * ledger beside it from 1024px. No map iframe, no duplicate "at a glance" block.
 */
export function ContactView() {
  const band = EDITORIAL_BAND[EDITORIAL_BAND.length - 1];

  return (
    <div className="lux-page pg-conv">
      <Cover
        size="text"
        eyebrow="Contact"
        title="Talk to a planner"
        lead={BRAND_REPLY_HOURS_SHORT}
        primary={{ href: "#inquire", cta: "contact_cover_proposal" }}
        secondary={{ href: WHATSAPP_URL, label: "WhatsApp a planner", cta: "contact_cover_whatsapp", external: true }}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />

      <div className="pg-conv-split pg-conv-split--contact">
        <InquiryPanel
          source="contact"
          variant="full"
          contacts={false}
          eyebrow="Your brief"
          title="Tell us about your event"
          lead="A few details are enough to start. After a free consultation, your itemised proposal follows within 48 hours."
          className="pg-conv-split__main"
        />
        <section className="pg-conv-split__aside" aria-labelledby="contact-details-title">
          <Eyebrow>Direct lines</Eyebrow>
          <Heading as="h2" size="h3" id="contact-details-title">
            Reach us directly
          </Heading>
          <Ledger as="dl" rows={CONTACT_ROWS} />
        </section>
      </div>

      <Section id="commitments" number="01" eyebrow="Commitments" title="What you can expect" lazy>
        <Commitments variant="row" />
      </Section>

      {band ? (
        <MediaFrame asset={band.id} ratio="3:2" sizes="(min-width: 1440px) 1440px, 100vw" className="pg-conv-band" />
      ) : null}
    </div>
  );
}
