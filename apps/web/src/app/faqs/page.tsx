import Link from "next/link";
import { faqs } from "@/data/cms";
import { faqSchema, generateSEO } from "@/lib/seo";
import { CinematicHero } from "@/components/shared/cinematic-hero";
import { PageSection } from "@/components/shared/page-section";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/lib/images";

export const metadata = generateSEO({
  title: "Frequently Asked Questions",
  description: "Answers to common questions about luxury event planning with Glitz Events & Promotions.",
  path: "/faqs",
});

export default function FaqsPage() {
  const schema = faqSchema(faqs);
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <CinematicHero
        label="Support"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about planning with Glitz Events."
        image={IMAGES.corporate[1]}
        size="full"
      />
      <PageSection>
        <div className="mx-auto max-w-3xl">
          {categories.map((category) => {
            const items = faqs.filter((f) => f.category === category);
            return (
              <div key={category} className="mb-12">
                <h2 className="mb-4 font-display text-xl font-semibold text-primary">{category}</h2>
                <FaqAccordion items={items} />
              </div>
            );
          })}
          <div className="luxury-card p-8 text-center">
            <h3 className="font-display text-xl font-bold">Still have questions?</h3>
            <p className="mt-2 text-muted">Our team is here to help you plan your perfect event.</p>
            <Button className="mt-4" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
