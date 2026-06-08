import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { StitchRoute } from "@/components/stitch/stitch-route";
import { stitchMetadata } from "@/lib/stitch/pages";

export const metadata = stitchMetadata("contact");

export default function ContactPage() {
  return (
    <StitchRoute screen="contact">
    <>
      <PageHero
        title="Contact Us"
        subtitle="Let's start planning your extraordinary event"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <ContactForm />
            </div>

            <div className="space-y-6">
              <div className="glass-card flex flex-col items-center justify-center p-8">
                <Logo href={undefined} className="!h-24 !max-w-[280px] sm:!h-28" priority />
                <p className="mt-4 text-center text-sm text-muted">
                  Luxury event management &amp; promotions — Pune
                </p>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-display text-xl font-semibold">Contact Information</h3>
                <ul className="mt-4 space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted">{SITE_CONFIG.address}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="h-5 w-5 shrink-0 text-primary" />
                    <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-primary">
                      {SITE_CONFIG.phone}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="h-5 w-5 shrink-0 text-primary" />
                    <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-primary">
                      {SITE_CONFIG.email}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted">Mon–Sat, 9 AM – 7 PM IST</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card flex aspect-video items-center justify-center p-6">
                <div className="text-center text-muted">
                  <MapPin className="mx-auto h-12 w-12 text-primary/50" />
                  <p className="mt-2 text-sm">Pune, Maharashtra, India</p>
                </div>
              </div>

              <div className="gradient-dark rounded-xl p-8 text-white">
                <h3 className="font-display text-xl font-bold">
                  Free Consultation
                </h3>
                <p className="mt-2 text-white/70">
                  Schedule a complimentary 30-minute consultation with our event experts.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/book-event">Book Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
    </StitchRoute>
  );
}
