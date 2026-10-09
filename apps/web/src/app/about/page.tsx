import { AboutView } from "@/brand/views/about-view";
import { JsonLd } from "@/components/ui";
import { companyProfile } from "@/data/cms";
import { aboutPageSchema, generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "About — Weddings and Events Planned In-House",
  description:
    "Nexyyra Events and Promotions Private Limited (2026) designs and produces weddings, corporate events and celebrations in-house, from Pune across India.",
  path: "/about",
});

// Facts-only AboutPage; the breadcrumb JSON-LD comes from the cover's Breadcrumbs.
const aboutSchema = aboutPageSchema({ description: companyProfile.introduction });

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutSchema} />
      <AboutView />
    </>
  );
}
