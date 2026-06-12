import Link from "next/link";
import { BrandButton } from "@/brand/primitives/brand-button";

export default function NotFound() {
  return (
    <div className="brand-root flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="brand-label mb-4">404</span>
      <h1 className="brand-display text-section-title font-bold">
        This Page Has <span className="brand-gold-text">Left the Stage</span>
      </h1>
      <p className="mt-4 max-w-md text-[var(--glitz-muted)]">
        The celebration you&apos;re looking for may have moved venues. Let us guide you back to extraordinary experiences.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <BrandButton href="/">Return Home</BrandButton>
        <Link
          href="/contact"
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-[var(--glitz-border)] px-8 py-3 text-sm font-semibold text-[var(--glitz-text)] transition-colors hover:border-[var(--glitz-gold)]"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
