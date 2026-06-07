import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { services } from "@/data/cms";
import { generateSEO, breadcrumbSchema } from "@/lib/seo";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
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

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = services.filter((s) => s.slug !== slug).slice(0, 3);
  const schema = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: service.title, url: `/services/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="relative flex min-h-[50vh] items-end overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        <div className="container relative mx-auto max-w-7xl px-4 pb-12 pt-32 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-primary">
            <DynamicIcon name={service.icon} className="h-8 w-8" />
            <span className="text-sm font-medium uppercase tracking-wider">Service</span>
          </div>
          <h1 className="mt-2 font-display text-4xl font-bold text-white md:text-5xl">
            {service.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">{service.description}</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold">What&apos;s Included</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <div key={feature} className="glass-card flex items-center gap-3 p-4">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-muted leading-relaxed">
                Our {service.title.toLowerCase()} service delivers a premium, end-to-end experience.
                From initial consultation through flawless execution, JIJU Events handles every detail
                so you can focus on what matters most — enjoying your extraordinary event.
              </p>
            </div>

            <div className="glass-card h-fit p-6 shadow-glow">
              <p className="text-sm text-muted">Starting from</p>
              <p className="font-display text-3xl font-bold gradient-text">
                {formatCurrency(service.basePrice)}
              </p>
              <p className="mt-2 text-sm text-muted">
                Custom packages available based on your requirements.
              </p>
              <Button className="mt-6 w-full" size="lg" asChild>
                <Link href="/book-event">Book This Service</Link>
              </Button>
              <Button className="mt-3 w-full" variant="outline" asChild>
                <Link href="/contact">Request Quote</Link>
              </Button>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-display text-2xl font-bold">Related Services</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {related.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="glass-card group flex items-center gap-3 p-4 transition-all hover:shadow-glow"
                  >
                    <DynamicIcon name={s.icon} className="h-6 w-6 text-primary" />
                    <span className="font-medium group-hover:text-primary">{s.title}</span>
                    <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
