import { generateSEO } from "@/lib/seo";
import { PricingView } from "@/brand";

export const metadata = generateSEO({ title: "Investment Collections", description: "Luxury event investment tiers — Boutique, Signature Gala, Grand Masterpiece.", path: "/pricing" });

export default function PricingPage() {
  return <PricingView />;
}
