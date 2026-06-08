"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { LuxurySection } from "@/components/shared/luxury-section";
import { testimonials } from "@/data/cms";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    const interval = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <LuxurySection
      label="Client Stories"
      title="Voices of Excellence"
      subtitle="Trusted by India's most discerning families, brands, and institutions."
      className="bg-secondary/30"
    >
      <div className="container-page relative">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-border/60 px-4 py-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-semibold text-foreground">4.9 on Google Reviews</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              className="touch-target flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-primary transition-colors hover:border-primary hover:bg-primary/10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="touch-target flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-primary transition-colors hover:border-primary hover:bg-primary/10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div ref={emblaRef} className="overflow-hidden" aria-roledescription="carousel">
          <div className="flex gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_85%] lg:flex-[0_0_70%]"
                aria-roledescription="slide"
                aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
              >
                <motion.div
                  animate={{ opacity: selected === i ? 1 : 0.6, scale: selected === i ? 1 : 0.97 }}
                  className="luxury-card flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:p-10"
                >
                  <div className="relative shrink-0">
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-full border-2 border-primary/40 object-cover"
                    />
                    <Quote className="absolute -right-2 -top-2 h-6 w-6 text-primary/60" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-3 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <blockquote className="font-display text-lg leading-relaxed text-foreground sm:text-xl">
                      &ldquo;{t.content}&rdquo;
                    </blockquote>
                    <div className="mt-4">
                      <p className="font-semibold text-foreground">{t.name}</p>
                      <p className="text-sm text-muted">{t.role}</p>
                      <span className="mt-1 inline-block text-xs font-semibold uppercase tracking-wider text-primary">
                        {t.eventType.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                selected === i ? "w-8 bg-primary" : "w-1.5 bg-border"
              )}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </LuxurySection>
  );
}
