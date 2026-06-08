import { PortfolioPageContent } from "@/components/pages/portfolio-page-content";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Event Portfolio — Luxury Celebrations",
  description: "Explore Glitz Events portfolio — weddings, corporate galas, concerts, and destination celebrations across India.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
