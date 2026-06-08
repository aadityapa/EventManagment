import { generateSEO } from "@/lib/seo";
import { FaqsView } from "@/brand";

export const metadata = generateSEO({ title: "FAQs", description: "Frequently asked questions about luxury event planning with Glitz Events.", path: "/faqs" });

export default function FaqsPage() {
  return <FaqsView />;
}
