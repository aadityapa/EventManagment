import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  className?: string;
};

/** Luxury coming-soon badge for placeholder media */
export function ComingSoonOverlay({ label = "Coming Soon", className }: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center bg-black/35 backdrop-blur-[2px]",
        className
      )}
      aria-hidden
    >
      <span className="rounded-full border border-[var(--gold)]/45 bg-black/55 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#fff8eb] shadow-[0_0_24px_rgba(201,162,39,0.25)]">
        {label}
      </span>
    </div>
  );
}
