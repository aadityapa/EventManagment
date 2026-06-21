import Link from "next/link";
import { ArrowRight, Check, MapPin, Phone } from "lucide-react";
import { BrandButton } from "@/brand/primitives/brand-button";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import type { LocalSeoPage } from "@/lib/local-seo-pages";
import { SITE_CONFIG } from "@/lib/constants";
import { breadcrumbSchema, faqSchema, speakableWebPageSchema } from "@/lib/seo";
import { getExpandedLocalFaqs, localBusinessSchemaForPage } from "@/lib/local-seo-pages";
import { getLocalPageContextualLinks } from "@/lib/wedding-internal-links";
import { ContextualLinksBlock } from "@/components/seo/contextual-links-block";

interface LocalSeoPageContentProps {
  page: LocalSeoPage;
}

export function LocalSeoPageContent({ page }: LocalSeoPageContentProps) {
  const expandedFaqs = getExpandedLocalFaqs(page);
  const contextualLinks = getLocalPageContextualLinks(page.slug);
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: page.title, url: `/${page.slug}` },
  ]);
  const faqs = faqSchema(expandedFaqs);
  const localBiz = localBusinessSchemaForPage(page);
  const speakable = speakableWebPageSchema(`/${page.slug}`, ["h1", ".brand-display + p"]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBiz) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakable) }} />

      <section className="border-b border-[var(--glitz-border)] bg-[var(--glitz-surface)] py-16 md:py-24">
        <div className="brand-container">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-[var(--glitz-gold)]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-primary">{page.title}</li>
            </ol>
          </nav>

          <span className="brand-label">{SITE_CONFIG.city}, {SITE_CONFIG.region}</span>
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
          label="Why Nexyyra"
          title={`${page.title} — What Sets Us Apart`}
          subtitle="Entity definition: Nexyyra Events is a luxury event management company based in Pune, Maharashtra, serving clients across India since 2012."
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
        <BrandHeader label="FAQ" title="Frequently Asked Questions" center />
        <div className="mx-auto max-w-3xl space-y-6">
          {expandedFaqs.map((faq) => (
            <article key={faq.question} className="brand-surface p-6">
              <h2 className="brand-display text-lg font-semibold text-primary">{faq.question}</h2>
              <p className="mt-3 text-secondary leading-relaxed">{faq.answer}</p>
            </article>
          ))}
        </div>
      </BrandSection>

      <BrandSection>
        {contextualLinks.length > 0 ? (
          <div className="mx-auto max-w-3xl">
            <ContextualLinksBlock title="Related Services & Pages" links={contextualLinks} />
          </div>
        ) : (
          <>
            <BrandHeader label="Explore" title="Related Services & Pages" center />
            <div className="flex flex-wrap justify-center gap-3">
              {page.relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-[var(--glitz-border)] px-5 py-2.5 text-sm font-medium text-secondary transition-colors hover:border-[var(--glitz-gold)] hover:text-[var(--glitz-gold)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </>
        )}
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted">
          <MapPin className="mb-1 inline h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />{" "}
          Serving {SITE_CONFIG.city}, {SITE_CONFIG.region}, and destinations across India.{" "}
          <Link href="/contact" className="text-[var(--glitz-gold)] hover:underline">Contact our Pune office</Link>.
        </p>
      </BrandSection>
    </>
  );
}
