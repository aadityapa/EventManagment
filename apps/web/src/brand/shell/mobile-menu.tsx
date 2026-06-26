"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { EXPERIENCE_CATEGORIES, isNavActive } from "./nav-data";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    </svg>
  );
}

const DRAWER_MOTION = {
  initial: { opacity: 0, x: "100%" },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: "100%" },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
};

const REDUCED_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [experiencesOpen, setExperiencesOpen] = useState(false);
  const motionProps = prefersReducedMotion ? REDUCED_MOTION : DRAWER_MOTION;

  const handleClose = useCallback(() => {
    setExperiencesOpen(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      handleClose();
      prevPathRef.current = pathname;
    }
  }, [pathname, handleClose]);

  const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`;
  const phoneHref = `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="mobile-nav-drawer lg:hidden"
          {...motionProps}
        >
          <div className="mobile-nav-drawer__veil" aria-hidden="true" />
          <div className="mobile-nav-drawer__noise" aria-hidden="true" />

          <div className="mobile-nav-drawer__content">
            <nav className="mobile-nav-drawer__links" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => {
                if (link.href === "/services") {
                  const servicesActive = pathname.startsWith("/services");
                  return (
                    <div key={link.href} className="mobile-nav-drawer__accordion">
                      <button
                        type="button"
                        className={cn(
                          "mobile-nav-drawer__link mobile-nav-drawer__accordion-trigger tap-target",
                          servicesActive && "is-active"
                        )}
                        onClick={() => setExperiencesOpen((v) => !v)}
                        aria-expanded={experiencesOpen}
                        aria-controls="mobile-experience-accordion"
                      >
                        {link.label}
                        <ChevronDown
                          className={cn(
                            "mobile-nav-drawer__chevron",
                            experiencesOpen && "is-open"
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {experiencesOpen && (
                          <motion.div
                            id="mobile-experience-accordion"
                            className="mobile-nav-drawer__accordion-panel"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={
                              prefersReducedMotion
                                ? { duration: 0.01 }
                                : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
                            }
                          >
                            <div className="mobile-nav-drawer__accordion-inner">
                              {EXPERIENCE_CATEGORIES.map((item) => {
                                const active = isNavActive(pathname, item.href);
                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={handleClose}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                      "mobile-nav-drawer__sub-link tap-target",
                                      active && "is-active"
                                    )}
                                  >
                                    {item.label}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                const active = isNavActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleClose}
                    aria-current={active ? "page" : undefined}
                    className={cn("mobile-nav-drawer__link tap-target", active && "is-active")}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mobile-nav-drawer__footer">
              <a href={phoneHref} className="mobile-nav-drawer__contact tap-target">
                <Phone className="mobile-nav-drawer__contact-icon" aria-hidden="true" />
                {SITE_CONFIG.phone}
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-nav-drawer__contact tap-target"
              >
                <MessageCircle className="mobile-nav-drawer__contact-icon" aria-hidden="true" />
                WhatsApp
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-nav-drawer__contact tap-target"
              >
                <InstagramIcon className="mobile-nav-drawer__contact-icon" />
                Instagram
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="mobile-nav-drawer__contact tap-target"
              >
                <Mail className="mobile-nav-drawer__contact-icon" aria-hidden="true" />
                {SITE_CONFIG.email}
              </a>
              <Link
                href="/book-event"
                onClick={handleClose}
                className="mobile-nav-drawer__cta tap-target"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
