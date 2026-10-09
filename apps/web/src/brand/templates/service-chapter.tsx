import Link from "next/link";
import { assetForRole, assetsForService, withoutDuplicates } from "@/brand/data/image-curation";
import { ServiceIcon } from "@/components/icons";
import { ServiceFaqSection } from "@/components/services/service-faq-section";
import {
  Commitments,
  Cover,
  InquiryPanel,
  Ledger,
  Lightbox,
  PhotoName,
  MediaFrame,
  ProcessLine,
  Prose,
  Section,
  SERVICE_GROUPS,
  ServicesIndex,
  Strand,
} from "@/components/ui";
import type { services } from "@/data/cms";
import { getServiceFaqs } from "@/data/service-faqs";
import { SERVICE_EVENT_TYPE } from "@/lib/inquiry";
import { formatCurrency } from "@/lib/utils";
import { getServiceContextualLinks, getServicePageIntro } from "@/lib/wedding-internal-links";

export type Service = (typeof services)[number];

/** Canonical order of the twelve (the index's numbering), so the folio matches the row numeral on /services. */
const ORDER: readonly string[] = SERVICE_GROUPS.flatMap((g) => g.slugs);

/** Three neighbours: same index group first, then the rest in index order. */
function relatedSlugs(slug: string): string[] {
  const group = SERVICE_GROUPS.find((g) => (g.slugs as readonly string[]).includes(slug));
  const sameGroup = ((group?.slugs ?? []) as readonly string[]).filter((s) => s !== slug);
  const rest = ORDER.filter((s) => s !== slug && !sameGroup.includes(s));
  return [...sameGroup, ...rest].slice(0, 3);
}

/** `/services/[slug]` (DESIGN.md §10.3). Server only; the Lightbox is the one island, mounted with the gallery. */
export function ServiceChapter({ service }: { service: Service }) {
  const { slug, title } = service;
  const position = ORDER.indexOf(slug) + 1;
  const price = `From ${formatCurrency(service.basePrice)}`;
  const intro = getServicePageIntro(slug);
  const faqs = getServiceFaqs(slug);
  const contextual = getServiceContextualLinks(slug);

  // Local cover (LCP); the gallery shows only real photographs of this service and never repeats the cover.
  const cover = assetForRole(`service-cover-${slug}`)?.id;
  const gallery = withoutDuplicates(assetsForService(slug), cover ? [cover] : []).slice(0, 6);

  const included = service.features.map((feature, i) => ({
    id: `included-${i + 1}`,
    term: feature,
    body: service.featureNotes[i],
  }));

  const links = [
    ...contextual.map((l) => ({ href: l.href, label: l.label })),
    { href: "/services", label: "All twelve services" },
    { href: "/pricing", label: "Collections and prices" },
  ];

  return (
    <div className="lux-page">
      <Cover
        eyebrow="Services"
        title={title}
        lead={service.description}
        primary={{ href: "#inquire", cta: `service_${slug}_cover_proposal` }}
        asset={cover}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: title, href: `/services/${slug}` },
        ]}
        folio={position > 0 ? `${String(position).padStart(2, "0")} / 12` : undefined}
        icon={<ServiceIcon name={slug} size={48} />}
        priceLine={price}
        viewTransitionName={`service-title-${slug}`}
      />

      <Section id="brief" number="01" eyebrow="The brief" title="What this service covers" lead={intro}>
        <div className="pg-services-brief">
          <Prose dropcap className="pg-services-brief__copy">
            <p>{service.narrative}</p>
          </Prose>
          <aside className="pg-services-brief__aside" aria-labelledby="brief-expect">
            <p id="brief-expect" className="lux-label lux-label--rule-leading">
              What to expect
            </p>
            <Commitments variant="grid" />
          </aside>
        </div>
      </Section>

      <Section
        id="included"
        number="02"
        eyebrow="What's included"
        title="What the service includes"
        lead={`Each line is priced in your itemised proposal. Single-service production starts ${price.toLowerCase()}.`}
        lazy
      >
        <Ledger as="dl" columns={2} rows={included} ariaLabel={`${title}: what is included`} />
      </Section>

      <Section id="method" number="03" eyebrow="How we deliver" title="Five steps from brief to the day" lazy>
        <div className="pg-services-method">
          <ProcessLine variant="compact" />
        </div>
      </Section>

      {gallery.length ? (
        <Section
          id="photographs"
          eyebrow="Gallery"
          title="Photographs"
          lead="Photographs from Nexyyra productions and venue walkthroughs. Select one to view it larger."
          lazy
        >
          {/* Tiles render inside the Lightbox so PhotoName can hand each tile's
              view-transition name to the viewer while that photo is open, and
              each tile carries the id its #photo- link targets (works without JS). */}
          <Lightbox assets={gallery.map(({ id, src, alt, caption, width, height }) => ({ id, src, alt, caption, width, height }))}>
            <Strand ariaLabel={`${title} photographs`}>
              {gallery.map((a) => (
                <li key={a.id} id={`photo-${a.id}`}>
                  <a href={`#photo-${a.id}`} className="pg-services-photo" data-tilt="soft">
                    <PhotoName id={a.id}>
                      <MediaFrame asset={a.id} ratio="3:2" sizes="(min-width:768px) 33vw, 78vw" />
                    </PhotoName>
                  </a>
                </li>
              ))}
            </Strand>
          </Lightbox>
        </Section>
      ) : null}

      <ServiceFaqSection faqs={faqs} serviceTitle={title} slug={slug} number="04" />

      <Section id="related" eyebrow="Related" title="Services that pair with this one" lazy>
        <ServicesIndex items={relatedSlugs(slug)} variant="related" frame="none" location={`service_${slug}_related`} />
        <nav className="pg-services-links" aria-label="More on this topic">
          <ul role="list">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} prefetch={false} data-cta={`service_link_${l.href.replace(/\W+/g, "_")}`} data-cta-location={`service_${slug}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <InquiryPanel
        id="inquire"
        source="service"
        variant="compact"
        defaultEventType={SERVICE_EVENT_TYPE[slug]}
        eyebrow={`${title} · Free consultation`}
        priceLine={price}
      />
    </div>
  );
}
