import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS, FOOTER_LEGAL } from "@/lib/constants";
import { services } from "@/data/cms";
import { NewsletterForm } from "@/components/engagement/newsletter-form";
import { Logo } from "@/components/branding/logo";

function SocialIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    Instagram: (
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    ),
    Facebook: (
      <path d="M14 8h3V4h-3c-2.76 0-5 2.24-5 5v3H6v4h3v9h4v-9h3.5l.5-4H13v-3c0-.55.45-1 1-1z" />
    ),
    YouTube: (
      <path d="M21.8 8.4a2.5 2.5 0 0 0-1.76-1.77C18.36 6.2 12 6.2 12 6.2s-6.36 0-8.04.43A2.5 2.5 0 0 0 2.2 8.4 26 26 0 0 0 2 12a26 26 0 0 0 .2 3.6 2.5 2.5 0 0 0 1.76 1.77C5.64 17.8 12 17.8 12 17.8s6.36 0 8.04-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.2-3.6zM10 15.5v-7l6 3.5-6 3.5z" />
    ),
    LinkedIn: (
      <path d="M6.5 8.5h3v11h-3v-11zM8 6.5a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5zM11 8.5h2.9v1.5h.04c.4-.75 1.38-1.55 2.84-1.55 3.04 0 3.6 2 3.6 4.6V19.5h-3v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.74v5.3H11V8.5z" />
    ),
  };

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      {paths[name]}
    </svg>
  );
}

const LOCATIONS = ["Pune", "Mumbai", "Goa", "Jaipur", "Udaipur", "Bangalore"];

const socialIcons = [
  { href: SITE_CONFIG.social.instagram, name: "Instagram", label: "Instagram" },
  { href: SITE_CONFIG.social.facebook, name: "Facebook", label: "Facebook" },
  { href: SITE_CONFIG.social.youtube, name: "YouTube", label: "YouTube" },
  { href: SITE_CONFIG.social.linkedin, name: "LinkedIn", label: "LinkedIn" },
];

export function Footer() {
  const quickLinks = NAV_LINKS.slice(0, 6);
  const serviceLinks = services.slice(0, 6);

  return (
    <footer className="site-chrome relative border-t border-border/40 bg-card text-foreground">
      <div className="gold-divider absolute top-0 left-0 right-0" />

      <div className="container-page py-12 sm:py-16">
        <div className="mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center sm:p-8">
          <h3 className="font-display text-xl font-semibold sm:text-2xl">
            Ready to Plan Your Extraordinary Event?
          </h3>
          <p className="mt-2 text-sm text-muted">Speak with our luxury event specialists today.</p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex touch-target items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
              className="inline-flex touch-target items-center gap-2 rounded-full border border-primary/40 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              <Phone className="h-4 w-4" /> {SITE_CONFIG.phone}
            </a>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4 xl:grid-cols-5">
          <div className="space-y-4 lg:col-span-2 xl:col-span-1">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              {SITE_CONFIG.tagline}. India&apos;s premier luxury event management house.
            </p>
            <div className="flex gap-3">
              {socialIcons.map(({ href, name, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  <SocialIcon name={name} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-primary">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-primary">
              Services
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className="text-sm text-muted transition-colors hover:text-primary">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-primary">
              Locations
            </h3>
            <ul className="space-y-2">
              {LOCATIONS.map((city) => (
                <li key={city}>
                  <Link href="/venues" className="text-sm text-muted transition-colors hover:text-primary">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-primary">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>{SITE_CONFIG.address}</span>
              </li>
              <li>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-primary">
                  <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-primary">
                  <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-4 xl:col-span-1">
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-primary">
              Newsletter
            </h3>
            <p className="mb-4 text-sm text-muted">Exclusive event inspiration and luxury trends.</p>
            <NewsletterForm variant="footer" />
          </div>
        </div>

        <div className="gold-divider my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {FOOTER_LEGAL.map((link) => (
              <Link key={link.href} href={link.href} className="text-muted transition-colors hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
