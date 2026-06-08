import { StitchMain } from "@/components/stitch/stitch-main";
import { loadStitchScreen } from "@/lib/stitch/load-screen";
import type { ReactNode } from "react";

type StitchPageProps = {
  screen: string;
  fallback: ReactNode;
  className?: string;
};

export function StitchPage({ screen, fallback, className }: StitchPageProps) {
  const { html } = loadStitchScreen(screen);
  if (!html) return <>{fallback}</>;
  return <StitchMain html={html} className={className} />;
}
