import { AboutView } from "@/brand/views/about-view";
import { JsonLd } from "@/components/ui";
import { companyProfile } from "@/data/cms";
import { TEAM_MEMBERS } from "@/data/team";
import { aboutPageSchema, generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "About — Luxury Event Management",
  description:
    "Discover Nexyyra Events — the team, philosophy and process behind a full-service luxury event management company serving Pune and all of India.",
  path: "/about",
});

// AboutPage + a Person node for each of the six members rendered in "Meet Our
// Leadership"; the breadcrumb JSON-LD comes from the hero's Breadcrumbs.
const aboutSchema = aboutPageSchema({ description: companyProfile.introduction, people: TEAM_MEMBERS });

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutSchema} />
      <AboutView />
    </>
  );
}
