import { AboutPageContent } from "@/components/pages/about-page-content";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "About Us — Luxury Event Management Pune",
  description: "Discover Glitz Events & Promotions — India's premier luxury event house. 12+ years, 1800+ events, trusted by leading brands and families.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
