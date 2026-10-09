/* eslint-disable @next/next/no-img-element -- pre-sized WebP wordmark with its own srcset; nothing to optimise */
import Link from "next/link";
import { assetForRole } from "@/brand/data/image-curation";
import { ServiceIcon, UiIcon } from "@/components/icons";
import { Button, MediaFrame } from "@/components/ui";
import { SITE_CONFIG } from "@/lib/constants";
import { HeaderIsland } from "./header-island";
import { MobileNavbar } from "./mobile-navbar";
import {
  MEGA_EXPLORE_LINKS,
  NAV_LINKS,
  NAV_SERVICE_GROUPS,
  PRIMARY_LABEL,
  PROPOSAL_HREF,
  TEL_HREF,
  WORDMARK,
} from "./nav-data";

/**
 * Site header (DESIGN.md §10.0) — a server component. Desktop ≥ 1024: wordmark,
 * primary nav with the Services popover, phone + the primary CTA. Phones get
 * MobileNavbar inside the same fixed <header>, so there is one banner landmark
 * and one scroll flag. Transparency over the home cover is pure CSS
 * (`html:has(.lux-cover--xl)` in pages/shell.css); `.is-scrolled`, aria-current
 * and the popover fallback come from HeaderIsland.
 */
export function BrandHeader() {
  return (
    <header id="site-header" className="lux-header pg-shell-header">
      <div className="pg-shell-bar pg-shell-bar--desktop">
        <Link href="/" className="pg-shell-wordmark" aria-label={`${SITE_CONFIG.shortName} — Home`}>
          <img src={WORDMARK.src} srcSet={WORDMARK.srcSet} sizes="48px" alt="" width={WORDMARK.width} height={WORDMARK.height} decoding="async" />
        </Link>

        <nav aria-label="Primary" className="pg-shell-nav">
          <ul role="list">
            {NAV_LINKS.map((link) =>
              link.href === "/services" ? (
                <li key={link.href}>
                  <button id="services-trigger" type="button" popoverTarget="services-panel" className="pg-shell-nav__link" data-nav-href={link.href}>
                    {link.label}
                    <UiIcon name="chevron-down" size={20} className="pg-shell-nav__chev" />
                  </button>
                </li>
              ) : (
                <li key={link.href}>
                  <Link href={link.href} className="pg-shell-nav__link" data-nav-href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="pg-shell-actions">
          <a href={TEL_HREF} className="pg-shell-phone" aria-label={`Call ${SITE_CONFIG.phone}`} data-cta="call_header" data-cta-location="header">
            <UiIcon name="phone" size={20} />
            <span className="pg-shell-phone__num">{SITE_CONFIG.phone}</span>
          </a>
          <Button variant="primary" size="compact" href={PROPOSAL_HREF} cta="header_proposal" location="header">
            {PRIMARY_LABEL}
          </Button>
        </div>
      </div>

      <ServicesPanel />
      <MobileNavbar />
      <HeaderIsland />
    </header>
  );
}

/**
 * Full-width fixed panel under the nav (never position:absolute under the
 * trigger — top-layer elements ignore ancestor containing blocks). Light
 * dismiss and ESC are native; links skip prefetch so opening it is not a
 * request storm. Plain link lists, no menu roles.
 */
function ServicesPanel() {
  const photo = assetForRole("cover-services")?.id;
  return (
    <div id="services-panel" popover="auto" className="pg-shell-panel">
      <div className="pg-shell-panel__inner">
        {NAV_SERVICE_GROUPS.map((group) => (
          <div key={group.id} className="pg-shell-panel__group">
            <p id={`panel-${group.id}`} className="lux-label lux-label--rule-none">{group.label}</p>
            <ul role="list" aria-labelledby={`panel-${group.id}`}>
              {group.items.map((item) => (
                <li key={item.slug}>
                  <Link href={item.href} prefetch={false} className="pg-shell-panel__service" data-cta={`nav_${item.slug}`} data-cta-location="services-panel">
                    <ServiceIcon name={item.slug} size={20} />
                    <span className="pg-shell-panel__title">{item.title}</span>
                    <span className="pg-shell-panel__price">{item.from}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="pg-shell-panel__group pg-shell-panel__explore">
          <p id="panel-explore" className="lux-label lux-label--rule-none">Explore</p>
          <ul role="list" aria-labelledby="panel-explore">
            {MEGA_EXPLORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} prefetch={false} className="pg-shell-panel__link">{link.label}</Link>
              </li>
            ))}
          </ul>
          <Link href="/services" prefetch={false} className="pg-shell-panel__all" data-cta="nav_all_services" data-cta-location="services-panel">
            All services
            <UiIcon name="arrow-right" size={20} />
          </Link>
        </div>

        {photo ? <MediaFrame asset={photo} ratio="4:5" sizes="224px" caption={false} frame className="pg-shell-panel__media" /> : null}
      </div>
    </div>
  );
}
