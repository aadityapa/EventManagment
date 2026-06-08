import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageCircle, Calendar } from "lucide-react";
import { BrandPageHero } from "@/brand/primitives/brand-hero";
import { BrandSection } from "@/brand/primitives/brand-section";
import { ContactForm } from "@/components/contact/contact-form";
import { SITE_CONFIG } from "@/lib/constants";
import { BRAND_IMAGES } from "@/brand/data/imagery";

export function ContactView() {
  return (
    <div className="brand-root">
      <BrandPageHero label="Contact" title="Let's Create Something Extraordinary" subtitle="Private consultation with our luxury specialists." image={BRAND_IMAGES.contact} />
      <BrandSection>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3 space-y-4">
            <div className="brand-surface p-6">
              <h3 className="brand-display text-lg font-semibold">Contact</h3>
              <ul className="mt-4 space-y-3 text-sm text-[var(--glitz-muted)]">
                <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-[var(--glitz-gold)]" />{SITE_CONFIG.address}</li>
                <li><a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="flex gap-2 hover:text-[var(--glitz-gold)]"><Phone className="h-4 w-4 text-[var(--glitz-gold)]" />{SITE_CONFIG.phone}</a></li>
                <li><a href={`mailto:${SITE_CONFIG.email}`} className="flex gap-2 hover:text-[var(--glitz-gold)]"><Mail className="h-4 w-4 text-[var(--glitz-gold)]" />{SITE_CONFIG.email}</a></li>
                <li className="flex gap-2"><Clock className="h-4 w-4 text-[var(--glitz-gold)]" />Mon–Sat 9 AM – 9 PM</li>
              </ul>
            </div>
            <a href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 text-sm font-semibold text-white"><MessageCircle className="h-5 w-5" /> WhatsApp</a>
          </div>
          <div className="lg:col-span-5">
            <div className="brand-surface p-6 sm:p-8"><h3 className="brand-display text-xl font-semibold">Luxury Inquiry Form</h3><p className="mt-2 text-sm text-[var(--glitz-muted)]">We respond within 24 hours.</p><div className="mt-6"><ContactForm /></div></div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-[var(--glitz-border)]"><iframe title="Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242015!2d73.698!3d18.520!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9f9df543!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000" className="h-[280px] w-full lg:min-h-[360px]" loading="lazy" /></div>
            <div className="brand-surface p-6 text-center"><Calendar className="mx-auto h-8 w-8 text-[var(--glitz-gold)]" /><h4 className="mt-3 brand-display text-lg font-semibold">Book Consultation</h4><Link href="/book-event" className="mt-4 block rounded-lg bg-[var(--glitz-gold)] py-3 text-sm font-semibold text-[#0A0A0A]">Schedule Now</Link></div>
          </div>
        </div>
      </BrandSection>
    </div>
  );
}
