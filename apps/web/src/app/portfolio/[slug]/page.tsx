import { notFound } from "next/navigation";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { ConceptCaseView } from "@/brand/views/portfolio-view";
import { JsonLd } from "@/components/ui";
import { creativeWorkSchema, generateSEO } from "@/lib/seo";

type PortfolioCasePageProps = {
  params: Promise<{ slug: string }>;
};

// Only the three concepts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return BRAND_CASE_STUDIES.map((cs) => ({ slug: cs.id }));
}

type CaseStudy = (typeof BRAND_CASE_STUDIES)[number];

/** Complete sentences within 160 characters — the story is too long to follow the concept label. */
const metaDescription = (study: CaseStudy) =>
  `${study.title}, an illustrative concept and not a delivered event: ${study.guests.toLocaleString("en-IN")} guests, ${study.timeline.toLowerCase()}, ${study.venue.toLowerCase()}. The brief, the challenge and our approach.`;

export async function generateMetadata({ params }: PortfolioCasePageProps) {
  const { slug } = await params;
  const study = BRAND_CASE_STUDIES.find((c) => c.id === slug);
  if (!study) notFound();
  return generateSEO({
    title: `${study.title} · Illustrative Concept`,
    description: metaDescription(study),
    path: `/portfolio/${slug}`,
  });
}

export default async function PortfolioCasePage({ params }: PortfolioCasePageProps) {
  const { slug } = await params;
  const study = BRAND_CASE_STUDIES.find((c) => c.id === slug);
  if (!study) notFound();

  // Breadcrumb JSON-LD comes from the cover's Breadcrumbs; this is the only other node.
  const work = creativeWorkSchema({
    name: `Illustrative concept: ${study.title}`,
    description: `Illustrative concept, not a delivered event. ${study.story}`,
    slug,
    image: study.image,
    genre: study.category,
  });

  return (
    <>
      <JsonLd data={work} />
      <ConceptCaseView study={study} />
    </>
  );
}
