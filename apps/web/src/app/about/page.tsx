import { generateSEO, breadcrumbSchema, aboutPageSchema } from "@/lib/seo";
import { TEAM_MEMBERS } from "@/data/team";
import { AboutView } from "@/brand";

export const metadata = generateSEO({
  title: "About — Luxury Event Management",
  description: "Discover Nexyyra Events — the team, philosophy and process behind a full-service luxury event management company serving Pune and all of India.",
  path: "/about",
});

export default function AboutPage() {
  const schema = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]);
  const teamSchema = aboutPageSchema(
    TEAM_MEMBERS.map(({ name, role, bio, image }) => ({ name, role, bio, image })),
    "Yash Bajaj",
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }} />
      <AboutView />
    </>
  );
}
