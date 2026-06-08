"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { CinematicHero } from "@/components/shared/cinematic-hero";
import { PageSection, SectionHeader } from "@/components/shared/page-section";
import { LuxuryImage } from "@/components/shared/luxury-image";
import { testimonials } from "@/data/cms";
import { IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";

export function TestimonialsPageContent() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const interval = setInterval(() => emblaApi.scrollNext(), 7000);
    return () => { clearInterval(interval); emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <>
      <CinematicHero
        label="Client Stories"
        title="Voices of Excellence"
        subtitle="Trusted by India's most discerning families, brands, and institutions."
        image={IMAGES.testimonials[0]}
        size="full"
      />

      <PageSection>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-border/60 px-4 py-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-semibold">4.9 on Google Reviews</span>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={scrollPrev} className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-primary hover:border-primary" aria-label="Previous">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={scrollNext} className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-primary hover:border-primary" aria-label="Next">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-6">
            {testimonials.map((t, i) => (
              <div key={t.id} className="min-w-0 flex-[0_0_100%] lg:flex-[0_0_70%]">
                <motion.div animate={{ opacity: selected === i ? 1 : 0.7 }} className="luxury-card flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
                  <LuxuryImage src={t.image} alt={t.name} width={80} height={80} className="h-20 w-20 shrink-0 rounded-full border-2 border-primary/40" />
                  <div className="flex-1">
                    <Quote className="mb-2 h-6 w-6 text-primary/50" />
                    <div className="mb-3 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <blockquote className="font-display text-lg leading-relaxed sm:text-xl">&ldquo;{t.content}&rdquo;</blockquote>
                    <p className="mt-4 font-semibold">{t.name}</p>
                    <p className="text-sm text-muted">{t.role}</p>
                    <span className="mt-1 inline-block text-xs font-semibold uppercase tracking-wider text-primary">{t.eventType.replace(/_/g, " ")}</span>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button key={i} type="button" onClick={() => emblaApi?.scrollTo(i)} className={cn("h-1.5 rounded-full transition-all", selected === i ? "w-8 bg-primary" : "w-1.5 bg-border")} aria-label={`Go to ${i + 1}`} />
          ))}
        </div>
      </PageSection>

      <PageSection dark={false} className="bg-card">
        <SectionHeader label="Google Reviews" title="What Our Clients Say" align="center" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <article key={t.id} className="luxury-card p-6">
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted line-clamp-4">&ldquo;{t.content}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <LuxuryImage src={t.image} alt={t.name} width={40} height={40} className="h-10 w-10 rounded-full" />
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </PageSection>
    </>
  );
}
