import Link from "next/link";
import { GLITZ_FAQS } from "@/brand/data/faq";
import { AEO_FEATURED_FAQS } from "@/lib/geo-content";
import { faqSchema } from "@/lib/seo";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection } from "@/brand/primitives/brand-section";
import { BrandFaqAccordion } from "@/brand/primitives/brand-faq-accordion";
import { BRAND_IMAGES } from "@/brand/data/imagery";

const AEO_FAQ_ITEMS = AEO_FEATURED_FAQS.map((f) => ({ ...f, category: "Popular Questions" }));
const ALL_FAQS = [...AEO_FAQ_ITEMS, ...GLITZ_FAQS];

export function FaqsView() {
  const schema = faqSchema(ALL_FAQS);
  const categories = Array.from(new Set(ALL_FAQS.map((f) => f.category)));

  return (
    <div className="brand-root">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <BrandPageHero label="Support" title="Frequently Asked Questions" subtitle="Everything about planning with Nexyyra Events." image={BRAND_IMAGES.corporate[1]} />
      <BrandSection>
        <div className="mx-auto max-w-3xl">
          {categories.map((cat) => (
            <div key={cat} className="mb-12">
              <h2 className="mb-4 brand-display text-xl font-semibold text-[var(--glitz-gold)]">{cat}</h2>
              <BrandFaqAccordion items={ALL_FAQS.filter((f) => f.category === cat)} location="faqs_page" />
            </div>
          ))}
          <div className="brand-surface p-8 text-center">
            <h3 className="brand-display text-xl font-bold">Still have questions?</h3>
            <Link href="/contact" className="mt-4 inline-block rounded-lg bg-[var(--glitz-gold)] px-8 py-3 text-sm font-semibold text-[#0A0A0A]">Contact Us</Link>
          </div>
        </div>
      </BrandSection>
    </div>
  );
}
