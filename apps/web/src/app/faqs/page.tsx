import Link from "next/link";
import { faqs } from "@/data/cms";
import { generateSEO, faqSchema } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Button } from "@/components/ui/button";

export const metadata = generateSEO({
  title: "FAQs",
  description:
    "Frequently asked questions about Glitz Events & Promotions — booking, payments, services, and more.",
  path: "/faqs",
});

export default function FaqsPage() {
  const schema = faqSchema(faqs);
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about planning with Glitz Events & Promotions"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {categories.map((category) => {
            const items = faqs.filter((f) => f.category === category);
            return (
              <div key={category} className="mb-12">
                <h2 className="mb-4 font-display text-xl font-semibold">{category}</h2>
                <FaqAccordion items={items} />
              </div>
            );
          })}

          <div className="mt-12 glass-card p-8 text-center">
            <h3 className="font-display text-xl font-bold">Still have questions?</h3>
            <p className="mt-2 text-muted">
              Our team is here to help you plan your perfect event.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
