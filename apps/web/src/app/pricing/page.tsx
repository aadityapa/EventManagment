import { generateSEO, faqSchema, offerCatalogSchema } from "@/lib/seo";
import { PricingView } from "@/brand";
import { GLITZ_FAQS } from "@/brand/data/faq";
import { BRAND_INVESTMENTS } from "@/brand/data/content";

export const metadata = generateSEO({
  title: "Investment Collections",
  description: "Luxury event investment tiers — Boutique, Signature Gala, Grand Masterpiece. Packages from ₹10 lakhs.",
  path: "/pricing",
  keywords: [
    "Luxury Event Pricing Pune",
    "Wedding Planner Cost Pune",
    "Corporate Event Budget India",
    "Event Management Packages",
  ],
});

export default function PricingPage() {
  const faqLd = faqSchema(GLITZ_FAQS.map((f) => ({ question: f.question, answer: f.answer })));
  const offersLd = offerCatalogSchema(
    BRAND_INVESTMENTS.map((tier) => ({
      name: tier.name,
      description: tier.narrative,
      price: `From ${tier.from}`,
    })),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offersLd) }} />
      <PricingView />
    </>
  );
}
