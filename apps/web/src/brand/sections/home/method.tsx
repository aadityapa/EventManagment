import { ProcessLine, Section } from "@/components/ui";

/** Chapter 03: the five-step method, with the gold line drawing down the rail on scroll. */
export function HomeMethod() {
  return (
    <Section
      id="how-we-work"
      number="03"
      eyebrow="How we work"
      title="Five steps, one accountable lead"
      lead="Every engagement follows the same method, so you always know what happens next and who is answering."
      lazy
    >
      <ProcessLine variant="full" />
    </Section>
  );
}
