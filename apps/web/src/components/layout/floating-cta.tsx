"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MessageCircle, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function FloatingCTA() {
  const pathname = usePathname();
  const hidden = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (hidden) return null;

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`;
  const telUrl = `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`;

  return (
    <div
      className="site-widget fixed bottom-6 right-4 z-40 flex flex-col gap-3 safe-bottom md:bottom-8 md:right-6"
      role="group"
      aria-label="Quick contact actions"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        className="hidden flex-col gap-2 md:flex"
      >
        <a
          href={telUrl}
          className={cn(
            "touch-target flex h-12 w-12 items-center justify-center rounded-full",
            "border border-primary/30 bg-card text-primary shadow-glow transition-transform hover:scale-110"
          )}
          aria-label={`Call ${SITE_CONFIG.phone}`}
        >
          <Phone className="h-5 w-5" />
        </a>
        <Link
          href="/book-event"
          className={cn(
            "touch-target flex h-12 w-12 items-center justify-center rounded-full",
            "bg-primary text-primary-foreground shadow-glow transition-transform hover:scale-110"
          )}
          aria-label="Book consultation"
        >
          <Calendar className="h-5 w-5" />
        </Link>
      </motion.div>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "touch-target flex items-center gap-2 rounded-full px-4 py-3 md:px-5",
          "bg-[#25D366] text-white shadow-[0_4px_24px_rgba(37,211,102,0.4)]"
        )}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-5 w-5 shrink-0" />
        <span className="text-sm font-semibold">WhatsApp</span>
      </motion.a>
    </div>
  );
}
