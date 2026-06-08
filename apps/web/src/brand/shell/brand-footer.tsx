import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS, FOOTER_LEGAL } from "@/lib/constants";
import { BRAND_SERVICES } from "@/brand/data/content";
import { Logo } from "@/components/branding/logo";

const LOCATIONS = ["Pune", "Mumbai", "Goa", "Jaipur", "Udaipur", "Bangalore"];

export function BrandFooter() {
  return (
    <footer className="border-t border-[var(--glitz-border)] bg-[var(--glitz-surface)]">
      <div className="brand-divider" />
      <div className="brand-container py-14 sm:py-16">
        <div className="mb-10 rounded-2xl border border-[var(--glitz-gold)]/20 bg-[var(--glitz-gold)]/5 p-8 text-center">
          <h3 className="brand-display text-xl font-semibold sm:text-2xl">Ready to Plan Your Extraordinary Event?</h3>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--glitz-gold)]/40 px-6 py-3 text-sm font-semibold text-[var(--glitz-gold)]"><Phone className="h-4 w-4" /> {SITE_CONFIG.phone}</a>
          </div>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-[var(--glitz-muted)]">India&apos;s premier luxury event management house.</p>
          </div>
          <div>
            <h4 className="brand-label mb-4">Quick Links</h4>
            <ul className="space-y-2">{NAV_LINKS.slice(0, 6).map((l) => <li key={l.href}><Link href={l.href} className="text-sm text-[var(--glitz-muted)] hover:text-[var(--glitz-gold)]">{l.label}</Link></li>)}</ul>
          </div>
          <div>
            <h4 className="brand-label mb-4">Services</h4>
            <ul className="space-y-2">{BRAND_SERVICES.slice(0, 6).map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`} className="text-sm text-[var(--glitz-muted)] hover:text-[var(--glitz-gold)]">{s.title}</Link></li>)}</ul>
          </div>
          <div>
            <h4 className="brand-label mb-4">Locations</h4>
            <ul className="space-y-2">{LOCATIONS.map((c) => <li key={c}><Link href="/venues" className="text-sm text-[var(--glitz-muted)] hover:text-[var(--glitz-gold)]">{c}</Link></li>)}</ul>
          </div>
          <div>
            <h4 className="brand-label mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-[var(--glitz-muted)]">
              <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-[var(--glitz-gold)]" />{SITE_CONFIG.address}</li>
              <li><a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="flex gap-2 hover:text-[var(--glitz-gold)]"><Phone className="h-4 w-4 text-[var(--glitz-gold)]" />{SITE_CONFIG.phone}</a></li>
              <li><a href={`mailto:${SITE_CONFIG.email}`} className="flex gap-2 hover:text-[var(--glitz-gold)]"><Mail className="h-4 w-4 text-[var(--glitz-gold)]" />{SITE_CONFIG.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="brand-divider my-8" />
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-sm text-[var(--glitz-muted)]">
          <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}</p>
          <div className="flex gap-6">{FOOTER_LEGAL.map((l) => <Link key={l.href} href={l.href} className="hover:text-[var(--glitz-gold)]">{l.label}</Link>)}</div>
        </div>
      </div>
    </footer>
  );
}
