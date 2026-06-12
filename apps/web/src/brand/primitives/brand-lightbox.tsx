"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { BrandImage } from "./brand-image";

interface BrandLightboxProps {
  images: { src: string; alt: string }[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}

export function BrandLightbox({ images, index, onClose, onNavigate }: BrandLightboxProps) {
  const open = index !== null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/96 p-4"
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
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glitz-border)] text-[var(--glitz-gold)]"
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
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--glitz-border)] text-[var(--glitz-gold)]"
            aria-label="Next image"
          >
            <ChevronRight />
          </button>
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-h-[85vh] max-w-[92vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <BrandImage src={images[index].src} alt={images[index].alt} width={1600} height={1000} className="max-h-[85vh] w-auto rounded-lg" priority />
            <p className="mt-3 text-center text-sm text-muted">{images[index].alt}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
