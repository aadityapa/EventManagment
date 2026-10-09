import { HOME_FAQ_ITEMS } from "@/brand/data/faq";
import { Accordion, Button, Section, type AccordionItem } from "@/components/ui";

/** The six questions rendered here — the FAQPage JSON-LD mirrors exactly these. */
export const HOME_FAQS: AccordionItem[] = HOME_FAQ_ITEMS.slice(0, 6).map((faq, i) => ({
  id: `home-faq-${i + 1}`,
  question: faq.question,
  answer: faq.answer,
}));

/** Chapter 06: the remaining doubts before someone inquires. */
export function HomeFaq() {
  return (
    <Section
      id="questions"
      number="06"
      eyebrow="Questions"
      title="Common questions"
      actions={
        <Button variant="text" href="/faqs" cta="home_all_questions" location="home-faq" arrow>
          All questions
        </Button>
      }
      lazy
    >
      <Accordion name="home-faq" items={HOME_FAQS} schema className="lux-measure" />
    </Section>
  );
}
