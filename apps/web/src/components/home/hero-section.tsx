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
import { GoldParticles } from "@/components/effects/gold-particles";
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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={EVENT_IMAGES.hero}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_25fps.mp4" type="video/mp4" />
      </video>
      <Image
        src={EVENT_IMAGES.hero}
        alt="Luxury event celebration"
        fill
        priority
        className="object-cover opacity-0"
        sizes="100vw"
        aria-hidden
      />

      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/60" />
      <GoldParticles className="pointer-events-none absolute inset-0 z-[1]" />

      <div className="relative z-10 container-page py-20 text-center sm:py-28 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 flex justify-center"
          >
            <Logo href={undefined} priority className="!h-14 sm:!h-20" />
          </motion.div>

          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            <span className="block text-balance">Creating Extraordinary</span>
            <span className="block text-balance">Experiences</span>
            <span className="relative mt-3 inline-flex h-[1.2em] w-full min-w-0 items-center justify-center sm:min-w-[320px] md:min-w-[400px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROTATING_WORDS[wordIndex]}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                  className="gradient-text absolute font-brand text-2xl sm:text-3xl md:text-4xl"
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-base text-white/75 sm:text-lg md:text-xl"
          >
            Luxury Event Management &amp; Promotional Solutions — Pune&apos;s premier destination
            for weddings, corporate events, concerts, and celebrity celebrations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 px-2 sm:mt-10 sm:flex-row sm:items-center sm:gap-4 sm:px-0"
          >
            <Button asChild size="xl" className="magnetic-hover w-full shadow-glow sm:w-auto">
              <Link href="/book-event">
                <Calendar className="h-5 w-5" />
                Book Event
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="magnetic-hover w-full border-primary/40 text-white hover:bg-primary/10 sm:w-auto">
              <Link href="/contact">
                Get Free Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="whatsapp" size="xl" className="magnetic-hover w-full sm:w-auto">
              <a href={getWhatsAppUrl("Hi Glitz Events! I'd like to discuss an event.")} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                WhatsApp Us
              </a>
            </Button>
          </motion.div>

          <motion.a
            href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:text-accent"
          >
            <Phone className="h-4 w-4" />
            {SITE_CONFIG.phone}
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 rounded-2xl glass p-4 sm:mt-16 sm:gap-6 sm:p-6 md:grid-cols-4 md:p-8"
        >
          {heroStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-2xl font-bold gradient-text sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-white/55 sm:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="h-10 w-6 rounded-full border-2 border-primary/40 p-1"
        >
          <div className="mx-auto h-2 w-1 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
