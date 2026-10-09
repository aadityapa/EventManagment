import Link from "next/link";
import { cn } from "@/lib/utils";

export type PaginationProps = {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
  ariaLabel?: string;
  className?: string;
};

type Slot = number | "gap";

/** 1 … p-1 p p+1 … n — never more than seven slots. */
export function pageWindow(page: number, pageCount: number): Slot[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const wanted = [1, page - 1, page, page + 1, pageCount].filter((p) => p >= 1 && p <= pageCount);
  const unique = [...new Set(wanted)].sort((a, b) => a - b);
  const out: Slot[] = [];
  let previous = 0;
  for (const p of unique) {
    if (p - previous > 1) out.push("gap");
    out.push(p);
    previous = p;
  }
  return out;
}

/** Crawlable prev/next + numbered links (`?page=`), 44px targets. Blog index and gallery (page size 24). */
export function Pagination({ page, pageCount, hrefFor, ariaLabel = "Pagination", className }: PaginationProps) {
  if (pageCount <= 1) return null;
  return (
    <nav className={cn("lux-pagination", className)} aria-label={ariaLabel}>
      <ul>
        <li>
          {page > 1 ? (
            <Link href={hrefFor(page - 1)} rel="prev" prefetch={false}>
              Previous
            </Link>
          ) : (
            <span aria-disabled="true">Previous</span>
          )}
        </li>
        {pageWindow(page, pageCount).map((slot, i) =>
          slot === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true">
              <span className="lux-pagination__gap">…</span>
            </li>
          ) : (
            <li key={slot}>
              <Link href={hrefFor(slot)} prefetch={false} aria-current={slot === page ? "page" : undefined} aria-label={`Page ${slot}`}>
                {slot}
              </Link>
            </li>
          )
        )}
        <li>
          {page < pageCount ? (
            <Link href={hrefFor(page + 1)} rel="next" prefetch={false}>
              Next
            </Link>
          ) : (
            <span aria-disabled="true">Next</span>
          )}
        </li>
      </ul>
    </nav>
  );
}
