import { Accordion, Button, Section } from "@/components/ui";
import type { ServiceFaq } from "@/data/service-faqs";

type ServiceFaqSectionProps = {
  faqs: ServiceFaq[];
  serviceTitle: string;
  slug: string;
  number?: string;
};

/** "Questions" chapter of a service page; the Accordion emits FAQ JSON-LD for exactly the rendered items. */
export function ServiceFaqSection({ faqs, serviceTitle, slug, number }: ServiceFaqSectionProps) {
  if (!faqs.length) return null;
  const items = faqs.map((f, i) => ({ id: `${slug}-faq-${i + 1}`, question: f.question, answer: f.answer }));

  return (
    <Section
      id="questions"
      number={number}
      eyebrow="Questions"
      title={`Common questions about ${serviceTitle.toLowerCase()}`}
      actions={
        <Button variant="text" href="/faqs" cta="service_all_faqs" location={`service_${slug}`} arrow>
          All questions
        </Button>
      }
      lazy
    >
      <Accordion name="service-faq" items={items} schema className="lux-measure" />
    </Section>
  );
}
