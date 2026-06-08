import Image from "next/image";
import { Star, Play } from "lucide-react";
import { testimonials } from "@/data/cms";
import { StitchRoute } from "@/components/stitch/stitch-route";
import { stitchMetadata } from "@/lib/stitch/pages";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata = stitchMetadata("testimonials");

export default function TestimonialsPage() {
  return (
    <StitchRoute screen="testimonials">
    <>
      <PageHero
        title="Client Testimonials"
        subtitle="Stories from those who've experienced the Glitz difference"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <article key={t.id} className="glass-card p-6">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mt-4 text-muted">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-muted">{t.role}</p>
                  </div>
                </div>
                <span className="mt-3 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                  {t.eventType.replace(/_/g, " ")}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/5 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Video Stories"
            title="Hear From Our Clients"
            description="Watch video testimonials from our happy clients."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl gradient-dark"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.2),transparent_70%)]" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full gradient-gold transition-transform group-hover:scale-110">
                  <Play className="h-8 w-8 text-black" />
                </div>
                <p className="absolute bottom-4 left-4 text-sm text-white/70">
                  Client Story #{n}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
    </StitchRoute>
  );
}
