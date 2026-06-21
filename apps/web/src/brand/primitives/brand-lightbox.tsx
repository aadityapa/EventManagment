"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { BrandImage } from "./brand-image";
import { EASE, DUR } from "@/lib/motion";

interface BrandLightboxProps {
  images: { src: string; alt: string }[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
  /** Cinematic scale/fade transitions (V4 gallery). */
  cinematic?: boolean;
}

export function BrandLightbox({
  images,
  index,
  onClose,
  onNavigate,
  cinematic = false,
}: BrandLightboxProps) {
  const open = index !== null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  const prev = useCallback(() => {
    if (index !== null) onNavigate(index === 0 ? images.length - 1 : index - 1);
  }, [index, images.length, onNavigate]);

  const next = useCallback(() => {
    if (index !== null) onNavigate(index === images.length - 1 ? 0 : index + 1);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, prev, next]);

  const backdropTransition = reducedMotion
    ? { duration: 0 }
    : { duration: cinematic ? DUR.cinematic : DUR.base, ease: EASE.silk };

  const imageTransition = reducedMotion
    ? { duration: 0 }
    : {
        duration: cinematic ? DUR.slow : DUR.base,
        ease: EASE.luxe,
      };

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={backdropTransition}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/96 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={onClose}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--glitz-border)] text-[var(--glitz-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glitz-gold)]"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glitz-border)] text-[var(--glitz-gold)] transition-colors hover:border-[var(--glitz-gold)]/60 hover:bg-[var(--glitz-gold)]/10"
            aria-label="Previous image"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-16 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glitz-border)] text-[var(--glitz-gold)] transition-colors hover:border-[var(--glitz-gold)]/60 hover:bg-[var(--glitz-gold)]/10"
            aria-label="Next image"
          >
            <ChevronRight />
          </button>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={
                reducedMotion ? false : { opacity: 0, scale: cinematic ? 0.92 : 0.96, y: cinematic ? 24 : 0 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reducedMotion ? undefined : { opacity: 0, scale: cinematic ? 0.94 : 0.96, y: cinematic ? -12 : 0 }
              }
              transition={imageTransition}
              className="relative max-h-[85vh] max-w-[92vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <BrandImage
                src={images[index].src}
                alt={images[index].alt}
                width={1600}
                height={1000}
                className="max-h-[85vh] w-auto rounded-[var(--v4-radius-lg)] shadow-[var(--v4-glow-gold)]"
                priority
              />
              <p className="mt-3 text-center text-sm text-white/70">{images[index].alt}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
