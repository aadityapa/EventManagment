import { LocalPage } from "@/brand/templates/local-page";
import { requireLocalSeoPage } from "@/lib/local-seo-pages";
import { generateSEO } from "@/lib/seo";

const SLUG = "luxury-wedding-planner-maharashtra";
const page = requireLocalSeoPage(SLUG);

export const metadata = generateSEO({
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  path: `/${SLUG}`,
});

export default function LuxuryWeddingPlannerMaharashtraPage() {
  return <LocalPage variant="service" page={page} />;
}
