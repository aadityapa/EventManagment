"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/branding/logo";
import { StitchReveal, StitchSection } from "@/components/stitch";

export function CTASection() {
  return (
    <StitchSection className="pb-24">
      <div className="container-page">
        <StitchReveal variant="fadeScale">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 px-6 py-16 text-center sm:px-12 sm:py-20">
            <div className="absolute inset-0 shimmer-gold opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.15),transparent_50%)]" />

            <div className="relative z-10">
              <Logo href={undefined} className="mx-auto !h-16 !max-w-[200px]" />
              <h2 className="mt-6 font-display text-3xl font-bold text-black sm:text-4xl md:text-5xl">
                Ready to Create Magic?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-black/75 sm:text-lg">
                Schedule a complimentary consultation with our Pune event experts today.
              </p>
              <div className="mt-8">
                <Button asChild size="xl" className="shadow-glow">
                  <Link href="/contact">
                    <Calendar className="h-5 w-5" />
                    Book Consultation
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </StitchReveal>
      </div>
    </StitchSection>
  );
}
