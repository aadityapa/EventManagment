import { FaqsView } from "@/brand";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "FAQs — Before You Inquire",
  description:
    "Answers on free consultations, starting prices, the 30% advance and milestone billing, destination weddings, vendors and privacy at Nexyyra Events.",
  path: "/faqs",
});

export default function FaqsPage() {
  return <FaqsView />;
}
