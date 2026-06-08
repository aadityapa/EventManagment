"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, MessageCircle, Phone } from "lucide-react";
import { EVENT_IMAGES } from "@/lib/images";
import { companyProfile } from "@/data/cms";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/branding/logo";
import { getWhatsAppUrl } from "@/lib/utils";

const ROTATING_WORDS = ["Weddings", "Corporate Galas", "Concerts", "Celebrations"];

const heroStats = [
  { label: "Events Managed", value: `${companyProfile.stats.eventsManaged}+` },
  { label: "Happy Clients", value: `${companyProfile.stats.happyClients}+` },
  { label: "Years Experience", value: `${companyProfile.stats.yearsExperience}+` },
  { label: "Cities Covered", value: `${companyProfile.stats.citiesCovered}+` },
];

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-[#faf8f5]">
      <Image
        src={EVENT_IMAGES.hero}
        alt="Luxury event celebration"
        fill
        priority
        className="object-cover opacity-[0.38]"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/55 via-[#faf8f5]/75 to-[#faf8f5]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#faf8f5_72%)]" />

      <div className="relative z-10 container-page py-16 text-center sm:py-24 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl rounded-2xl border border-primary/15 bg-white/80 px-6 py-10 shadow-[0_20px_60px_rgba(184,134,11,0.08)] backdrop-blur-md sm:px-10 sm:py-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6 flex justify-center sm:mb-8"
          >
            <Logo href={undefined} priority className="!h-16 sm:!h-24" />
          </motion.div>

          <h1 className="font-display text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.15] tracking-tight text-[#1c1814]">
            <span className="block">Creating</span>
            <span className="gradient-text block">Extraordinary</span>
            <span className="block">Experiences</span>
          </h1>

          <span className="relative mt-4 inline-flex h-[1.3em] min-w-[200px] items-center justify-center sm:min-w-[280px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={ROTATING_WORDS[wordIndex]}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="font-brand absolute text-lg text-primary sm:text-2xl"
              >
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#5a5248] sm:text-lg">
            Luxury Event Management &amp; Promotional Solutions — Pune&apos;s premier destination
            for weddings, corporate events, concerts, and celebrity celebrations.
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button asChild size="lg" className="magnetic-hover w-full shadow-glow sm:w-auto">
              <Link href="/book-event">
                <Calendar className="h-5 w-5" />
                Book Event
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="magnetic-hover w-full border-primary/40 text-[#1c1814] hover:bg-primary/10 sm:w-auto"
            >
              <Link href="/contact">
                Free Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="whatsapp" size="lg" className="magnetic-hover w-full sm:w-auto">
              <a
                href={getWhatsAppUrl("Hi Glitz Events! I'd like to discuss an event.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </Button>
          </div>

          <a
            href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent"
          >
            <Phone className="h-4 w-4" />
            {SITE_CONFIG.phone}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 rounded-2xl border border-primary/10 bg-white/70 p-4 backdrop-blur-sm sm:grid-cols-4 sm:gap-6 sm:p-6"
        >
          {heroStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-bold gradient-text sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
