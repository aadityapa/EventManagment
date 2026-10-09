import { BRAND_REPLY_HOURS } from "@/brand/data/content";
import { FAQ_CATEGORIES, faqSlug, faqsInCategory, toAccordionItems } from "@/brand/data/faq";
import { Accordion, Cover, InquiryPanel, JsonLd, OnThisPage, Section } from "@/components/ui";
import { faqSchema } from "@/lib/seo";

const GROUPS = FAQ_CATEGORIES.map((category, i) => {
  const slug = faqSlug(category);
  return {
    category,
    id: `faq-${slug}`,
    number: String(i + 1).padStart(2, "0"),
    items: toAccordionItems(faqsInCategory(category), `faq-${slug}`),
  };
}).filter((g) => g.items.length > 0);

/**
 * /faqs (DESIGN.md §10.10): contents list beside one accordion per category.
 * One FAQPage JSON-LD covers every rendered question — a FAQPage per group
 * would be flagged as duplicate FAQPage markup by search engines.
 */
export function FaqsView() {
  const rendered = GROUPS.flatMap((g) => g.items);

  return (
    <div className="lux-page pg-conv">
      <JsonLd data={faqSchema(rendered.map((item) => ({ question: item.question, answer: item.answer })))} />
      <Cover
        size="text"
        eyebrow="Questions"
        title="Before you inquire"
        lead={`Straight answers on consultations, prices, payment and how we plan. If yours is not here, ask us. ${BRAND_REPLY_HOURS}`}
        primary={{ href: "#inquire", cta: "faqs_cover_proposal" }}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "FAQs", href: "/faqs" },
        ]}
      />

      <div className="lux-grid pg-conv-faqs">
        <OnThisPage items={GROUPS.map((g) => ({ href: `#${g.id}`, label: g.category }))} className="pg-conv-faqs__nav" />
        <div className="pg-conv-faqs__groups">
          {GROUPS.map((g, i) => (
            <Section key={g.id} id={g.id} number={g.number} title={g.category} space="block" lazy={i > 1}>
              <Accordion name={g.id} items={g.items} />
            </Section>
          ))}
        </div>
      </div>

      <InquiryPanel
        source="contact"
        variant="compact"
        eyebrow="Still deciding"
        title="Ask us directly"
        className="pg-conv-inquiry"
      />
    </div>
  );
}
