"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { LuxuryImage } from "@/components/shared/luxury-image";

interface LightboxProps {
  images: { src: string; alt: string }[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null;

  const prev = useCallback(() => {
    if (index === null) return;
    onNavigate(index === 0 ? images.length - 1 : index - 1);
  }, [index, images.length, onNavigate]);

  const next = useCallback(() => {
    if (index === null) return;
    onNavigate(index === images.length - 1 ? 0 : index + 1);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary/10"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary/10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary/10"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <LuxuryImage
              src={images[index].src}
              alt={images[index].alt}
              width={1400}
              height={900}
              className="max-h-[85vh] w-auto rounded-lg"
              priority
            />
            <p className="mt-4 text-center text-sm text-muted">{images[index].alt}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
