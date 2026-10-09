import { BRAND_REPLY_HOURS } from "@/brand/data/content";
import { assetForRole } from "@/brand/data/image-curation";
import { Commitments, Cover, InquiryPanel, Ledger, ProcessLine, Prose, Section, Spread } from "@/components/ui";

/* "What we don't do": ONLY the policy statements the owner approved in
   writing. Add a line here only with the same written approval. */
const APPROVED_POLICIES = [
  { term: "No hidden fees", body: "Every line is itemised before you sign." },
  { term: "No payment before a conversation", body: "The consultation is free." },
  { term: "No vendor mark-ups hidden in your quote", body: "Each vendor cost sits on its own line." },
  { term: "No second-hand accountability", body: "One event director owns your event." },
];

/**
 * /why-nexyyra (DESIGN.md §10.11, replaces /testimonials): commitments and
 * process, never reviews. No quotes, no ratings, no client names.
 */
export function WhyView() {
  const cover = assetForRole("cover-why")?.id;
  const spread = assetForRole("spread-why")?.id;

  return (
    <div className="lux-page pg-conv">
      <Cover
        eyebrow="Why Nexyyra"
        title="What working with us is like"
        lead="This page sets out our commitments and the way we work. It is not a page of reviews — ask for references at your consultation."
        primary={{ href: "#inquire", cta: "why_cover_proposal" }}
        asset={cover}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Why Nexyyra", href: "/why-nexyyra" },
        ]}
      />

      <Section
        id="commitments"
        number="01"
        eyebrow="Commitments"
        title="Our commitments"
        lead="Policies we control and keep on every event, whatever its size."
      >
        <Commitments variant="grid" expanded />
      </Section>

      <Section
        id="one-team"
        number="02"
        eyebrow="One team"
        title="One accountable team"
        deck="Fewer hand-offs. Clearer numbers. One person who answers for the day."
        lazy
      >
        <Prose dropcap>
          <p>
            Nexyyra Events designs and produces in-house. The people who draw your décor plan are the people who build it,
            light it and run it on the night, so nothing is lost between a planner, a designer and a production crew.
          </p>
          <p>
            One event director leads your event from the first conversation to the final wrap. You have one number to call,
            and one person who answers for every vendor, every cue and every rupee.
          </p>
          <p>
            Proposals are itemised. Venue, décor, production, hospitality and our fee each sit on their own line, agreed
            before you sign — no hidden fees, and no vendor mark-ups folded into someone else&apos;s quote.
          </p>
        </Prose>
      </Section>

      <Section id="how-we-work" number="03" eyebrow="How we work" title="Five steps, one line of sight" lazy>
        <ProcessLine />
      </Section>

      {spread ? <Spread asset={spread} /> : null}

      <Section id="what-we-dont-do" number="04" eyebrow="Policies" title="What we don't do" lazy>
        <Ledger as="dl" columns={2} rows={APPROVED_POLICIES} className="lux-wide" />
      </Section>

      <InquiryPanel
        source="contact"
        variant="compact"
        eyebrow="References"
        title="Ask for references"
        lead={`Ask for references from recent events during your consultation. ${BRAND_REPLY_HOURS}`}
        className="pg-conv-inquiry"
      />
    </div>
  );
}
