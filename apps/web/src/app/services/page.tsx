import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/cms";
import { PageHero } from "@/components/shared/page-hero";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { StitchRoute } from "@/components/stitch/stitch-route";
import { stitchMetadata } from "@/lib/stitch/pages";

export const metadata = stitchMetadata("services");

export default function ServicesPage() {
  return (
    <StitchRoute screen="services">
    <>
      <PageHero
        title="Our Services"
        subtitle="End-to-end event management tailored to your vision"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.slug}
                className="glass-card group overflow-hidden transition-all hover:shadow-glow"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <DynamicIcon name={service.icon} className="h-6 w-6 text-primary" />
                    <h2 className="font-display text-xl font-bold">{service.title}</h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted">{service.description}</p>
                  <ul className="mt-4 grid grid-cols-2 gap-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between">
                    <p className="font-semibold text-primary">
                      From {formatCurrency(service.basePrice)}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/services/${service.slug}`}>Learn More</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="glass-card mx-auto max-w-2xl p-8">
              <h3 className="font-display text-2xl font-bold">Ready to Get Started?</h3>
              <p className="mt-2 text-muted">
                Book a consultation and let us bring your event to life.
              </p>
              <Button className="mt-6" size="lg" asChild>
                <Link href="/book-event">Book Your Event</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
    </StitchRoute>
  );
}
