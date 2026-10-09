import Link from "next/link";
import { Commitments, Cover, InquiryPanel, Ledger, Section, type LedgerRow } from "@/components/ui";
import { ENTITY_FACTS, FOOTER_LEGAL, SITE_CONFIG } from "@/lib/constants";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  // The brand suffix already names the company; the legal name is in the H1 and description.
  title: "Company Information and CIN",
  description:
    "Company facts for Nexyyra Events and Promotions Private Limited: CIN U70200ME2026PTC476014, incorporated 2026, registered office Telhara, Maharashtra.",
  path: "/company",
});

/** Service-area entries that are regions, not cities — said in prose instead of listed. */
const REGION_AREAS = new Set(["Maharashtra", "India", "International destinations"]);
const listOf = (items: readonly string[]) => new Intl.ListFormat("en-GB", { type: "conjunction" }).format(items);
const CITIES = ENTITY_FACTS.serviceAreas.filter((area) => !REGION_AREAS.has(area));

const tel = `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`;
const website = SITE_CONFIG.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** Contact values in the ledger are CTAs too: the delegated handler reads `data-cta`. */
function FactLink({ href, cta, children }: { href: string; cta: string; children: string }) {
  return (
    <a href={href} className="pg-about-fact-link" data-cta={cta} data-cta-location="company_facts">
      {children}
    </a>
  );
}

const FACTS: LedgerRow[] = [
  { id: "legal-name", term: "Legal name", body: SITE_CONFIG.legalName },
  { id: "trade-name", term: "Trade name", body: SITE_CONFIG.shortName },
  { id: "cin", term: "CIN", body: SITE_CONFIG.cin },
  { id: "incorporated", term: "Incorporated", body: "2026, as a private limited company in India" },
  {
    id: "registered-office",
    term: "Registered office",
    body: `${SITE_CONFIG.streetAddress}, ${SITE_CONFIG.city}, ${SITE_CONFIG.region} ${SITE_CONFIG.postalCode}`,
  },
  // No published street address in Pune — the office is named, never located.
  { id: "pune", term: "Delivery & Coordination Office", body: "Pune, Maharashtra" },
  { id: "phone", term: "Phone and WhatsApp", body: <FactLink href={tel} cta="company_call">{SITE_CONFIG.phone}</FactLink> },
  { id: "email", term: "Email", body: <FactLink href={`mailto:${SITE_CONFIG.email}`} cta="company_email">{SITE_CONFIG.email}</FactLink> },
  { id: "website", term: "Website", body: <FactLink href={SITE_CONFIG.url} cta="company_website">{website}</FactLink> },
  { id: "languages", term: "Languages", body: listOf(ENTITY_FACTS.languages) },
  { id: "areas", term: "Service areas", body: `${CITIES.join(", ")}; across India and at international destinations` },
  { id: "payments", term: "Payment methods", body: "Razorpay, bank transfer or UPI" },
  { id: "booking", term: "Booking terms", body: "A 30% advance secures the date; the balance is paid in milestones." },
];

const POLICY_LINKS = [...FOOTER_LEGAL, { href: "/contact", label: "Contact" }];

/**
 * /company (DESIGN.md §10.8): one canonical statement of the legal entity.
 * No JSON-LD beyond the breadcrumb trail — the global graph already carries
 * the Organization, and a second one here would compete with it.
 */
export default function CompanyPage() {
  return (
    <div className="lux-page">
      <Cover
        size="text"
        eyebrow="Company information"
        title={SITE_CONFIG.legalName}
        lead="Registered facts about the company"
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Company", href: "/company" },
        ]}
        primary={{ href: "#inquire", cta: "company_cover_proposal" }}
      />

      <Section
        id="facts"
        number="01"
        eyebrow="Facts"
        title="The company on record"
        lead={`${SITE_CONFIG.shortName} is the trade name of ${SITE_CONFIG.legalName}. The two names refer to the same company.`}
      >
        <Ledger as="dl" columns={2} rows={FACTS} ariaLabel="Company facts" className="lux-wide" />
      </Section>

      <Section
        id="policies"
        number="02"
        eyebrow="Policies"
        title="How we work with every client"
        lead="Commitments the company sets and keeps on every booking."
        lazy
      >
        <Commitments variant="grid" expanded />
        <nav aria-label="Policies and contact" className="pg-about-links">
          <ul>
            {POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} prefetch={false} className="lux-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <InquiryPanel id="inquire" source="contact" variant="compact" className="pg-about-inquiry" />
    </div>
  );
}
