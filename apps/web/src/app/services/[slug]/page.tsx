import { notFound } from "next/navigation";
import { ServiceChapter } from "@/brand/templates/service-chapter";
import { JsonLd } from "@/components/ui";
import { services } from "@/data/cms";
import { SITE_CONFIG } from "@/lib/constants";
import { generateSEO, serviceSchema } from "@/lib/seo";
import { getServiceSeo } from "@/lib/wedding-internal-links";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

/** Per-service OG cards (1200×630) live in public/brand/og — one for each of the twelve slugs. */
const ogImage = (slug: string) => `/brand/og/service-${slug}.png`;

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

// Only the twelve published services exist; any other slug is a real 404, not an on-demand render.
export const dynamicParams = false;

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const seo = getServiceSeo(slug);
  return generateSEO({
    title: seo?.title ?? service.title,
    description: seo?.description ?? service.description,
    path: `/services/${slug}`,
    image: ogImage(slug),
    twitterImage: ogImage(slug),
  });
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  // Breadcrumb and FAQ JSON-LD come from the rendered Breadcrumbs and Accordion; only the Service node is page-level.
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: service.title,
          description: service.description,
          slug: service.slug,
          image: `${SITE_CONFIG.url}${ogImage(slug)}`,
          startingPrice: service.basePrice,
        })}
      />
      <ServiceChapter service={service} />
    </>
  );
}
