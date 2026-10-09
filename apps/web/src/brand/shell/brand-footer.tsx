/* eslint-disable @next/next/no-img-element -- pre-sized WebP wordmark with its own srcset; nothing to optimise */
import Link from "next/link";
import { UiIcon } from "@/components/icons";
import { DetailsOpenAtDesktop } from "@/components/ui";
import { blogPosts, services } from "@/data/cms";
import { ENTITY_FACTS, FOOTER_LEGAL, SITE_CONFIG } from "@/lib/constants";
import { LOCAL_SEO_PAGES } from "@/lib/local-seo-pages";
import { LOCATION_PAGES } from "@/lib/location-pages";
import { MAIL_HREF, TEL_HREF, WHATSAPP_HREF, WORDMARK } from "./nav-data";

type FooterLink = { href: string; label: string };

const QUICK_LINKS: FooterLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/gallery", label: "Gallery" },
  { href: "/pricing", label: "Pricing" },
  { href: "/why-nexyyra", label: "Why Nexyyra" },
  { href: "/faqs", label: "FAQs" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/book-event", label: "Get a Free Proposal" },
];

// The six Pune/Maharashtra landing pages sit with the city pages: same geographic intent.
const GROUPS: { title: string; links: FooterLink[] }[] = [
  { title: "Quick links", links: QUICK_LINKS },
  { title: "Services", links: services.map((s) => ({ href: `/services/${s.slug}`, label: s.title })) },
  {
    title: "Locations",
    links: [
      ...LOCATION_PAGES.map((p) => ({ href: `/locations/${p.slug}`, label: p.city })),
      ...LOCAL_SEO_PAGES.map((p) => ({ href: `/${p.slug}`, label: p.title })),
    ],
  },
  { title: "Guides", links: blogPosts.slice(-6).map((p) => ({ href: `/blog/${p.slug}`, label: p.title })) },
];

const AREA_SUMMARY = new Set(["Maharashtra", "India", "International destinations"]);
const CITIES = ENTITY_FACTS.serviceAreas.filter((a) => !AREA_SUMMARY.has(a));

/**
 * Footer colophon (DESIGN.md §10.0) — a server component; its only client code
 * is DetailsOpenAtDesktop, which collapses the link groups into an exclusive
 * `<details name="footer">` accordion on phones. The groups are server-rendered
 * open (without `name`, so parsing does not close all but one) so crawlers and
 * desktop first paint see every link. Every discovery link skips prefetch.
 * "Cookie settings" re-opens the consent banner (see CookieConsent).
 * Social: Instagram only — the other profiles are unverified.
 */
export function BrandFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="pg-shell-footer">
      <div className="pg-shell-footer__inner">
        <div className="pg-shell-colophon">
          <div className="pg-shell-colophon__brand">
            <Link href="/" prefetch={false} className="pg-shell-wordmark" aria-label={`${SITE_CONFIG.shortName} — Home`}>
              <img src={WORDMARK.src} srcSet={WORDMARK.srcSet} sizes="72px" alt="" width={WORDMARK.width} height={WORDMARK.height} loading="lazy" decoding="async" />
            </Link>
            <p className="pg-shell-colophon__tagline">{SITE_CONFIG.tagline}</p>
            <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" className="pg-shell-footer__social" data-cta="footer_instagram" data-cta-location="footer">
              <UiIcon name="instagram" size={20} />
              Instagram
            </a>
          </div>

          <dl className="pg-shell-colophon__facts">
            <div>
              <dt>Company</dt>
              <dd>
                {SITE_CONFIG.legalName}
                <br />
                CIN {SITE_CONFIG.cin}
              </dd>
            </div>
            <div>
              <dt>Registered office</dt>
              <dd>
                {SITE_CONFIG.streetAddress}, {SITE_CONFIG.city}, {SITE_CONFIG.region} {SITE_CONFIG.postalCode}
              </dd>
            </div>
            <div>
              <dt>Operations</dt>
              <dd>Delivery &amp; Coordination Office — Pune</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd className="pg-shell-colophon__contact">
                <a href={TEL_HREF} data-cta="footer_call" data-cta-location="footer">{SITE_CONFIG.phone}</a>
                <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" data-cta="footer_whatsapp" data-cta-location="footer">WhatsApp a planner</a>
                <a href={MAIL_HREF} data-cta="footer_email" data-cta-location="footer">{SITE_CONFIG.email}</a>
              </dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>{ENTITY_FACTS.languages.join(", ")}</dd>
            </div>
          </dl>

          <p className="pg-shell-colophon__areas">
            We plan events in {CITIES.join(", ")} — across India and at international destinations.
          </p>
        </div>

        <DetailsOpenAtDesktop>
          <nav aria-label="Footer" className="pg-shell-fgroups">
            {GROUPS.map((group) => (
              <details key={group.title} open data-group="footer" className="pg-shell-fgroup">
                <summary>
                  {group.title}
                  <UiIcon name="plus" size={20} />
                </summary>
                <ul role="list">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} prefetch={false}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </nav>
        </DetailsOpenAtDesktop>

        <div className="pg-shell-legal">
          <p>
            © {year} {SITE_CONFIG.legalName}
          </p>
          <ul role="list" aria-label="Legal">
            {FOOTER_LEGAL.map((link) => (
              <li key={link.href}>
                <Link href={link.href} prefetch={false}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/company" prefetch={false}>Company information</Link>
            </li>
            <li>
              <Link href="/sitemap" prefetch={false}>Sitemap</Link>
            </li>
            <li>
              {/* Plain anchor, not Link: CookieConsent's delegated [data-consent-open] handler re-opens the banner; without JS it lands on the cookie section of the privacy policy. */}
              <a href="/privacy#cookies" data-consent-open="">Cookie settings</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
