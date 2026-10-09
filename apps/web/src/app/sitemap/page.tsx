import Link from "next/link";
import { BRAND_CASE_STUDIES } from "@/brand/data/content";
import { LEGAL_DOCS, LegalShell } from "@/brand/templates/legal-page";
import { ConceptTag, JsonLd, Section } from "@/components/ui";
import { blogPosts, services } from "@/data/cms";
import { LOCAL_SEO_PAGES } from "@/lib/local-seo-pages";
import { LOCATION_PAGES } from "@/lib/location-pages";
import { generateSEO, collectionPageSchema, itemListSchema, pageGraphSchema } from "@/lib/seo";
import { SITEMAP_CHILDREN } from "@/lib/sitemap-entries";

const DESCRIPTION = "Every public page on the Nexyyra Events website: services, cities, planning guides, concepts and policies.";

export const metadata = generateSEO({
  title: "Sitemap",
  description: DESCRIPTION,
  path: "/sitemap",
});

type LinkGroup = { id: string; title: string; concept?: boolean; links: { href: string; label: string }[] };

const GROUPS: LinkGroup[] = [
  {
    id: "core",
    title: "Main pages",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/why-nexyyra", label: "Why Nexyyra" },
      { href: "/company", label: "Company information" },
      { href: "/pricing", label: "Pricing" },
      { href: "/faqs", label: "Questions" },
      { href: "/contact", label: "Contact" },
      { href: "/book-event", label: "Get a Free Proposal" },
    ],
  },
  {
    id: "services",
    title: "Services",
    links: [{ href: "/services", label: "All services" }, ...services.map((s) => ({ href: `/services/${s.slug}`, label: s.title }))],
  },
  {
    id: "cities",
    title: "Cities",
    links: LOCATION_PAGES.map((p) => ({ href: `/locations/${p.slug}`, label: p.city })),
  },
  {
    id: "maharashtra",
    title: "Pune & Maharashtra",
    links: LOCAL_SEO_PAGES.map((p) => ({ href: `/${p.slug}`, label: p.title })),
  },
  {
    id: "journal",
    title: "Journal",
    links: [{ href: "/blog", label: "Planning notes" }, ...blogPosts.map((p) => ({ href: `/blog/${p.slug}`, label: p.title }))],
  },
  {
    id: "portfolio",
    title: "Portfolio",
    links: [
      { href: "/portfolio", label: "Concepts and the archive" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  {
    // Case studies are illustrative — the group carries the Concept tag.
    id: "concepts",
    title: "Concepts",
    concept: true,
    links: BRAND_CASE_STUDIES.map((cs) => ({ href: `/portfolio/${cs.id}`, label: cs.title })),
  },
  {
    id: "policies",
    title: "Policies",
    links: Object.values(LEGAL_DOCS).map((d) => ({ href: d.href, label: d.title })),
  },
];

export default function HtmlSitemapPage() {
  const sitemapLd = pageGraphSchema(
    collectionPageSchema({ name: "Nexyyra Events sitemap", path: "/sitemap", description: DESCRIPTION }),
    itemListSchema(GROUPS.flatMap((g) => g.links.map((l) => ({ name: l.label, url: l.href })))),
  );

  return (
    <LegalShell
      eyebrow="Sitemap"
      title="Every page, in one place"
      lead="Services, cities, planning guides, concepts and policies, grouped by topic."
      path="/sitemap"
    >
      <JsonLd data={sitemapLd} />

      <Section id="pages" eyebrow="Pages" title="Browse the site">
        <div className="pg-legal-groups">
          {GROUPS.map((group) => (
            <section key={group.id} className="pg-legal-group" aria-labelledby={`sitemap-${group.id}`}>
              <h3 id={`sitemap-${group.id}`} className="pg-legal-group__title">
                {group.title}
                {/* The tag is visual; the heading's accessible name gets one
                    plain phrase instead of running "Concepts" into "Concept". */}
                {group.concept ? (
                  <>
                    <span className="sr-only">, illustrative, not delivered events</span>
                    <span aria-hidden="true">
                      <ConceptTag />
                    </span>
                  </>
                ) : null}
              </h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} prefetch={false} className="pg-legal-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      <Section
        id="feeds"
        eyebrow="For search engines"
        title="Machine-readable sitemaps"
        lead="The same pages in the XML format search engines read. Visitors can use the links above."
        space="block"
        lazy
      >
        <ul className="pg-legal-feeds">
          <li>
            <a href="/sitemap.xml" className="pg-legal-link">
              Everything (XML)
            </a>
          </li>
          {SITEMAP_CHILDREN.map((feed) => (
            <li key={feed.path}>
              <a href={feed.path} className="pg-legal-link">
                {feed.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </LegalShell>
  );
}
