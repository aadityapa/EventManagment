import { assetForRole } from "@/brand/data/image-curation";
import { Button, MediaFrame, Prose, Section } from "@/components/ui";
import { ENTITY_FACTS, SITE_CONFIG } from "@/lib/constants";

/** "English, Hindi and Marathi" */
const LANGUAGES = ENTITY_FACTS.languages.slice(0, -1).join(", ") + " and " + ENTITY_FACTS.languages.at(-1);

/**
 * Chapter 02: what the house is, in facts only — incorporation, in-house
 * design and production, languages, where we plan. Carries the page's one Deck.
 */
export function HomeAbout() {
  const portrait = assetForRole("house-portrait");
  return (
    <Section
      id="about"
      number="02"
      eyebrow="About"
      title="Design, production and the day itself, under one roof"
      deck="One accountable team, from the first conversation to the last guest home."
      lazy
    >
      <div className="lux-grid pg-home-about">
        <div className="pg-home-about__copy">
          <Prose dropcap>
            <p>
              Nexyyra Events is the trade name of {SITE_CONFIG.legalName}, incorporated in 2026. We plan, design and
              produce weddings, corporate events and private celebrations, and we run them on the day.
            </p>
            <p>
              Design and production sit in-house, so the people who draw your plan are the people who build it. One
              event director leads every engagement, and consultations run in {LANGUAGES}.
            </p>
            <p>
              We coordinate from Pune and plan across India, from Mumbai and Delhi to Jaipur, Udaipur and Goa, as
              well as at destinations abroad.
            </p>
          </Prose>
          <Button variant="text" href="/about" cta="home_about" location="home-about" arrow className="pg-home-about__link">
            About the house
          </Button>
        </div>
        {portrait ? (
          <MediaFrame
            asset={portrait.id}
            ratio="4:5"
            sizes="(min-width:1024px) 34vw, (min-width:768px) 42vw, 100vw"
            className="pg-home-about__media lux-col-offset"
          />
        ) : null}
      </div>
    </Section>
  );
}
