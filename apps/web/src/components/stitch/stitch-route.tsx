import { StitchPage } from "@/components/stitch/stitch-page";
import type { ReactNode } from "react";

type StitchRouteProps = {
  screen: string;
  children: ReactNode;
  className?: string;
};

/** Wraps page content — shows Stitch export when available, else children */
export function StitchRoute({ screen, children, className }: StitchRouteProps) {
  return (
    <StitchPage screen={screen} fallback={children} className={className} />
  );
}
