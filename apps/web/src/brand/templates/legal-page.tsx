import { Fragment, type ReactNode } from "react";
import { Cover, Ledger, OnThisPage, Prose, Section, type LedgerRow } from "@/components/ui";
import { SITE_CONFIG } from "@/lib/constants";
import { LEGAL_UPDATED } from "@/lib/sitemap-lastmod";

/** The three legal documents; titles and paths are shared by the pages, the cross-links and the HTML sitemap. */
export const LEGAL_DOCS = {
  privacy: { href: "/privacy", title: "Privacy Policy", summary: "What we collect, why we collect it, and your rights." },
  terms: { href: "/terms", title: "Terms & Conditions", summary: "Bookings, payments, responsibilities and liability." },
  refund: { href: "/refund", title: "Refund Policy", summary: "Cancellations, rescheduling and refunds of the advance." },
} as const;

export type LegalDocId = keyof typeof LEGAL_DOCS;

export type LegalSection = {
  /** Anchor for the contents list. */
  id: string;
  /** Plain heading text; the chapter numeral is added by the Prose counter. */
  title: string;
  /** Direct children of the article: `<p>`, `<ul>`. */
  body: ReactNode;
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

/** The registered address, assembled from the single source in constants. */
export const REGISTERED_ADDRESS = `${SITE_CONFIG.streetAddress}, ${SITE_CONFIG.city}, ${SITE_CONFIG.region} ${SITE_CONFIG.postalCode}`;

type LegalShellProps = {
  eyebrow?: string;
  title: string;
  lead: string;
  path: string;
  /** ISO date; printed as the "Last updated" folio line. */
  updated?: string;
  children: ReactNode;
};

/**
 * Text cover + body. Shared by the legal documents and the HTML sitemap.
 * No inquiry plate here (DESIGN.md §10.18): the cover CTA is the only route out.
 */
export function LegalShell({ eyebrow = "Legal", title, lead, path, updated, children }: LegalShellProps) {
  const date = updated ? formatDate(updated) : undefined;
  return (
    <div className="lux-page pg-legal">
      <Cover
        size="text"
        eyebrow={eyebrow}
        title={title}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: title, href: path },
        ]}
        // The folio is decorative (aria-hidden), so the date is repeated for screen readers in the lead.
        folio={date ? `Last updated · ${date}` : undefined}
        lead={
          <>
            {lead}
            {updated ? (
              <span className="sr-only">
                {" "}
                Last updated <time dateTime={updated}>{date}</time>.
              </span>
            ) : null}
          </>
        }
        primary={{ href: "/book-event", cta: "legal_cover_proposal" }}
        secondary={{ href: `mailto:${SITE_CONFIG.email}`, label: "Email a question", cta: "legal_cover_email" }}
      />
      {children}
    </div>
  );
}

const FACT_ROWS: LedgerRow[] = [
  { id: "name", term: "Legal name", body: SITE_CONFIG.legalName },
  { id: "cin", term: "CIN", body: SITE_CONFIG.cin },
  { id: "address", term: "Registered address", body: REGISTERED_ADDRESS },
  {
    id: "email",
    term: "Email",
    body: (
      <a href={`mailto:${SITE_CONFIG.email}`} className="pg-legal-link" data-cta="legal_facts_email" data-cta-location="legal_facts">
        {SITE_CONFIG.email}
      </a>
    ),
  },
];

/** A legal document: contents list + numbered article, company facts, the other policies. */
export function LegalPage({ doc, lead, sections }: { doc: LegalDocId; lead: string; sections: LegalSection[] }) {
  const { title, href } = LEGAL_DOCS[doc];
  const others: LedgerRow[] = [
    ...(Object.keys(LEGAL_DOCS) as LegalDocId[])
      .filter((id) => id !== doc)
      .map((id) => ({ id, term: LEGAL_DOCS[id].title, href: LEGAL_DOCS[id].href, body: LEGAL_DOCS[id].summary })),
    { id: "company", term: "Company information", href: "/company", body: "Registered facts about the company." },
  ];

  return (
    <LegalShell title={title} lead={lead} path={href} updated={LEGAL_UPDATED[doc]}>
      <div className="lux-section pg-legal-layout">
        <OnThisPage items={sections.map((s) => ({ href: `#${s.id}`, label: s.title }))} className="pg-legal-contents" />
        <Prose as="article" className="pg-legal-article">
          {sections.map((s) => (
            <Fragment key={s.id}>
              <h2 id={s.id}>{s.title}</h2>
              {s.body}
            </Fragment>
          ))}
        </Prose>
      </div>

      <Section id="company" eyebrow="Company" title="Registered details" lazy>
        <Ledger as="dl" columns={2} rows={FACT_ROWS} />
      </Section>

      <Section id="policies" eyebrow="Policies" title="Read next" space="block" lazy>
        <Ledger as="dl" columns={2} rows={others} />
      </Section>
    </LegalShell>
  );
}
