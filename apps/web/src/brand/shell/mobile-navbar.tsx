/* eslint-disable @next/next/no-img-element -- pre-sized WebP wordmark with its own srcset; nothing to optimise */
import Link from "next/link";
import { ServiceIcon, UiIcon } from "@/components/icons";
import { Button } from "@/components/ui";
import { SITE_CONFIG } from "@/lib/constants";
import { MobileMenu } from "./mobile-menu";
import {
  MAIL_HREF,
  NAV_LINKS,
  NAV_SERVICES,
  PRIMARY_LABEL,
  PROPOSAL_HREF,
  TEL_HREF,
  WHATSAPP_HREF,
  WORDMARK,
} from "./nav-data";

/**
 * Phone header bar (< 1024, DESIGN.md §10.0): wordmark left, a Call glyph and
 * the Menu button right — 64px, rendered inside BrandHeader's <header>. The
 * menu content is server-rendered here and handed to the MobileMenu dialog
 * island as children, so the cms data never ships to the browser.
 */
export function MobileNavbar() {
  return (
    <div className="pg-shell-bar pg-shell-bar--mobile">
      <Link href="/" className="pg-shell-wordmark" aria-label={`${SITE_CONFIG.shortName} — Home`}>
        <img src={WORDMARK.src} srcSet={WORDMARK.srcSet} sizes="40px" alt="" width={WORDMARK.width} height={WORDMARK.height} decoding="async" />
      </Link>
      <div className="pg-shell-bar__end">
        <a href={TEL_HREF} className="pg-shell-iconlink" aria-label={`Call ${SITE_CONFIG.phone}`} data-cta="call_header" data-cta-location="header-mobile">
          <UiIcon name="phone" size={24} />
        </a>
        <MobileMenu menuIcon={<UiIcon name="menu" size={24} />} closeIcon={<UiIcon name="plus" size={24} className="pg-shell-menu__x" />}>
          <MenuContent />
        </MobileMenu>
      </div>
    </div>
  );
}

function MenuContent() {
  return (
    <>
      <nav aria-label="Menu">
        <ol role="list" className="pg-shell-menu__list">
          {NAV_LINKS.map((link, i) => {
            const num = <span className="pg-shell-menu__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>;
            if (link.href === "/services") {
              return (
                <li key={link.href}>
                  <details name="menu" className="pg-shell-menu__group">
                    <summary className="pg-shell-menu__link" data-nav-href={link.href}>
                      {num}
                      <span className="pg-shell-menu__label">{link.label}</span>
                      <UiIcon name="plus" size={24} />
                    </summary>
                    <ul role="list" className="pg-shell-menu__services">
                      {NAV_SERVICES.map((s) => (
                        <li key={s.slug}>
                          <Link href={s.href} prefetch={false} className="pg-shell-menu__service" data-nav-href={s.href}>
                            <ServiceIcon name={s.slug} size={24} />
                            <span>{s.title}</span>
                            <span className="pg-shell-menu__price">{s.from}</span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href="/services" prefetch={false} className="pg-shell-menu__service pg-shell-menu__all">
                          All services
                          <UiIcon name="arrow-right" size={20} />
                        </Link>
                      </li>
                    </ul>
                  </details>
                </li>
              );
            }
            return (
              <li key={link.href}>
                <Link href={link.href} className="pg-shell-menu__link" data-nav-href={link.href}>
                  {num}
                  <span className="pg-shell-menu__label">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      <ul role="list" className="pg-shell-menu__contact" aria-label="Contact">
        <li>
          <a href={TEL_HREF} data-cta="menu_call" data-cta-location="mobile-menu">
            <UiIcon name="phone" size={20} />
            {SITE_CONFIG.phone}
          </a>
        </li>
        <li>
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" data-cta="menu_whatsapp" data-cta-location="mobile-menu">
            <UiIcon name="whatsapp" size={20} className="pg-shell-whatsapp" />
            WhatsApp a planner
          </a>
        </li>
        <li>
          <a href={MAIL_HREF} data-cta="menu_email" data-cta-location="mobile-menu">
            <UiIcon name="mail" size={20} />
            {SITE_CONFIG.email}
          </a>
        </li>
      </ul>

      <Button variant="primary" size="full" href={PROPOSAL_HREF} arrow cta="menu_proposal" location="mobile-menu">
        {PRIMARY_LABEL}
      </Button>
    </>
  );
}
