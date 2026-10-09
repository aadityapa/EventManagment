import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export type TabItem = { href: string; label: string; count?: number };

/** Server-rendered link tabs for crawlable filters (`?f=`, `?c=`); the active tab is `aria-current="page"`. */
export function Tabs({ items, current, ariaLabel, className }: { items: TabItem[]; current: string; ariaLabel: string; className?: string }) {
  return (
    <nav className={cn("lux-tabs", className)} aria-label={ariaLabel}>
      <ul>
        {items.map((tab) => (
          <li key={tab.href}>
            <Link href={tab.href} prefetch={false} aria-current={tab.href === current ? "page" : undefined}>
              {tab.label}
              {tab.count !== undefined ? <span className="lux-tabs__count">{tab.count}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export type TabsRadioProps = {
  /** Input name; each radio gets `id="{name}-{value}"` for `:has(#name-value:checked)` filters. */
  name: string;
  items: { value: string; label: string }[];
  defaultValue: string;
  /** Visually hidden legend for the group. */
  legend?: string;
  className?: string;
};

/** Radios + labels for zero-JS in-page filtering via `:has()`; use only where the URL need not change. */
export function TabsRadio({ name, items, defaultValue, legend = "Filter", className }: TabsRadioProps) {
  return (
    <fieldset className={cn("lux-tabs lux-tabs--radio", className)}>
      <legend className="sr-only">{legend}</legend>
      {items.map((item) => {
        const id = `${name}-${item.value}`;
        return (
          <Fragment key={item.value}>
            <input type="radio" className="lux-tabs__radio" name={name} id={id} value={item.value} defaultChecked={item.value === defaultValue} />
            <label htmlFor={id}>{item.label}</label>
          </Fragment>
        );
      })}
    </fieldset>
  );
}
