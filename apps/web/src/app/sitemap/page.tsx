import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { blogPosts, services } from "@/data/cms";
import { BrandHeader, BrandSection } from "@/brand/primitives/brand-section";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { LOCAL_SEO_PAGES } from "@/lib/local-seo-pages";
import { LOCATION_PAGES } from "@/lib/location-pages";
import { generateSEO, collectionPageSchema, itemListSchema, pageGraphSchema } from "@/lib/seo";
import { SITEMAP_CHILDREN } from "@/lib/sitemap-entries";

export const metadata = generateSEO({
  title: "HTML Sitemap",
  description:
    "Browse Nexyyra Events services, locations, blog guides, portfolio case studies, and XML sitemap feeds.",
  path: "/sitemap",
});

const CORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Nexyyra" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/venues", label: "Venues" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

const groups = [
  { title: "Core Pages", links: CORE_LINKS },
  { title: "Services", links: services.map((s) => ({ href: `/services/${s.slug}`, label: s.title })) },
  { title: "Locations", links: LOCATION_PAGES.map((p) => ({ href: `/locations/${p.slug}`, label: `${p.city} Events` })) },
  { title: "Local SEO Pages", links: LOCAL_SEO_PAGES.map((p) => ({ href: `/${p.slug}`, label: p.title })) },
  { title: "Recent Blog Guides", links: blogPosts.map((p) => ({ href: `/blog/${p.slug}`, label: p.title })) },
  { title: "Portfolio", links: BRAND_CASE_STUDIES.map((cs) => ({ href: `/portfolio/${cs.id}`, label: cs.title })) },
] as const;

export default function HtmlSitemapPage() {
  const allLinks = groups.flatMap((group) => group.links.map((link) => ({ name: link.label, url: link.href })));
  const sitemapLd = pageGraphSchema(
    collectionPageSchema(
      "Nexyyra Events HTML Sitemap",
      "/sitemap",
      "A crawlable index of Nexyyra Events services, locations, blog guides, portfolio, and sitemap feeds.",
    ),
    itemListSchema(allLinks),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sitemapLd) }} />
      <div className="brand-root">
        <section className="border-b border-[var(--glitz-border)] bg-[var(--glitz-surface)] py-16 md:py-24">
          <div className="brand-container">
            <span className="brand-label">Sitemap</span>
            <h1 className="brand-display mt-4 max-w-4xl text-[clamp(2.25rem,5vw,4rem)] font-bold leading-tight text-primary">
              Explore Nexyyra Events
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-secondary">
              Browse every important public page, including services, city pages, planning guides,
              and XML feeds used by search engines.
            </p>
          </div>
        </section>

        <BrandSection>
          <div className="grid gap-6 lg:grid-cols-2">
            {groups.map((group) => (
              <GlassPanel key={group.title} className="p-6 sm:p-8">
                <h2 className="brand-display text-2xl font-semibold text-primary">{group.title}</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-start gap-2 text-sm font-medium text-secondary transition-colors hover:text-[var(--glitz-gold)]"
                      >
                        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--glitz-gold)]" aria-hidden="true" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            ))}
          </div>
        </BrandSection>

        <BrandSection alt>
          <BrandHeader
            label="XML Feeds"
            title="Search Engine Sitemaps"
            subtitle="Google should be submitted the sitemap index, while these child sitemaps remain directly discoverable."
            center
          />
          <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
            <a
              href="/sitemap.xml"
              className="rounded-full border border-[var(--glitz-border)] px-5 py-2.5 text-sm font-semibold text-secondary transition-colors hover:border-[var(--glitz-gold)] hover:text-[var(--glitz-gold)]"
            >
              Sitemap Index
            </a>
            {SITEMAP_CHILDREN.map((sitemap) => (
              <a
                key={sitemap.path}
                href={sitemap.path}
                className="rounded-full border border-[var(--glitz-border)] px-5 py-2.5 text-sm font-semibold text-secondary transition-colors hover:border-[var(--glitz-gold)] hover:text-[var(--glitz-gold)]"
              >
                {sitemap.id} sitemap
              </a>
            ))}
          </div>
        </BrandSection>
      </div>
    </>
  );
}
