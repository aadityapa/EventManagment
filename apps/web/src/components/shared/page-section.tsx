import { cn } from "@/lib/utils";

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
}

export function PageSection({ children, className, id, dark = true }: PageSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "section-y",
        dark ? "bg-background" : "bg-card",
        className
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeader({ label, title, subtitle, align = "left" }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 sm:mb-16", align === "center" && "text-center mx-auto max-w-3xl")}>
      {label && (
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          {label}
        </span>
      )}
      <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-tight text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>
      )}
    </div>
  );
}
