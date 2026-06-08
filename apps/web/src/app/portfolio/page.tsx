import { generateSEO } from "@/lib/seo";
import { PortfolioView } from "@/brand";

export const metadata = generateSEO({ title: "Portfolio — Luxury Case Studies", description: "Explore extraordinary events crafted by Glitz Events across India.", path: "/portfolio" });

export default function PortfolioPage() {
  return <PortfolioView />;
}
