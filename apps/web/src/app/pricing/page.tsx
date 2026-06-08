import { PricingPageContent } from "@/components/pages/pricing-page-content";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Investment Collections",
  description: "Luxury event investment tiers — Boutique Experience, Signature Gala, and Grand Masterpiece collections.",
  path: "/pricing",
});

export default function PricingPage() {
  return <PricingPageContent />;
}
