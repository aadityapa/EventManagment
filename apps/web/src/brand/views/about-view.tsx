import { assetForRole, assetsByRole, withoutDuplicates } from "@/brand/data/image-curation";
import {
  Button,
  Commitments,
  Cover,
  Heading,
  InquiryPanel,
  Ledger,
  ProcessLine,
  Prose,
  Section,
  Spread,
  type LedgerRow,
} from "@/components/ui";
import { companyProfile } from "@/data/cms";
import { ENTITY_FACTS } from "@/lib/constants";
import { LOCATION_PAGES } from "@/lib/location-pages";
import { getWhatsAppUrl } from "@/lib/utils";

/** Service-area entries that are regions, not cities — said in prose instead of listed. */
const REGION_AREAS = new Set(["Maharashtra", "India", "International destinations"]);
const listOf = (items: readonly string[]) => new Intl.ListFormat("en-GB", { type: "conjunction" }).format(items);

const CITIES = ENTITY_FACTS.serviceAreas.filter((area) => !REGION_AREAS.has(area));
const REACH = `Planners work in ${listOf(ENTITY_FACTS.languages)}. Events are planned in ${listOf(CITIES)}, elsewhere in India and at international destinations.`;

const PURPOSE = [
  { id: "vision", title: "Vision", copy: companyProfile.vision },
  { id: "mission", title: "Mission", copy: companyProfile.mission },
  { id: "philosophy", title: "Philosophy", copy: companyProfile.philosophy },
] as const;

const CITY_ROWS: LedgerRow[] = LOCATION_PAGES.map((page) => ({
  id: page.slug,
  term: page.city,
  body: page.state,
  href: `/locations/${page.slug}`,
}));

const WHATSAPP_MESSAGE = "Hello Nexyyra Events, I would like to talk to a planner about my event.";

/**
 * /about (DESIGN.md §10.7): what the house is, in facts only. The people
 * chapter is omitted — no names are verified against the MCA filing — and
 * there is no founder story, no stock team photography, no track record.
 */
export function AboutView() {
  const cover = assetForRole("cover-about");
  // One photo per page: the spread must not repeat the cover (or a near-duplicate of it).
  const spread = withoutDuplicates(assetsByRole("spread-about"), cover ? [cover.id] : [])[0];

  return (
    <div className="lux-page">
      <Cover
        eyebrow="About"
        title="A house built for the next era of celebrations"
        titleAccent="next era"
        lead={companyProfile.introduction}
        asset={cover?.id}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
        primary={{ href: "#inquire", cta: "about_cover_proposal" }}
        secondary={{ href: getWhatsAppUrl(WHATSAPP_MESSAGE), label: "WhatsApp a planner", cta: "about_cover_whatsapp", external: true }}
      />

      <Section
        id="house"
        number="01"
        eyebrow="The house"
        title="One company, from design to delivery"
        deck="Every celebration we plan is designed, produced and run by the same house."
      >
        <div className="lux-grid lux-grid--ruled pg-about-essay">
          <Prose dropcap className="lux-col-text">
            <p>{companyProfile.story}</p>
            <p>{companyProfile.scope}</p>
          </Prose>
          <Prose className="lux-col-media">
            <p>{companyProfile.inHouse}</p>
            <p>{REACH}</p>
          </Prose>
        </div>
      </Section>

      <Section id="purpose" number="02" eyebrow="Purpose" title="Vision, mission and philosophy" lazy>
        <div className="lux-grid lux-grid--ruled pg-about-pillars">
          {PURPOSE.map((item) => (
            <div key={item.id} className="pg-about-pillar">
              <Heading as="h3" size="h3">
                {item.title}
              </Heading>
              <p className="pg-about-pillar__copy">{item.copy}</p>
            </div>
          ))}
        </div>
      </Section>

      {spread ? <Spread asset={spread.id} /> : null}

      <Section
        id="method"
        number="03"
        eyebrow="How we work"
        title="Five steps from brief to wrap"
        lead="The same method at every scale: one brief, one itemised plan, one director accountable for the day."
        lazy
      >
        <ProcessLine variant="full" />
      </Section>

      <Section
        id="where-we-work"
        number="04"
        eyebrow="Where we work"
        title="From Pune, across India and abroad"
        lead="Each city below has its own planning page. Anywhere else in India, or abroad, is planned the same way, with travel and logistics in the proposal."
        lazy
      >
        <Ledger as="dl" columns={4} rows={CITY_ROWS} ariaLabel="Cities with a planning page" className="lux-wide" />
      </Section>

      <Section
        id="commitments"
        number="05"
        eyebrow="Commitments"
        title="What you can hold us to"
        lead="Policies the company sets and keeps, written down before you book."
        lazy
      >
        <Commitments variant="grid" />
        <div className="pg-about-cta">
          <Button variant="text" href="/book-event" cta="about_commitments_proposal" location="about_commitments" arrow>
            Get a Free Proposal
          </Button>
        </div>
      </Section>

      <InquiryPanel id="inquire" source="contact" variant="compact" className="pg-about-inquiry" />
    </div>
  );
}
