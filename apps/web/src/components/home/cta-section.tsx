"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 sm:py-20"
          style={{ background: "var(--gradient-gold)" }}
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, rgba(0,0,0,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0,0,0,0.2) 0%, transparent 50%)",
              }}
            />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-black/10"
            >
              <Sparkles className="h-7 w-7 text-black/70" />
            </motion.div>

            <h2 className="font-display text-3xl font-bold text-black sm:text-4xl md:text-5xl">
              Ready to Create Magic?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-black/70 sm:text-lg">
              Let&apos;s bring your vision to life. Schedule a complimentary
              consultation with our expert event planners today.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Button
                asChild
                size="xl"
                className="bg-black text-white shadow-lg hover:bg-black/90 hover:scale-[1.02]"
              >
                <Link href="/contact">
                  <Calendar className="h-5 w-5" />
                  Book Consultation
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
