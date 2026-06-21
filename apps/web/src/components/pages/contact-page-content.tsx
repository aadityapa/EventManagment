"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageCircle, Calendar } from "lucide-react";
import { CinematicHero } from "@/components/shared/cinematic-hero";
import { PageSection } from "@/components/shared/page-section";
import { ContactForm } from "@/components/contact/contact-form";
import { SITE_CONFIG } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import { Button } from "@/components/ui/button";

export function ContactPageContent() {
  return (
    <>
      <CinematicHero
        label="Get in Touch"
        title="Let's Create Something Extraordinary"
        subtitle="Schedule a private consultation with our luxury event specialists."
        image={IMAGES.contact}
        size="full"
      />

      <PageSection>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3 space-y-6">
            <div className="luxury-card p-6">
              <h3 className="font-display text-lg font-semibold">Contact</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3 text-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {SITE_CONFIG.address}
                </li>
                <li>
                  <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-muted hover:text-primary">
                    <Phone className="h-4 w-4 text-primary" /> {SITE_CONFIG.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-3 text-muted hover:text-primary">
                    <Mail className="h-4 w-4 text-primary" /> {SITE_CONFIG.email}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-muted">
                  <Clock className="h-4 w-4 text-primary" /> Mon–Sat, 9 AM – 9 PM IST
                </li>
              </ul>
            </div>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp Us
            </a>
          </div>

          <div className="lg:col-span-5">
            <div className="luxury-card p-6 sm:p-8">
              <h3 className="font-display text-xl font-semibold">Luxury Inquiry Form</h3>
              <p className="mt-2 text-sm text-muted">Tell us about your vision — we respond within 24 hours.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="overflow-hidden rounded-2xl border border-border/40">
              <iframe
                title="Nexyyra Events Pune location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242015.69828320738!2d73.69814815!3d18.5204303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9f9df543!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="h-[300px] w-full lg:h-full lg:min-h-[400px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="luxury-card p-6 text-center">
              <Calendar className="mx-auto h-8 w-8 text-primary" />
              <h4 className="mt-3 font-display text-lg font-semibold">Book a Consultation</h4>
              <p className="mt-2 text-sm text-muted">30-minute complimentary strategy session.</p>
              <Button className="mt-4 w-full" asChild>
                <Link href="/book-event">Schedule Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
