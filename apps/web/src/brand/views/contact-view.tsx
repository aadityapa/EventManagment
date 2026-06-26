"use client";

import { MapPin, Phone, Mail, Clock, MessageCircle, Calendar } from "lucide-react";
import { BrandImage } from "@/brand/primitives/brand-image";
import { BrandButton } from "@/brand/primitives/brand-button";
import { GlassPanel } from "@/brand/primitives/glass-panel";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { ContactForm } from "@/components/contact/contact-form";
import { SITE_CONFIG } from "@/lib/constants";
import { BRAND_IMAGES } from "@/brand/data/imagery";
import { ScrollReveal } from "@/lib/motion";

const SERVICE_AREAS = [
  "Pune & Maharashtra",
  "Mumbai Metropolitan",
  "Goa & Konkan Coast",
  "Rajasthan (Jaipur, Udaipur)",
  "Bangalore & South India",
  "Pan-India destination weddings",
];

export function ContactView() {
  return (
    <div className="brand-root">
      {/* Hero */}
      <section className="relative flex min-h-[68svh] items-end overflow-hidden">
        <BrandImage
          src={BRAND_IMAGES.contact}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/20" />
        <div className="brand-container relative w-full pb-16 pt-32 sm:pb-20">
          <GlassPanel textSafe className="max-w-2xl px-8 py-10 sm:px-10">
            <span className="v4-kicker mb-4">Concierge</span>
            <h1 className="v4-display text-white">
              Let&apos;s Create Something <span className="v4-gold-text">Extraordinary</span>
            </h1>
            <p className="v4-standfirst mt-4 text-white/80">
              Private consultation with our luxury specialists — we respond within 24 hours.
            </p>
          </GlassPanel>
        </div>
      </section>

      <section className="v4-section" aria-labelledby="contact-main-heading">
        <div className="brand-container">
          <h2 id="contact-main-heading" className="sr-only">Contact Nexyyra Events</h2>
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Contact info */}
            <div className="space-y-4 lg:col-span-3">
              <ScrollReveal preset="left">
                <GlassPanel className="p-6">
                  <h3 className="v4-title text-lg">Direct Line</h3>
                  <ul className="mt-4 space-y-3 text-sm text-muted">
                    <li className="flex gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-[var(--glitz-gold)]" aria-hidden="true" />
                      {SITE_CONFIG.address}
                    </li>
                    <li>
                      <a
                        href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                        className="flex gap-2 transition-colors hover:text-[var(--glitz-gold)]"
                      >
                        <Phone className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                        {SITE_CONFIG.phone}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`mailto:${SITE_CONFIG.email}`}
                        className="flex gap-2 transition-colors hover:text-[var(--glitz-gold)]"
                      >
                        <Mail className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                        {SITE_CONFIG.email}
                      </a>
                    </li>
                    <li className="flex gap-2">
                      <Clock className="h-4 w-4 text-[var(--glitz-gold)]" aria-hidden="true" />
                      Mon–Sat 9 AM – 9 PM IST
                    </li>
                  </ul>
                </GlassPanel>
              </ScrollReveal>

              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-[var(--v4-radius)] bg-[#25D366] py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" /> WhatsApp Concierge
              </a>

              {/* GEO-friendly facts block */}
              <ScrollReveal preset="left" delay={0.1}>
                <aside aria-label="Nexyyra Events contact facts">
                  <GlassPanel className="p-6">
                  <h3 className="v4-kicker mb-3">At a Glance</h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="font-semibold text-primary">Business</dt>
                      <dd className="text-muted">{SITE_CONFIG.name}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-primary">Headquarters</dt>
                      <dd className="text-muted">{SITE_CONFIG.address}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-primary">Phone</dt>
                      <dd>
                        <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="text-muted hover:text-[var(--glitz-gold)]">
                          {SITE_CONFIG.phone}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-primary">Service Areas</dt>
                      <dd className="text-muted">
                        <ul className="mt-1 list-inside list-disc space-y-0.5">
                          {SERVICE_AREAS.map((area) => (
                            <li key={area}>{area}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                  </GlassPanel>
                </aside>
              </ScrollReveal>
            </div>

            {/* Form */}
            <div className="lg:col-span-5">
              <ScrollReveal preset="reveal">
                <GlassPanel className="p-6 sm:p-8">
                  <h3 className="v4-title text-xl">Luxury Inquiry Form</h3>
                  <p className="mt-2 text-sm text-muted">
                    Share your vision — our team will craft a tailored response within one business day.
                  </p>
                  <div className="mt-6">
                    <ContactForm />
                  </div>
                </GlassPanel>
              </ScrollReveal>
            </div>

            {/* Map + CTA */}
            <div className="space-y-4 lg:col-span-4">
              <ScrollReveal preset="right">
                <GlassPanel className="overflow-hidden p-0">
                  <iframe
                    title="Nexyyra Events Pune office map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242015!2d73.698!3d18.520!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9f9df543!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000"
                    className="h-[280px] w-full border-0 lg:min-h-[320px]"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </GlassPanel>
              </ScrollReveal>

              <ScrollReveal preset="right" delay={0.1}>
                <GlassPanel glow className="p-6 text-center">
                  <Calendar className="mx-auto h-8 w-8 text-[var(--glitz-gold)]" aria-hidden="true" />
                  <h4 className="v4-title mt-3 text-lg">Book Consultation</h4>
                  <p className="mt-2 text-sm text-muted">
                    Prefer a scheduled call? Reserve a private session with our event directors.
                  </p>
                  <MagneticButton className="mt-4 block">
                    <BrandButton href="/book-event" variant="gold" className="w-full">
                      Schedule Now
                    </BrandButton>
                  </MagneticButton>
                </GlassPanel>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
