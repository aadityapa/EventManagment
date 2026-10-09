import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { Button, ConceptBanner, ConceptCard, Section, Strand } from "@/components/ui";

/**
 * Chapter 04: the three illustrative concepts. The banner and the chapter
 * hairline keep them apart from the real photography above (the diptych);
 * a snap strand on phones, a row of three from 768px.
 */
export function HomeConcepts() {
  return (
    <Section
      id="concepts"
      number="04"
      eyebrow="Concepts"
      title="The scale we plan for"
      lead="Three illustrative briefs: a palace wedding, a corporate gala and a beachfront ceremony."
      actions={
        <Button variant="text" href="/portfolio" cta="home_portfolio" location="home-concepts" arrow>
          See the portfolio
        </Button>
      }
      lazy
    >
      <ConceptBanner className="pg-home-concepts__banner" />
      <Strand ariaLabel="Illustrative concepts" snap="mandatory">
        {BRAND_CASE_STUDIES.map((study) => (
          <li key={study.id}>
            <ConceptCard study={study} location="home-concepts" />
          </li>
        ))}
      </Strand>
    </Section>
  );
}
