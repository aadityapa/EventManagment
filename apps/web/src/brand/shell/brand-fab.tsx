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
      className="fixed bottom-4 right-4 z-[var(--z-fab,40)] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 safe-bottom sm:bottom-6 sm:right-6"
      role="group"
      aria-label="Quick actions"
    >
      <div className="hidden flex-col gap-2 md:flex">
        <a
          href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glitz-border)] bg-[var(--glitz-surface)] text-[var(--glitz-gold)] shadow-[var(--glitz-glow)]"
          aria-label="Call"
        >
          <Phone className="h-5 w-5" />
        </a>
        <Link
          href="/book-event"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--glitz-gold)] text-[#0A0A0A] shadow-[var(--glitz-glow)]"
          aria-label="Book"
        >
          <Calendar className="h-5 w-5" />
        </Link>
        <Link
          href="/book-event#ai-planner"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glitz-border)] bg-[var(--glitz-surface)] text-[var(--glitz-gold)] shadow-[var(--glitz-glow)]"
          aria-label="AI Event Planner"
        >
          <Sparkles className="h-5 w-5" />
        </Link>
      </div>
      <motion.a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg",
          "max-[380px]:px-3"
        )}
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
        <span className="max-[380px]:sr-only">WhatsApp</span>
      </motion.a>
    </div>
  );
}
