"use client";

import { type ReactNode, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGsapContext, gsap } from "@/lib/gsap/use-gsap";

interface LuxurySectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  dark?: boolean;
  gsapReveal?: boolean;
}

export function LuxurySection({
  children,
  className,
  id,
  label,
  title,
  subtitle,
  dark = true,
  gsapReveal = true,
}: LuxurySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGsapContext(
    sectionRef,
    () => {
      if (!gsapReveal) return;
      const heading = sectionRef.current?.querySelector("[data-luxury-heading]");
      if (heading) {
        gsap.from(heading.children, {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }
    },
    [gsapReveal, title]
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "relative py-20 sm:py-24 lg:py-32",
        dark ? "bg-background text-foreground" : "bg-card text-foreground",
        className
      )}
    >
      {(label || title) && (
        <div className="container-page mb-12 sm:mb-16" data-luxury-heading>
          {label && (
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-primary"
            >
              {label}
            </motion.span>
          )}
          {title && (
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight text-foreground">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
