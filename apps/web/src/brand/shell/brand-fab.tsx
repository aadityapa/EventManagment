"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MessageCircle, Phone, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function BrandFab() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-3 safe-bottom md:right-6" role="group" aria-label="Quick actions">
      <div className="hidden flex-col gap-2 md:flex">
        <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glitz-border)] bg-[var(--glitz-surface)] text-[var(--glitz-gold)] shadow-[var(--glitz-glow)]" aria-label="Call"><Phone className="h-5 w-5" /></a>
        <Link href="/book-event" className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--glitz-gold)] text-[#0A0A0A] shadow-[var(--glitz-glow)]" aria-label="Book"><Calendar className="h-5 w-5" /></Link>
        <Link href="/book-event#ai-planner" className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glitz-border)] bg-[var(--glitz-surface)] text-[var(--glitz-gold)] shadow-[var(--glitz-glow)]" aria-label="AI Event Planner"><Sparkles className="h-5 w-5" /></Link>
      </div>
      <motion.a href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.06 }} className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg" aria-label="WhatsApp"><MessageCircle className="h-5 w-5" /><span>WhatsApp</span></motion.a>
    </div>
  );
}
