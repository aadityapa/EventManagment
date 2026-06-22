"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, FileText, MessageCircle, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

type FabItem =
  | { id: string; kind: "external"; href: string; label: string; icon: LucideIcon; accent?: "whatsapp" }
  | { id: string; kind: "tel"; href: string; label: string; icon: LucideIcon }
  | { id: string; kind: "link"; href: string; label: string; icon: LucideIcon };

const whatsappHref = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hello Nexyyra Events, I'd like to discuss an event.",
)}`;

const FAB_ITEMS: FabItem[] = [
  { id: "whatsapp", kind: "external", href: whatsappHref, label: "WhatsApp", icon: MessageCircle, accent: "whatsapp" },
  { id: "call", kind: "tel", href: `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`, label: "Call", icon: Phone },
  { id: "book", kind: "link", href: "/book-event", label: "Book Consultation", icon: Calendar },
  { id: "quote", kind: "link", href: "/book-event?intent=quote", label: "Quick Quote", icon: FileText },
];

const STAGGER = 0.07;

function FabTooltip({ label }: { label: string }) {
  return (
    <span
      className="quick-actions__tooltip pointer-events-none absolute right-[calc(100%+0.75rem)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-[var(--glitz-border)] bg-[var(--glitz-surface)] px-3 py-1.5 text-xs font-medium text-primary shadow-lg md:block"
      role="tooltip"
    >
      {label}
    </span>
  );
}

function FabButton({
  item,
  index,
}: {
  item: FabItem;
  index: number;
}) {
  const Icon = item.icon;
  const className = cn(
    "quick-actions__btn relative flex items-center justify-center rounded-full shadow-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--glitz-gold)]",
    "accent" in item && item.accent === "whatsapp"
      ? "bg-[#25D366] text-white"
      : item.kind === "link" && item.id === "book"
        ? "bg-[var(--glitz-gold)] text-[#0A0A0A]"
        : "border border-[var(--glitz-border)] bg-[var(--glitz-glass)] text-[var(--glitz-gold)] backdrop-blur-xl",
  );

  const motionProps = {
    initial: { opacity: 0, x: 48 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.45, delay: index * STAGGER, ease: [0.22, 1, 0.36, 1] as const },
    whileHover: { scale: 1.08 },
    whileTap: { scale: 0.96 },
  };

  const inner = (
    <>
      <FabTooltip label={item.label} />
      <Icon className="h-5 w-5 shrink-0 md:h-6 md:w-6" aria-hidden="true" />
    </>
  );

  if (item.kind === "external") {
    return (
      <motion.a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={item.label}
        {...motionProps}
      >
        {inner}
      </motion.a>
    );
  }

  if (item.kind === "tel") {
    return (
      <motion.a href={item.href} className={className} aria-label={item.label} {...motionProps}>
        {inner}
      </motion.a>
    );
  }

  if (item.kind === "link") {
    return (
      <motion.div {...motionProps} className="inline-flex">
        <Link href={item.href} className={className} aria-label={item.label}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  return null;
}

export function BrandFab() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;

  return (
    <aside
      className="quick-actions pointer-events-none fixed bottom-4 right-4 z-[9990] flex flex-col items-end gap-3 md:bottom-6 md:right-6"
      aria-label="Quick contact actions"
    >
      <div className="pointer-events-auto flex flex-col items-end gap-3" role="group" aria-label="Contact shortcuts">
        {FAB_ITEMS.map((item, index) => (
          <FabButton key={item.id} item={item} index={index} />
        ))}
      </div>
    </aside>
  );
}
