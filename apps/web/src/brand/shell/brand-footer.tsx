"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/branding/logo";
import { SITE_CONFIG } from "@/lib/constants";
import { analytics } from "@/lib/analytics";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
] as const;

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund", label: "Refund Policy" },
  { href: "/sitemap.xml", label: "Sitemap", external: true },
] as const;

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.5 8.5h3v11h-3v-11zM8 6.5a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5zM11 8.5h2.9v1.5h.04c.4-.75 1.38-1.55 2.84-1.55 3.04 0 3.6 2 3.6 4.6V19.5h-3v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.74v5.3H11V8.5z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.58 7.88 6.26 9.41-.09-.79-.17-2.01.04-2.87l1.15-4.88s-.29-.58-.29-1.44c0-1.35.78-2.36 1.76-2.36.83 0 1.23.62 1.23 1.37 0 .83-.53 2.08-.81 3.23-.23.97.49 1.76 1.45 1.76 1.74 0 3.08-1.83 3.08-4.48 0-2.34-1.68-3.98-4.08-3.98-2.78 0-4.41 2.09-4.41 4.25 0 .84.32 1.74.72 2.23.08.1.09.18.07.28l-.27 1.08c-.04.18-.14.22-.33.13-1.24-.58-2.02-2.4-2.02-3.86 0-3.15 2.29-6.04 6.61-6.04 3.47 0 6.17 2.47 6.17 5.77 0 3.45-2.17 6.22-5.19 6.22-1.01 0-1.97-.53-2.29-1.15l-.62 2.37c-.23.88-.85 1.98-1.27 2.65 0 .96.01 1.92.03 2.88C18.42 20.88 22 16.84 22 12c0-5.52-4.48-10-10-10z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.8 8.4a2.5 2.5 0 0 0-1.76-1.77C18.36 6.2 12 6.2 12 6.2s-6.36 0-8.04.43A2.5 2.5 0 0 0 2.2 8.4 26 26 0 0 0 2 12a26 26 0 0 0 .2 3.6 2.5 2.5 0 0 0 1.76 1.77C5.64 17.8 12 17.8 12 17.8s6.36 0 8.04-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.2-3.6zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { href: SITE_CONFIG.social.instagram, label: "Instagram", icon: InstagramIcon },
  { href: "https://pinterest.com/nexyyraevents", label: "Pinterest", icon: PinterestIcon },
  { href: SITE_CONFIG.social.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  { href: SITE_CONFIG.social.youtube, label: "YouTube", icon: YoutubeIcon },
  { href: `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`, label: "WhatsApp", icon: MessageCircle },
] as const;

function SocialIconLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Follow Nexyyra on ${label}`}
      className="lux-social"
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.96 }}
    >
      <Icon className="h-5 w-5" />
    </motion.a>
  );
}

function FooterNewsletter() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    analytics.ctaClick("newsletter_subscribe", "footer");
    void fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: value, source: "newsletter" }),
    }).catch(() => {});
    toast.success("You're on the list — welcome to Nexyyra.");
    setEmail("");
  };

  return (
    <form className="lux-newsletter" onSubmit={onSubmit}>
      <label htmlFor="footer-newsletter" className="sr-only">Email address</label>
      <input
        id="footer-newsletter"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="lux-newsletter__input"
        autoComplete="email"
      />
      <button type="submit" className="lux-newsletter__btn tap-target" aria-label="Subscribe to newsletter">
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="lux-footer__heading">{children}</h3>;
}

export function BrandFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;

  const telHref = `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`;
  const mailHref = `mailto:${SITE_CONFIG.email}`;

  return (
    <footer className="lux-footer" role="contentinfo">
      <div className="brand-container">
        <div className="lux-footer__grid">
          <div className="lux-footer__brand">
            <Logo variant="footer" href="/" />
            <p className="lux-footer__tagline">
              Crafting experiences that inspire, celebrate and become unforgettable.
            </p>
            <div className="lux-footer__socials">
              {SOCIAL_LINKS.map((s) => (
                <SocialIconLink key={s.label} {...s} />
              ))}
            </div>
          </div>

          <nav className="lux-footer__col" aria-label="Quick links">
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="lux-footer__list">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="lux-footer__link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lux-footer__col">
            <FooterHeading>Contact Us</FooterHeading>
            <ul className="lux-footer__contact">
              <li>
                <a href={telHref} className="lux-footer__link">
                  <Phone className="h-4 w-4 text-[var(--lux-gold)]" aria-hidden /> {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a href={mailHref} className="lux-footer__link">
                  <Mail className="h-4 w-4 text-[var(--lux-gold)]" aria-hidden /> {SITE_CONFIG.email}
                </a>
              </li>
              <li className="lux-footer__contact-item">
                <MapPin className="h-4 w-4 shrink-0 text-[var(--lux-gold)]" aria-hidden /> {SITE_CONFIG.address}
              </li>
            </ul>
          </div>

          <div className="lux-footer__col">
            <FooterHeading>Newsletter</FooterHeading>
            <p className="lux-footer__tagline">Stay updated with our latest events and offers.</p>
            <FooterNewsletter />
          </div>
        </div>

        <div className="lux-footer__divider" aria-hidden />

        <div className="lux-footer__bottom">
          <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved.</p>
          <nav aria-label="Legal links" className="lux-footer__legal">
            {LEGAL_LINKS.map((l) =>
              "external" in l && l.external ? (
                <a key={l.href} href={l.href} className="lux-footer__link">{l.label}</a>
              ) : (
                <Link key={l.href} href={l.href} className="lux-footer__link">{l.label}</Link>
              )
            )}
          </nav>
          <a href={SITE_CONFIG.url} className="lux-footer__url">www.nexyyra.com</a>
        </div>
      </div>
    </footer>
  );
}
