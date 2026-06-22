import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MapPin, Phone } from "lucide-react";
import { BrandButton } from "@/brand/primitives/brand-button";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { generateSEO, breadcrumbSchema, faqSchema, speakableWebPageSchema } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import {
  getLocationPage,
  getExpandedLocationFaqs,
  locationBusinessSchema,
  LOCATION_PAGES,
} from "@/lib/location-pages";

type Props = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return LOCATION_PAGES.map((p) => ({ city: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { city } = await params;
  const page = getLocationPage(city);
  if (!page) return {};
  return generateSEO({
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    path: `/locations/${page.slug}`,
  });
}

export default async function LocationPage({ params }: Props) {
  const { city } = await params;
  const page = getLocationPage(city);
  if (!page) notFound();

  const expandedFaqs = getExpandedLocationFaqs(page);
  const path = `/locations/${page.slug}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([{ name: "Home", url: "/" }, { name: page.city, url: path }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(expandedFaqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(locationBusinessSchema(page)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableWebPageSchema(path, ["h1", ".brand-display + p"])) }} />

      <section className="border-b border-[var(--glitz-border)] bg-[var(--glitz-surface)] py-16 md:py-24">
        <div className="brand-container">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-[var(--glitz-gold)]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/locations/pune" className="hover:text-[var(--glitz-gold)]">Locations</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-primary">{page.city}</li>
            </ol>
          </nav>

          <span className="brand-label">{page.city}, {page.state}</span>
          <h1 className="brand-display mt-4 max-w-4xl text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-primary">
            {page.h1}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-secondary">{page.intro}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <BrandButton href="/book-event">Book Free Consultation <ArrowRight className="h-4 w-4" /></BrandButton>
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--glitz-border)] px-6 py-3 text-sm font-semibold text-[var(--glitz-gold)] transition-colors hover:bg-[var(--glitz-gold)]/10"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {SITE_CONFIG.phone}
            </a>
          </div>
        </div>
      </section>

      <BrandSection>
        <BrandHeader
          label={page.city}
          title={`Luxury Events in ${page.city}`}
          subtitle={`${SITE_CONFIG.name} serves ${page.city} with weddings, corporate experiences, and destination celebrations.`}
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {page.highlights.map((item) => (
            <li key={item} className="brand-surface flex items-start gap-3 p-5">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--glitz-gold)]" aria-hidden="true" />
              <span className="text-secondary">{item}</span>
            </li>
          ))}
        </ul>
      </BrandSection>

      <BrandSection alt>
        <BrandHeader label="FAQ" title={`${page.city} Event Planning — FAQs`} center />
        <div className="mx-auto max-w-3xl space-y-6">
          {expandedFaqs.map((faq) => (
            <article key={faq.question} className="brand-surface p-6" itemScope itemType="https://schema.org/Question">
              <h2 className="brand-display text-lg font-semibold text-primary" itemProp="name">{faq.question}</h2>
              <p className="mt-3 text-secondary leading-relaxed" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <span itemProp="text">{faq.answer}</span>
              </p>
            </article>
          ))}
        </div>
      </BrandSection>

      <BrandSection>
        <BrandHeader label="Nearby" title="Other Locations We Serve" center />
        <div className="flex flex-wrap justify-center gap-3">
          {LOCATION_PAGES.filter((l) => l.slug !== page.slug).map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="rounded-full border border-[var(--glitz-border)] px-5 py-2.5 text-sm font-medium text-secondary transition-colors hover:border-[var(--glitz-gold)] hover:text-[var(--glitz-gold)]"
            >
              {loc.city}
            </Link>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted">
          <MapPin className="mb-1 inline h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />{" "}
          Headquartered in Pune · Serving India and international destinations.{" "}
          <Link href="/contact" className="text-[var(--glitz-gold)] hover:underline">Contact us</Link>.
        </p>
      </BrandSection>
    </>
  );
}
