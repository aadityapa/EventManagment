import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { BRAND_REPLY_HOURS } from "@/brand/data/reply-hours";
import { assetForRole, type CurationAsset } from "@/brand/data/image-curation";
import {
  Button,
  ConceptBanner,
  ConceptCard,
  ConceptTag,
  Cover,
  Deck,
  Diptych,
  Gallery,
  Heading,
  InquiryPanel,
  Ledger,
  MediaFrame,
  Prose,
  Reveal,
  Section,
  TabsRadio,
  venueTypeOf,
  type CaseStudy,
  type LedgerRow,
} from "@/components/ui";
import { ARCHIVE_FILTERS } from "@/lib/media/query-readonly";

/** The concept's planning scale; venue *type* only, never a venue name (DESIGN.md §1.2). */
function specRows(study: CaseStudy): LedgerRow[] {
  return [
    { id: "venue", term: "Venue type", body: venueTypeOf(study) },
    { id: "guests", term: "Planned guests", body: study.guests.toLocaleString("en-IN") },
    { id: "duration", term: "Duration", body: study.timeline },
    { id: "budget", term: "Budget band", body: study.budget },
  ];
}

/** Concept category → the InquiryForm event type it pre-selects. */
const EVENT_TYPE_BY_CATEGORY: Record<string, string> = {
  Wedding: "WEDDING",
  Corporate: "CORPORATE",
  Destination: "DESTINATION_WEDDING",
};

const REFERENCES_LEAD =
  `Ask for references from recent productions at your consultation. ${BRAND_REPLY_HOURS}`;

/* ── /portfolio ─────────────────────────────────────────────────────── */

type PortfolioViewProps = {
  /** Real photographs for the archive chapter — never a concept frame or the cover. */
  archive: CurationAsset[];
};

export function PortfolioView({ archive }: PortfolioViewProps) {
  const cover = assetForRole("cover-portfolio");
  return (
    <div className="lux-page">
      <Cover
        eyebrow="Portfolio"
        title="Concepts and the archive"
        lead="The three studies below are illustrative concepts that show the scale we plan, not delivered events. The archive is real photography from Nexyyra productions and venue walkthroughs."
        primary={{ href: "#inquire", cta: "portfolio_cover_proposal" }}
        secondary={{ href: "#archive", label: "See the archive", cta: "portfolio_cover_archive" }}
        asset={cover?.id}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Portfolio", href: "/portfolio" },
        ]}
      />

      <ConceptBanner className="pg-portfolio-banner" />

      <Section
        id="concepts"
        number="01"
        eyebrow="Concepts"
        title="Three illustrative concepts"
        lead="A palace wedding, a corporate gala and a beach ceremony, each planned on paper to show how we would run it."
      >
        <ol className="pg-portfolio-concepts">
          {BRAND_CASE_STUDIES.map((study, i) => (
            <li key={study.id}>
              <ConceptSpread study={study} index={i} />
            </li>
          ))}
        </ol>
      </Section>

      {/* The hairline and heading of this chapter are the visible divider between concepts and real photographs. */}
      <Section
        id="archive"
        number="02"
        eyebrow="The archive"
        title="Real photography from our productions"
        lead="Photographs from Nexyyra productions and venue walkthroughs. Select any frame to view it full screen."
        lazy
      >
        <div className="pg-portfolio-archive">
          <TabsRadio
            name="archive"
            items={ARCHIVE_FILTERS.map((f) => ({ value: f.value, label: f.label }))}
            defaultValue="all"
            legend="Show photographs"
          />
          <Gallery assets={archive} />
        </div>
        <p className="pg-portfolio-more">
          <Button variant="text" href="/gallery" cta="portfolio_gallery" location="archive" arrow>
            Browse the full archive
          </Button>
        </p>
      </Section>

      <InquiryPanel source="contact" variant="compact" eyebrow="References on request" lead={REFERENCES_LEAD} className="pg-portfolio-inquiry" />
    </div>
  );
}

