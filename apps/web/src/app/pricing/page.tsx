import { BRAND_INVESTMENTS } from "@/brand/data/content";
import { PricingView } from "@/brand";
import { JsonLd } from "@/components/ui";
import { services } from "@/data/cms";
import { generateSEO, offerCatalogSchema } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Pricing — Collections and Single Services",
  description:
    "Published starting prices: Boutique Experience from ₹10 Lakhs, Signature Gala from ₹35 Lakhs, Grand Masterpiece from ₹1 Crore+. Single services from ₹2 Lakhs. Itemised proposal within 48 hours of a free consultation.",
  path: "/pricing",
  keywords: [
    "Event Planner Pricing Pune",
    "Wedding Planner Cost Pune",
    "Corporate Event Budget India",
    "Event Management Packages",
  ],
});

/* The FAQ JSON-LD is emitted by the page's Accordion (exactly the rendered
   items); the offer catalogue mirrors the price table and the service ledger. */
export default function PricingPage() {
  return (
    <>
      <JsonLd data={offerCatalogSchema(BRAND_INVESTMENTS, services)} />
      <PricingView />
    </>
  );
}
