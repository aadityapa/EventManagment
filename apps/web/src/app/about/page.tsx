import { generateSEO, aboutPageSchema } from "@/lib/seo";
import { AboutView } from "@/brand";
import { teamMembers } from "@/data/cms";

export const metadata = generateSEO({
  title: "About — Luxury Event Management",
  description: "Discover Nexyyra Events — 12+ years, 1800+ events, India's premier luxury event house.",
  path: "/about",
});

export default function AboutPage() {
  const schema = aboutPageSchema(teamMembers, "Priya Sharma");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <AboutView />
    </>
  );
}
