import { generateSEO, itemListSchema } from "@/lib/seo";
import { PortfolioView } from "@/brand";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { getPortfolioMedia } from "@/lib/media/server";
import { mergeWithStaticFallback } from "@/lib/media/fallback";
import { BRAND_IMAGES } from "@/brand/data/imagery";

export const metadata = generateSEO({
  title: "Luxury Event Portfolio",
  description:
    "Explore Nexyyra case studies — palace weddings, corporate galas, concerts, and destination productions across Pune and India.",
  path: "/portfolio",
});

export const revalidate = 60;

export default async function PortfolioPage() {
  const portfolioMedia = await getPortfolioMedia();
  const liveMedia = mergeWithStaticFallback(
    portfolioMedia,
    [...BRAND_IMAGES.weddings.slice(0, 4), ...BRAND_IMAGES.corporate.slice(0, 4)],
    "portfolio"
  );

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
      <PortfolioView liveMedia={liveMedia} />
    </>
  );
}
