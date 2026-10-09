import { UiIcon } from "@/components/icons";
import { Button, Heading, PAGE_TITLE_ID, Section, ServicesIndex, type ServiceSlug } from "@/components/ui";
import { generateSEO } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";

/* `notFound`: no canonical or og:url (a 404 must not point at the homepage) and
   no robots tag of our own — Next.js already sends `noindex` with every 404. */
export const metadata = generateSEO({
  title: "Page Not Found",
  description:
    "This page didn't make the guest list. Browse the twelve Nexyyra Events services, or talk to a planner for a same-day reply.",
  notFound: true,
});

/** Six flagship services — one tap back into the site. */
const FLAGSHIP: ServiceSlug[] = [
  "wedding-planning",
  "destination-weddings",
  "corporate-events",
  "birthday-events",
  "product-launches",
  "event-production",
];

export default function NotFound() {
  return (
    <div className="lux-page">
      <section className="pg-legal-404" aria-labelledby={PAGE_TITLE_ID}>
        {/* The page's one Cinzel element (DESIGN.md §10.20). */}
        <p className="pg-legal-404__numeral" aria-hidden="true">
          404
        </p>
        <Heading as="h1" id={PAGE_TITLE_ID}>
          {"This page didn't make the guest list."}
        </Heading>
        <p className="lux-lead">The link may have moved. The services index and a planner are one tap away.</p>
        <div className="pg-legal-404__actions">
          <Button variant="primary" href="/services" cta="not_found_services" location="not_found" arrow>
            Services
          </Button>
          <Button variant="text" href="/contact" cta="not_found_contact" location="not_found">
            Talk to a planner
          </Button>
          <Button
            variant="ghost"
            href={getWhatsAppUrl("Hello Nexyyra Events, I'd like to talk to a planner.")}
            external
            icon={<UiIcon name="whatsapp" size={20} />}
            cta="not_found_whatsapp"
            location="not_found"
          >
            WhatsApp a planner
          </Button>
        </div>
      </section>

      <Section id="start" eyebrow="Services" title="Where most celebrations begin" space="block">
        <ServicesIndex items={FLAGSHIP} variant="compact" location="not_found" />
      </Section>
    </div>
  );
}
