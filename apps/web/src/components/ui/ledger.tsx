import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type LedgerRow = {
  id?: string;
  /** Overrides the auto "01", "02" … when `numerals` is on. */
  numeral?: string;
  term: ReactNode;
  body?: ReactNode;
  /** Extra cells (table columns; stacked small lines in ol/dl). */
  cells?: ReactNode[];
  /** Makes the term a link (city lists, contact lines). */
  href?: string;
};

export type LedgerProps = {
  as: "ol" | "dl" | "table";
  rows: LedgerRow[];
  /** Rows flow into 2 or 4 columns at ≥ 768 (phones single column, numeral left). */
  columns?: 1 | 2 | 4;
  /** Gold Cormorant numerals; otherwise each row carries the jewel dot. */
  numerals?: boolean;
  caption?: string;
  /** Column headers for `table`. */
  head?: string[];
  className?: string;
  ariaLabel?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

function Term({ row }: { row: LedgerRow }) {
  if (!row.href) return <>{row.term}</>;
  return (
    <Link href={row.href} prefetch={false} className="lux-ledger__link">
      {row.term}
    </Link>
  );
}

/** Hairline rows with numeral/term in gold Cormorant and Manrope body — replaces every glass card. */
export function Ledger({ as, rows, columns = 1, numerals = false, caption, head, className, ariaLabel }: LedgerProps) {
  if (as === "table") {
    return (
      <table className={cn("lux-ledger lux-ledger--table", className)}>
        {caption ? <caption>{caption}</caption> : null}
        {head ? (
          <thead>
            <tr>
              {numerals ? <th scope="col" aria-label="Number" /> : null}
              {head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="lux-ledger__row">
              {numerals ? <td className="lux-ledger__num">{row.numeral ?? pad(i + 1)}</td> : null}
              <th scope="row" className="lux-ledger__term">
                <Term row={row} />
              </th>
              {row.body !== undefined ? <td className="lux-ledger__body">{row.body}</td> : null}
              {row.cells?.map((cell, j) => (
                <td key={j} className="lux-ledger__cell">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  const List = as;
  const listClass = cn("lux-ledger", columns > 1 && `lux-ledger--${columns}`, !numerals && "lux-ledger--jewel", className);
  const numeral = (row: LedgerRow, i: number) => row.numeral ?? pad(i + 1);
  const marker = (row: LedgerRow, i: number) =>
    numerals ? (
      <span className="lux-ledger__num" aria-hidden="true">
        {numeral(row, i)}
      </span>
    ) : (
      <span className="lux-ledger__jewel" aria-hidden="true" />
    );
  // A <div> inside a <dl> may hold only dt/dd, so dl rows draw the marker as the
  // row's ::before (primitives.css) from these attributes instead of a <span>.
  const dlMarker = (row: LedgerRow, i: number) =>
    numerals ? { "data-numeral": numeral(row, i) } : { "data-marker": "jewel" };

  return (
    <>
      {caption ? <p className="lux-ledger__caption lux-small">{caption}</p> : null}
      <List className={listClass} aria-label={ariaLabel}>
        {rows.map((row, i) =>
          as === "dl" ? (
            <div key={row.id ?? i} className="lux-ledger__row" {...dlMarker(row, i)}>
              <dt className="lux-ledger__term">
                <Term row={row} />
              </dt>
              {row.body !== undefined ? <dd className="lux-ledger__body">{row.body}</dd> : null}
              {row.cells?.map((cell, j) => (
                <dd key={j} className="lux-ledger__cell">
                  {cell}
                </dd>
              ))}
            </div>
          ) : (
            <li key={row.id ?? i} className="lux-ledger__row">
              {marker(row, i)}
              <span className="lux-ledger__term">
                <Term row={row} />
              </span>
              {row.body !== undefined ? <span className="lux-ledger__body">{row.body}</span> : null}
              {row.cells?.map((cell, j) => (
                <span key={j} className="lux-ledger__cell">
                  {cell}
                </span>
              ))}
            </li>
          )
        )}
      </List>
    </>
  );
}
