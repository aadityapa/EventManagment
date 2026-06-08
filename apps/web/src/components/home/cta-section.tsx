"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
      <div className="gold-divider absolute top-0 left-0 right-0" />

      <div className="container-page relative text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
        >
          Begin Your Story
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-bold"
        >
          Ready to Create Something{" "}
          <span className="gradient-text">Extraordinary?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-xl text-muted"
        >
          Schedule a private consultation with our luxury event specialists. Your extraordinary
          experience begins with a single conversation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button size="lg" className="min-w-[220px] shadow-glow" asChild>
            <Link href="/book-event">
              Book Consultation <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="min-w-[220px] border-primary/40" asChild>
            <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}>
              <Phone className="mr-2 h-4 w-4" /> {SITE_CONFIG.phone}
            </a>
          </Button>
        </motion.div>
      </div>

      <div className="gold-divider absolute bottom-0 left-0 right-0" />
    </section>
  );
}
