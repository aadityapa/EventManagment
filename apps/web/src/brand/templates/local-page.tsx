import Link from "next/link";
import { EDITORIAL_BAND } from "@/brand/data/image-curation";
import { ServiceIcon } from "@/components/icons";
import {
  Accordion,
  Commitments,
  Cover,
  InquiryPanel,
  JsonLd,
  Ledger,
  MediaFrame,
  PAGE_TITLE_ID,
  Prose,
  Section,
  ServicesIndex,
  type AccordionItem,
  type BreadcrumbItem,
  type ServiceSlug,
} from "@/components/ui";
import { getExpandedLocalFaqs, localBusinessSchemaForPage, localPageEventType, LOCAL_SEO_PAGES, type LocalSeoPage } from "@/lib/local-seo-pages";
import { getExpandedLocationFaqs, locationBusinessSchema, LOCATION_PAGES, type LocationPage } from "@/lib/location-pages";
import { speakableWebPageSchema } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";
import { getLocalPageContextualLinks } from "@/lib/wedding-internal-links";

export type LocalPageProps = { variant: "city"; page: LocationPage } | { variant: "service"; page: LocalSeoPage };

/** Where the 13 cities sit in the footer and about ledger; until /locations exists, "Locations" points there. */
const LOCATIONS_HREF = "/about#where-we-work";

/**
 * One editorial-band photo per page, rotated through the pool of 10 by the
 * page's position across all 19 local pages (13 cities, then the 6 local-SEO
 * pages), so neighbouring pages never repeat a frame.
 */
function bandFor(variant: LocalPageProps["variant"], slug: string) {
  const position =
    variant === "city"
      ? LOCATION_PAGES.findIndex((p) => p.slug === slug)
      : LOCATION_PAGES.length + LOCAL_SEO_PAGES.findIndex((p) => p.slug === slug);
  return EDITORIAL_BAND.length ? EDITORIAL_BAND[Math.max(position, 0) % EDITORIAL_BAND.length] : undefined;
}

const faqItems = (prefix: string, faqs: { question: string; answer: string }[]): AccordionItem[] =>
  faqs.map((faq, i) => ({ id: `${prefix}-${i + 1}`, question: faq.question, answer: faq.answer }));

/**
 * The location / local-SEO chapter page (DESIGN.md §10.16–10.17): text cover →
 * editorial band → numbered chapters → inquiry plate. Server component.
 */
export function LocalPage(props: LocalPageProps) {
  return props.variant === "city" ? <CityPage page={props.page} /> : <ServicePage page={props.page} />;
}

function Band({ variant, slug }: { variant: LocalPageProps["variant"]; slug: string }) {
  const band = bandFor(variant, slug);
  if (!band) return null;
  return <MediaFrame asset={band.id} ratio="3:2" sizes="(min-width:1200px) 72rem, 100vw" className="pg-local-band" />;
}

