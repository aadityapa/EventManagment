import { LocalPage } from "@/brand/templates/local-page";
import { requireLocalSeoPage } from "@/lib/local-seo-pages";
import { generateSEO } from "@/lib/seo";

const SLUG = "exhibition-management-pune";
const page = requireLocalSeoPage(SLUG);

export const metadata = generateSEO({
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  path: `/${SLUG}`,
});

export default function ExhibitionManagementPunePage() {
  return <LocalPage variant="service" page={page} />;
}
