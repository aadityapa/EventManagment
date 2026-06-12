"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useId, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { BrandSection, BrandHeader } from "@/brand/primitives/brand-section";
import { BrandImage } from "@/brand/primitives/brand-image";
import { testimonials } from "@/data/cms";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function HomeTestimonials() {
  const carouselId = useId();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [sel, setSel] = useState(0);
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const fn = () => setSel(emblaApi.selectedScrollSnap());
    emblaApi.on("select", fn);
    fn();
    const t = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => {
      clearInterval(t);
      emblaApi.off("select", fn);
    };
  }, [emblaApi]);

  return (
    <BrandSection>
      <div ref={sectionRef}>
        <BrandHeader label="Client Stories" title="Voices of Excellence" subtitle="Trusted by families, brands, and institutions across India." center />
        <div className="mb-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={prev}
            aria-controls={carouselId}
            aria-label="Previous testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glitz-border)] text-[var(--glitz-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glitz-gold)]"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-controls={carouselId}
            aria-label="Next testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glitz-border)] text-[var(--glitz-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glitz-gold)]"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
        <div ref={emblaRef} id={carouselId} className="overflow-hidden" role="region" aria-roledescription="carousel" aria-label="Client testimonials">
          <div className="flex gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
                aria-hidden={sel !== i}
                className="min-w-0 flex-[0_0_100%] lg:flex-[0_0_75%]"
              >
                <div className={cn("brand-surface flex flex-col gap-6 p-8 sm:flex-row sm:items-center", sel !== i && "opacity-70")}>
                  <BrandImage src={t.image} alt={t.name} width={80} height={80} className="h-20 w-20 shrink-0 rounded-full border-2 border-[var(--glitz-gold)]/40" />
                  <div>
                    <Quote className="mb-2 h-5 w-5 text-[var(--glitz-gold)]/50" aria-hidden="true" />
                    <div className="mb-2 flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-[var(--glitz-gold)] text-[var(--glitz-gold)]" aria-hidden="true" />
                      ))}
                    </div>
                    <blockquote className="brand-display text-lg leading-relaxed">&ldquo;{t.content}&rdquo;</blockquote>
                    <p className="mt-3 font-semibold">{t.name}</p>
                    <p className="text-sm text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrandSection>
  );
}
