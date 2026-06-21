import { Suspense } from "react";
import { notFound } from "next/navigation";
import { services } from "@/data/cms";
import { getServiceFaqs } from "@/data/service-faqs";
import { generateSEO, breadcrumbSchema, serviceSchema, faqSchema } from "@/lib/seo";
import { ServiceChapter } from "@/brand/templates/service-chapter";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ world?: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return generateSEO({ title: "Service Not Found", noIndex: true });

  return generateSEO({
    title: service.title,
    description: service.description,
    path: `/services/${slug}`,
    image: service.image,
  });
}

export default async function ServiceDetailPage({ params, searchParams }: ServiceDetailPageProps) {
  const { slug } = await params;
  const { world } = await searchParams;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const serviceFaqs = getServiceFaqs(slug);
  const related = services.filter((s) => s.slug !== slug).slice(0, 3);
  const schema = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Experiences", url: "/services" },
    { name: service.title, url: `/services/${slug}` },
  ]);
  const svcSchema = serviceSchema({
    name: service.title,
    description: service.description,
    slug: service.slug,
    image: service.image,
    price: service.basePrice,
  });
  const faqLd = serviceFaqs.length > 0 ? faqSchema(serviceFaqs) : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(svcSchema) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      <Suspense fallback={null}>
        <ServiceChapter
          service={service}
          faqs={serviceFaqs}
          related={related}
          world={world ?? null}
        />
      </Suspense>
    </>
  );
}
