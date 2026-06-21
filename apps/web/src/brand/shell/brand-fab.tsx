"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MessageCircle, Phone, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BrandFab() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;

  const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`;

  return (
    <div
      className="quick-actions fixed left-6 top-1/2 z-[1000] hidden -translate-y-1/2 flex-col items-center gap-4 md:flex lg:left-6"
      role="group"
      aria-label="Quick actions"
    >
      <a
        href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
        className="quick-actions__btn flex items-center justify-center rounded-full border border-[var(--glitz-border)] bg-[var(--glitz-glass)] text-[var(--glitz-gold)] shadow-[var(--glitz-glow)] backdrop-blur-xl transition-transform hover:scale-105"
        aria-label="Call Nexyyra Events"
      >
        <Phone className="h-6 w-6" aria-hidden="true" />
      </a>
      <Link
        href="/book-event"
        className="quick-actions__btn flex items-center justify-center rounded-full bg-[var(--glitz-gold)] text-[#0A0A0A] shadow-[var(--glitz-glow)] transition-transform hover:scale-105"
        aria-label="Book consultation"
      >
        <Calendar className="h-6 w-6" aria-hidden="true" />
      </Link>
      <Link
        href="/book-event#ai-planner"
        className="quick-actions__btn flex items-center justify-center rounded-full border border-[var(--glitz-border)] bg-[var(--glitz-glass)] text-[var(--glitz-gold)] shadow-[var(--glitz-glow)] backdrop-blur-xl transition-transform hover:scale-105"
        aria-label="AI Event Planner"
      >
        <Sparkles className="h-6 w-6" aria-hidden="true" />
      </Link>
      <motion.a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "quick-actions__btn flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform"
        )}
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6 shrink-0" aria-hidden="true" />
      </motion.a>
    </div>
  );
}
