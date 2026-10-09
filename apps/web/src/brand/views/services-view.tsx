import { BRAND_INVESTMENTS } from "@/brand/data/content";
import { GLITZ_FAQS } from "@/brand/data/faq";
import { assetForRole } from "@/brand/data/image-curation";
import { Accordion, Button, Cover, InquiryPanel, Ledger, ProcessLine, Section, ServicesIndex, Spread, type AccordionItem } from "@/components/ui";
import { getWhatsAppUrl } from "@/lib/utils";

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
];

/** "For celebrations of 50–150 guests …" → "50–150 guests": the guest band lives in the collection narrative. */
function guestBand(narrative: string): string | undefined {
  return narrative.match(/(\d[\d,]*(?:–\d[\d,]*)?\+?)\s+guests/)?.[0];
}

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** The three Services-category questions; the Accordion's FAQ schema mirrors exactly these. */
export const SERVICES_FAQ_ITEMS: AccordionItem[] = GLITZ_FAQS.filter((f) => f.category === "Services")
  .slice(0, 3)
  .map((f) => ({ id: `faq-${slugify(f.question).slice(0, 48)}`, question: f.question, answer: f.answer }));

/** `/services` (DESIGN.md §10.2): cover → the index → spread → method → investment → inquiry → questions. */
export function ServicesView() {
  const cover = assetForRole("cover-services")?.id;
  const spread = assetForRole("spread-services")?.id;

  const investment = BRAND_INVESTMENTS.map((c) => {
    const band = guestBand(c.narrative);
    return {
      id: slugify(c.name),
      term: c.name,
      body: <span className="lux-price">From {c.from}</span>,
      cells: band ? [band] : undefined,
    };
  });

  return (
    <div className="lux-page">
      <Cover
        eyebrow="Services"
        title="Twelve ways to celebrate, one accountable team"
        titleAccent="accountable"
        lead="Weddings, corporate events, brand experiences and production, planned and run in-house from Pune for venues across India and abroad. Every service carries a published starting price."
        primary={{ href: "/book-event", cta: "services_cover_proposal" }}
        secondary={{
          href: getWhatsAppUrl("Hello Nexyyra Events, I would like to talk to a planner about your services."),
          label: "WhatsApp a planner",
          cta: "services_cover_whatsapp",
          external: true,
        }}
        asset={cover}
        breadcrumbs={CRUMBS}
      />

      <Section
        id="index"
        number="01"
        eyebrow="The index"
        title="Every service, with its starting price"
        lead="Choose one service or combine several. Each price is where single-service production starts; your itemised proposal follows the free consultation."
      >
        <ServicesIndex items="all" grouped frame="all" location="services_index" />
      </Section>

      {spread ? <Spread asset={spread} /> : null}

      <Section
        id="method"
        number="02"
        eyebrow="How we work"
        title="Five steps, one event director"
        lead="The same method runs under every service, from the first call to the day after."
        lazy
      >
        <ProcessLine variant="compact" columns={2} />
      </Section>

      <Section
        id="investment"
        number="03"
        eyebrow="Investment"
        title="Three collections for full planning"
        lead="When you need more than one service, a collection brings planning, design and production together."
        actions={
          <Button variant="text" href="/pricing" cta="services_pricing" location="services_investment" arrow>
            Compare collections
          </Button>
        }
        lazy
      >
        <Ledger as="dl" rows={investment} className="pg-services-ledger" ariaLabel="Collections and starting prices" />
      </Section>

      <InquiryPanel id="inquire" source="service" variant="compact" />

      {SERVICES_FAQ_ITEMS.length ? (
        <Section
          id="questions"
          number="04"
          eyebrow="Questions"
          title="Before you choose a service"
          actions={
            <Button variant="text" href="/faqs" cta="services_all_faqs" location="services_questions" arrow>
              All questions
            </Button>
          }
          lazy
        >
          <Accordion name="services-faq" items={SERVICES_FAQ_ITEMS} schema className="lux-measure" />
        </Section>
      ) : null}
    </div>
  );
}
