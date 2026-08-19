import Link from "next/link";
import { generateSEO, breadcrumbSchema } from "@/lib/seo";
import { SITE_CONFIG, ENTITY_FACTS } from "@/lib/constants";
import { TEAM_MEMBERS } from "@/data/team";
import { PageHero } from "@/components/shared/page-hero";

export const metadata = generateSEO({
  title: "Company Information — Nexyyra Events and Promotions Private Limited",
  description:
    "Official company information for Nexyyra Events and Promotions Private Limited (CIN: U70200ME2026PTC476014) — the legal entity behind the Nexyyra Events brand. Registered in Telhara, Maharashtra; luxury event management across Pune and India.",
  path: "/company",
});

const ORG_ID = `${SITE_CONFIG.url}/#organization`;

/** Entity disambiguation page — one canonical statement of who the company is. */
export default function CompanyPage() {
  const founders = TEAM_MEMBERS.filter((m) => m.founder);
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Company", url: "/company" },
  ]);
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_CONFIG.url}/company#aboutpage`,
    url: `${SITE_CONFIG.url}/company`,
    name: "Company Information — Nexyyra Events and Promotions Private Limited",
    mainEntity: { "@id": ORG_ID },
  };

  const facts: Array<{ label: string; value: string }> = [
    { label: "Legal name", value: SITE_CONFIG.legalName },
    { label: "Brand name", value: SITE_CONFIG.shortName },
    { label: "CIN", value: SITE_CONFIG.cin },
    { label: "Brand founded", value: `${ENTITY_FACTS.foundingYear}, Amravati, Maharashtra` },
    { label: "Incorporated", value: "2026 — private limited company (Ministry of Corporate Affairs, India)" },
    { label: "Official domain", value: "www.nexyyra.com" },
    { label: "Email", value: SITE_CONFIG.email },
    { label: "Phone", value: SITE_CONFIG.phone },
    { label: "Registered office", value: `${SITE_CONFIG.streetAddress}, ${SITE_CONFIG.city}, ${SITE_CONFIG.region} ${SITE_CONFIG.postalCode}, India` },
    { label: "Delivery & coordination office", value: "Pune, Maharashtra, India" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <PageHero
        title="Company Information"
        subtitle="Nexyyra Events and Promotions Private Limited"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold">Official Identity</h2>
              <p className="mt-3 text-muted leading-relaxed">
                <strong>Nexyyra Events</strong> is the brand of{" "}
                <strong>{SITE_CONFIG.legalName}</strong>, an Indian private limited company
                (CIN: {SITE_CONFIG.cin}). The company&apos;s only official website is{" "}
                <strong>www.nexyyra.com</strong>. &ldquo;Nexyyra&rdquo;, &ldquo;Nexyyra
                Events&rdquo; and &ldquo;{SITE_CONFIG.legalName}&rdquo; all refer to the same
                organization.
              </p>
              <dl className="mt-5 space-y-3">
                {facts.map((f) => (
                  <div key={f.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                    <dt className="min-w-[220px] text-sm font-medium text-muted">{f.label}</dt>
                    <dd className="text-sm leading-relaxed">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold">Brand History &amp; Incorporation</h2>
              <p className="mt-3 text-muted leading-relaxed">
                The Nexyyra Events brand was founded by <strong>Yash Bajaj</strong> in Amravati,
                Maharashtra in {ENTITY_FACTS.foundingYear}, and has planned and produced weddings,
                corporate events, concerts and destination celebrations across India since then. In
                2026 the business was incorporated as {SITE_CONFIG.legalName}, when co-founders{" "}
                <strong>Aaditya Padiya</strong> and <strong>Amey Korde</strong> joined the company.
                The brand&apos;s operating history ({ENTITY_FACTS.foundingYear}) and the legal
                entity&apos;s incorporation date (2026) therefore refer to the same continuous
                business.
              </p>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold">Leadership</h2>
              <ul className="mt-3 space-y-2">
                {founders.map((m) => (
                  <li key={m.slug} className="text-muted leading-relaxed">
                    <strong className="text-foreground">{m.name}</strong> — {m.role}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-muted leading-relaxed">
                Full team profiles are on our <Link href="/about" className="underline">About page</Link>.
              </p>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold">Official Profiles</h2>
              <ul className="mt-3 space-y-2 text-muted">
                <li>
                  Instagram:{" "}
                  <a href={SITE_CONFIG.social.instagram} rel="me noopener" target="_blank" className="underline">
                    {SITE_CONFIG.social.instagram}
                  </a>
                </li>
                <li>
                  LinkedIn:{" "}
                  <a href={SITE_CONFIG.social.linkedin} rel="me noopener" target="_blank" className="underline">
                    {SITE_CONFIG.social.linkedin}
                  </a>
                </li>
                <li>
                  Facebook:{" "}
                  <a href={SITE_CONFIG.social.facebook} rel="me noopener" target="_blank" className="underline">
                    {SITE_CONFIG.social.facebook}
                  </a>
                </li>
                <li>
                  YouTube:{" "}
                  <a href={SITE_CONFIG.social.youtube} rel="me noopener" target="_blank" className="underline">
                    {SITE_CONFIG.social.youtube}
                  </a>
                </li>
              </ul>
              <p className="mt-3 text-sm text-muted">
                Profiles not listed here are not operated by {SITE_CONFIG.legalName}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
