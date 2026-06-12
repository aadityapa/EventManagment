import { generateSEO } from "@/lib/seo";
import { getLocalSeoPage } from "@/lib/local-seo-pages";
import { LocalSeoPageContent } from "@/components/shared/local-seo-page";
import { notFound } from "next/navigation";

const SLUG = "event-management-company-pune";
const page = getLocalSeoPage(SLUG);
if (!page) throw new Error(`Missing local SEO page: ${SLUG}`);

export const metadata = generateSEO({
  title: page.title,
  description: page.description,
  keywords: page.keywords,
  path: `/${SLUG}`,
});

export default function EventManagementCompanyPunePage() {
  if (!page) notFound();
  return <LocalSeoPageContent page={page} />;
}
