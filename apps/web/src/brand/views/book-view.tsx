import { BRAND_COMMITMENTS, BRAND_REPLY_HOURS } from "@/brand/data/content";
import { UiIcon } from "@/components/icons";
import { Button, Commitments, Cover, Eyebrow, Heading, InquiryPanel, Ledger, Section } from "@/components/ui";
import { getWhatsAppUrl } from "@/lib/utils";

export type BookCollection = { name: string; from: string; guests: string };

type BookViewProps = {
  defaultEventType?: string;
  /** The collection named by `?collection=` — shown read-only above the form. */
  collection?: BookCollection;
};

const detail = (id: (typeof BRAND_COMMITMENTS)[number]["id"]) => BRAND_COMMITMENTS.find((c) => c.id === id)?.detail;

const NEXT_STEPS = [
  { term: "Same-day reply", body: detail("reply") ?? BRAND_REPLY_HOURS },
  { term: "Free consultation", body: "In person, on video or at your venue. No obligation, no payment." },
  { term: "Itemised proposal in 48 hours", body: detail("proposal") ?? "Every line priced after your free consultation." },
];

/**
 * /book-event (DESIGN.md §10.13). A conversation comes before any payment:
 * the page collects a brief and starts one. The budget estimator lives on
 * /pricing and is not repeated here.
 */
export function BookView({ defaultEventType, collection }: BookViewProps) {
  return (
    <div className="lux-page pg-conv">
      <Cover
        size="text"
        eyebrow="Free consultation"
        title="Tell us about your event"
        lead={`${BRAND_REPLY_HOURS} Then a free consultation, and your itemised proposal within 48 hours of it.`}
        primary={{ href: "#inquire", cta: "book_cover_proposal" }}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Book an event", href: "/book-event" },
        ]}
      />

      <div className="pg-conv-split pg-conv-split--book">
        <div className="pg-conv-split__main">
          {collection ? (
            <p className="pg-conv-note" role="note">
              You are asking about <strong>{collection.name}</strong> — from {collection.from}, {collection.guests} guests.
              Your planner starts from this collection; add anything else in your message.
            </p>
          ) : null}
          <InquiryPanel
            source="book_event"
            variant="full"
            defaultEventType={defaultEventType}
            collection={collection?.name}
            defaultGuests={collection?.guests}
            eyebrow="Your brief"
            title="Share the brief"
            lead="Two minutes is enough: the occasion, the date, the guest count and a budget band. We take it from there."
          />
        </div>

        <section className="pg-conv-split__aside pg-conv-next" aria-labelledby="next-steps-title">
          <Eyebrow>What happens next</Eyebrow>
          <Heading as="h2" size="h3" id="next-steps-title">
            Three steps to your proposal
          </Heading>
          <Ledger as="ol" numerals rows={NEXT_STEPS} />
        </section>
      </div>

      <Section id="commitments" number="01" eyebrow="Commitments" title="What you can expect" lazy>
        <Commitments variant="grid" />
        <p className="pg-conv-after">
          <Button
            variant="text"
            href={getWhatsAppUrl("Hello Nexyyra Events, I would like a free proposal for my event.")}
            external
            cta="book_whatsapp"
            location="book-commitments"
            icon={<UiIcon name="whatsapp" size={20} />}
          >
            Prefer WhatsApp? Message a planner
          </Button>
        </p>
      </Section>
    </div>
  );
}
