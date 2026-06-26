import { generateSEO, breadcrumbSchema } from "@/lib/seo";
import { AboutView } from "@/brand";

export const metadata = generateSEO({
  title: "About — Luxury Event Management",
  description: "Discover Nexyyra Events — 12+ years, 1800+ events, India's premier luxury event house.",
  path: "/about",
});

export default function AboutPage() {
  const schema = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <AboutView />
    </>
  );
}