function Chapter({ id, number, eyebrow, title, paragraphs }: { id: string; number: string; eyebrow: string; title: string; paragraphs: string[] }) {
  return (
    <Section id={id} number={number} eyebrow={eyebrow} title={title}>
      <Prose dropcap>
        {paragraphs.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
      </Prose>
    </Section>
  );
}

function Services({ id, number, title, lead, items, location }: { id: string; number: string; title: string; lead: string; items: ServiceSlug[]; location: string }) {
  return (
    <Section id={id} number={number} eyebrow="Services" title={title} lead={lead} lazy>
      <ServicesIndex items={items} frame="none" location={location} />
    </Section>
  );
}

function CityPage({ page }: { page: LocationPage }) {
  const path = `/locations/${page.slug}`;
  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "Locations", href: LOCATIONS_HREF },
    { name: page.city, href: path },
  ];
  const others = LOCATION_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <div className="lux-page pg-local">
      <JsonLd data={locationBusinessSchema(page)} />
      <JsonLd data={speakableWebPageSchema(path, [`#${PAGE_TITLE_ID}`, ".lux-cover .lux-lead"], page.h1)} />

      <Cover
        size="text"
        eyebrow={page.city}
        title={page.h1}
        lead={page.intro}
        primary={{ href: "#inquire", cta: "location_cover_proposal" }}
        secondary={{
          href: getWhatsAppUrl(`Hello Nexyyra Events, I am planning an event in ${page.city}.`),
          label: "WhatsApp a planner",
          cta: "location_cover_whatsapp",
          external: true,
        }}
        breadcrumbs={crumbs}
      />

      <Band variant="city" slug={page.slug} />

      <Chapter id="how-we-work" number="01" eyebrow="How we work" title={`How we work in ${page.city}`} paragraphs={page.howWeWork} />

      <Services
        id="services"
        number="02"
        title={`Services in ${page.city}`}
        lead="Starting prices for the work we plan here. Travel and local supplier costs are itemised in your proposal."
        items={page.services}
        location={`location_${page.slug}`}
      />

      <Section id="questions" number="03" eyebrow="Questions" title={`Planning an event in ${page.city}`} lazy>
        <Accordion name={`faq-${page.slug}`} items={faqItems(`faq-${page.slug}`, getExpandedLocationFaqs(page))} schema />
      </Section>

      <Section id="other-cities" eyebrow="Locations" title="Other cities" space="block" lazy>
        <Ledger
          as="dl"
          columns={4}
          ariaLabel="Other cities we plan events in"
          rows={others.map((p) => ({ id: p.slug, term: p.city, href: `/locations/${p.slug}`, body: p.state }))}
        />
      </Section>

      <InquiryPanel source="contact" variant="compact" title={`Plan your event in ${page.city}`} defaultCity={page.city} />
    </div>
  );
}

function ServicePage({ page }: { page: LocalSeoPage }) {
  const path = `/${page.slug}`;
  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: page.title, href: path },
  ];
  const contextual = getLocalPageContextualLinks(page.slug);
  const links = contextual.length ? contextual : page.relatedLinks;

  return (
    <div className="lux-page pg-local">
      <JsonLd data={localBusinessSchemaForPage(page)} />
      <JsonLd data={speakableWebPageSchema(path, [`#${PAGE_TITLE_ID}`, ".lux-cover .lux-lead"], page.h1)} />

      <Cover
        size="text"
        eyebrow={page.eyebrow}
        title={page.h1}
        lead={page.intro}
        icon={<ServiceIcon name={page.icon} size={48} />}
        primary={{ href: "#inquire", cta: "local_cover_proposal" }}
        secondary={{
          href: getWhatsAppUrl(`Hello Nexyyra Events, I would like a proposal (${page.title}).`),
          label: "WhatsApp a planner",
          cta: "local_cover_whatsapp",
          external: true,
        }}
        breadcrumbs={crumbs}
      />

      <Band variant="service" slug={page.slug} />

      <Chapter id="brief" number="01" eyebrow="The brief" title="What this involves" paragraphs={page.brief} />

      <Services
        id="services"
        number="02"
        title="Relevant services"
        lead="The services this kind of brief draws on, with starting prices. Your proposal itemises every line."
        items={page.services}
        location={`local_${page.slug}`}
      />

      <Section id="commitments" number="03" eyebrow="Commitments" title="What you can hold us to" lazy>
        <Commitments variant="grid" />
      </Section>

      <Section id="questions" number="04" eyebrow="Questions" title="Before you inquire" lazy>
        <Accordion name={`faq-${page.slug}`} items={faqItems(`faq-${page.slug}`, getExpandedLocalFaqs(page))} schema />
      </Section>

      {links.length ? (
        <nav className="pg-local-links" aria-labelledby="related-pages-title">
          <p id="related-pages-title" className="lux-label lux-label--rule-leading">
            Related pages
          </p>
          <ul className="pg-local-links__list lux-small">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} prefetch={false} className="pg-local-links__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <InquiryPanel source="service" variant="compact" defaultEventType={localPageEventType(page)} />
    </div>
  );
}
