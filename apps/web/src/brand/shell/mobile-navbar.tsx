"use client";

/* eslint-disable @next/next/no-img-element -- BRAND_LOGO_ASSETS SVG via img (see logo.tsx) */

import Link from "next/link";
import { BRAND_LOGO_ASSETS } from "@/components/branding/logo";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

type MobileNavbarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

function MenuToggleIcon({ open }: { open: boolean }) {
  return (
    <span className="mobile-nav-toggle" aria-hidden="true">
      <span className={cn("mobile-nav-toggle__bar mobile-nav-toggle__bar--top", open && "is-open")} />
      <span className={cn("mobile-nav-toggle__bar mobile-nav-toggle__bar--mid", open && "is-open")} />
      <span className={cn("mobile-nav-toggle__bar mobile-nav-toggle__bar--bot", open && "is-open")} />
    </span>
  );
}

export function MobileNavbar({ isOpen, onToggle }: MobileNavbarProps) {
  return (
    <header
      className="mobile-nav-header lg:hidden"
      role="banner"
      data-menu-open={isOpen ? "true" : "false"}
    >
      <div className="mobile-nav-header__inner">
        <Link
          href="/"
          aria-label={`${SITE_CONFIG.name} — Home`}
          className="mobile-nav-header__logo tap-target"
        >
          <img
            src={BRAND_LOGO_ASSETS.dark}
            alt={SITE_CONFIG.name}
            decoding="async"
            fetchPriority="high"
            className="mobile-nav-header__logo-img"
          />
        </Link>

        <button
          type="button"
          className="mobile-nav-header__menu-btn tap-target"
          onClick={onToggle}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-drawer"
        >
          <MenuToggleIcon open={isOpen} />
        </button>
      </div>
    </header>
  );
}
