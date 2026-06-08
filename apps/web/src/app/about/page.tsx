import { generateSEO } from "@/lib/seo";
import { AboutView } from "@/brand";

export const metadata = generateSEO({ title: "About — Luxury Event Management", description: "Discover Glitz Events — 12+ years, 1800+ events, India's premier luxury event house.", path: "/about" });

export default function AboutPage() {
  return <AboutView />;
}