/** Photo cols 1–7 (shared `concept-{id}` name for the morph to the case cover), text cols 8–12. */
function ConceptSpread({ study, index }: { study: CaseStudy; index: number }) {
  const asset = assetForRole(`concept-${study.id}`);
  const caption = `Illustrative concept · ${study.category}`;
  const sizes = "(min-width:1024px) 58vw, 100vw";
  return (
    <Reveal as="article" index={index} className="pg-portfolio-concept">
      {asset ? (
        <div className="pg-portfolio-concept__media">
          {/* By src, not id: this frame's local export is a 4:5 crop at 768w, wrong for a 3:2 box on phones. */}
          <MediaFrame
            src={asset.src}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            focal={asset.focal}
            ratio="3:2"
            sizes={sizes}
            caption={caption}
            viewTransitionName={`concept-${study.id}`}
          />
        </div>
      ) : null}
      <div className="pg-portfolio-concept__text">
        <p className="pg-portfolio-concept__meta">
          <ConceptTag />
          <span className="lux-small">{study.category}</span>
        </p>
        <Heading as="h3">{study.title}</Heading>
        <p className="pg-portfolio-concept__story">{study.story}</p>
        <Ledger as="dl" columns={2} rows={specRows(study)} ariaLabel={`${study.title} planning specifications`} />
        <Button variant="text" href={`/portfolio/${study.id}`} cta={`concept_${study.id}`} location="portfolio_concepts" arrow>
          Read the concept
        </Button>
      </div>
    </Reveal>
  );
}

/* ── /portfolio/[slug] ──────────────────────────────────────────────── */

export function ConceptCaseView({ study }: { study: CaseStudy }) {
  const cover = assetForRole(`concept-${study.id}`);
  const left = assetForRole(`case-${study.id}-l`);
  const right = assetForRole(`case-${study.id}-r`);
  const others = BRAND_CASE_STUDIES.filter((s) => s.id !== study.id);
  const venueType = venueTypeOf(study).toLowerCase();

  return (
    <div className="lux-page">
      <Cover
        icon={<ConceptTag />}
        eyebrow={`${study.category} concept`}
        title={study.title}
        lead={study.story}
        primary={{ href: "#inquire", cta: `case_${study.id}_cover_proposal` }}
        secondary={{ href: "/portfolio#concepts", label: "All concepts", cta: `case_${study.id}_cover_concepts` }}
        asset={cover?.id}
        mediaViewTransitionName={`concept-${study.id}`}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Portfolio", href: "/portfolio" },
          { name: study.title, href: `/portfolio/${study.id}` },
        ]}
      />

      <div className="pg-portfolio-specs">
        <Ledger
          as="dl"
          columns={2}
          ariaLabel="Concept specifications"
          rows={[
            { id: "status", term: "Status", body: "Illustrative concept, not a delivered event" },
            { id: "category", term: "Category", body: study.category },
            ...specRows(study),
          ]}
        />
      </div>

      <Section id="brief" number="01" eyebrow="The brief" title={`${study.guests.toLocaleString("en-IN")} guests, ${study.timeline.toLowerCase()}, a ${venueType}`}>
        <Prose dropcap>
          <p>{study.story}</p>
          <p>
            This is an illustrative concept. It shows the scale and structure we plan for, not an event we have
            delivered. Ask for references from recent productions at your consultation.
          </p>
        </Prose>
      </Section>

      <Section id="challenge" number="02" eyebrow="The challenge" title="What makes it demanding">
        <Prose>
          <p>{study.challenge}</p>
        </Prose>
      </Section>

      <Deck className="pg-portfolio-deck">One director, one schedule, and every line priced before you commit.</Deck>

      <Section id="approach" number="03" eyebrow="The approach" title="How we would plan it">
        <Prose>
          <p>{study.solution}</p>
        </Prose>
      </Section>

      <Section id="shows" number="04" eyebrow="What this shows" title="What it says about how we work">
        <Prose>
          <p>{study.result}</p>
        </Prose>
      </Section>

      {left && right ? <Diptych left={left.id} right={right.id} className="pg-portfolio-diptych" /> : null}

      <Section id="other-concepts" eyebrow="Concepts" title="Other concepts" lazy>
        <ul className="pg-portfolio-others">
          {others.map((s) => (
            <li key={s.id}>
              <ConceptCard study={s} location="case_other_concepts" />
            </li>
          ))}
        </ul>
      </Section>

      <InquiryPanel
        source="book_event"
        variant="compact"
        defaultEventType={EVENT_TYPE_BY_CATEGORY[study.category]}
        eyebrow="Free consultation"
        title="Plan an event on this scale"
        lead={REFERENCES_LEAD}
        className="pg-portfolio-inquiry"
      />
    </div>
  );
}
