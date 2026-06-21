import { generateSEO, itemListSchema } from "@/lib/seo";
import { PortfolioView } from "@/brand";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";

export const metadata = generateSEO({
  title: "Luxury Event Portfolio",
  description:
    "Explore Nexyyra case studies — palace weddings, corporate galas, concerts, and destination productions across Pune and India.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  const schema = itemListSchema(
    BRAND_CASE_STUDIES.map((c) => ({
      name: c.title,
      url: `/portfolio/${c.id}`,
      image: c.image,
    }))
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PortfolioView />
    </>
  );
}
