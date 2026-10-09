import { BRAND_COMMITMENTS, BRAND_INVESTMENTS, BRAND_PRICE_TAX_NOTE, BRAND_REPLY_HOURS } from "@/brand/data/content";
import { faqsInCategory, toAccordionItems } from "@/brand/data/faq";
import { InlineBudgetCalculator, type CalculatorCollection } from "@/components/cro/budget-calculator";
import { Accordion, Button, Cover, InquiryPanel, Ledger, PriceTable, Section, collectionSlug } from "@/components/ui";
import { services } from "@/data/cms";
import { formatCurrency } from "@/lib/utils";

/** Guest band from a collection narrative ("…of 50–150 guests…") — never typed by hand. */
export function collectionGuests(narrative: string): string {
  const match = narrative.match(/(\d[\d,]*\s*[–-]\s*\d[\d,]*|\d[\d,]*\+)\s*guests/i);
  return match ? match[1].replace(/\s+/g, "") : "On request";
}

export const PRICING_FAQS = [...faqsInCategory("Packages"), ...faqsInCategory("Payment")];

const commitment = (id: (typeof BRAND_COMMITMENTS)[number]["id"]) => BRAND_COMMITMENTS.find((c) => c.id === id);

const BILLING_STEPS = [
  { term: "Free consultation", body: "In person, on video or at your venue — no obligation." },
  { term: commitment("proposal")?.term ?? "Itemised proposal in 48 hours", body: commitment("proposal")?.detail },
  { term: commitment("advance")?.term ?? "30% secures your date", body: commitment("advance")?.detail },
];

const SERVICES_BY_PRICE = [...services].sort((a, b) => a.basePrice - b.basePrice);

/** /pricing (DESIGN.md §10.9): one set of published prices, data-only — no toggle, no badge, no invented add-ons. */
export function PricingView() {
  const calculatorCollections: CalculatorCollection[] = BRAND_INVESTMENTS.map((c) => ({
    name: c.name,
    slug: collectionSlug(c.name),
    from: c.from,
    guests: collectionGuests(c.narrative),
  }));

  return (
    <div className="lux-page pg-conv">
      <Cover
        size="text"
        eyebrow="Investment"
        title="Published starting prices, itemised proposals"
        lead={`Published starting prices for three collections and twelve single services. ${BRAND_PRICE_TAX_NOTE}.`}
        primary={{ href: "#inquire", cta: "pricing_cover_proposal" }}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Pricing", href: "/pricing" },
        ]}
      />

      <Section
        id="collections"
        number="01"
        eyebrow="Collections"
        title="Three collections"
        lead="Each starts from a published price and scales with your guest list. After a free consultation, your proposal itemises every line."
      >
        <PriceTable />
      </Section>

      <Section
        id="single-services"
        number="02"
        eyebrow="Single services"
        title="One service, produced end to end"
        lead={`When you need one part of an event rather than all of it, each service starts from its published price. ${BRAND_PRICE_TAX_NOTE}.`}
        lazy
      >
        <PriceTable variant="services" location="single-services" className="lux-wide" />
      </Section>

      <Section id="billing" number="03" eyebrow="Billing" title="How billing works" lazy>
        <Ledger as="ol" numerals rows={BILLING_STEPS} className="lux-wide" ariaLabel="Billing, step by step" />
      </Section>

      <Section
        id="which-collection"
        number="04"
        eyebrow="Guide"
        title="Which collection fits"
        lead="Two questions point you to a collection and its budget band. Your planner confirms it at the consultation."
        lazy
      >
        <InlineBudgetCalculator collections={calculatorCollections} singleFrom={formatCurrency(SERVICES_BY_PRICE[0]?.basePrice ?? 0)} />
      </Section>

      <Section
        id="questions"
        number="05"
        eyebrow="Questions"
        title="Packages and payment"
        actions={
          <Button variant="text" href="/faqs" cta="pricing_all_faqs" location="pricing-faq" arrow>
            All questions
          </Button>
        }
        lazy
      >
        <Accordion name="pricing-faq" items={toAccordionItems(PRICING_FAQS, "pricing-faq")} schema className="lux-measure" />
      </Section>

      <InquiryPanel
        source="book_event"
        variant="compact"
        lead={`Share the brief. ${BRAND_REPLY_HOURS} Your itemised proposal follows within 48 hours of a free consultation.`}
        className="pg-conv-inquiry"
      />
    </div>
  );
}
