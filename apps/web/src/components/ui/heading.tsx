import type { CSSProperties, ReactNode } from "react";
import { ViewTransition } from "@/components/ui/view-transition";
import { cn } from "@/lib/utils";

export type HeadingProps = {
  as: "h1" | "h2" | "h3";
  /** Defaults to `display` for h1, otherwise the tag's own size. */
  size?: "display-xl" | "display" | "h2" | "h3";
  /** One word (or phrase) wrapped in `.lux-accent-purple` — allowed once per page, H1 only. Needs string children. */
  accent?: string;
  /**
   * V7 word-by-word reveal (default on for h1/h2). Only string children are
   * split; the text nodes, spaces and accent stay exactly as written, so the
   * heading's text and accessible name are unchanged. h1 words rise on load,
   * h2 words on scroll; under reduced motion the words are plain inline text.
   */
  split?: boolean;
  id?: string;
  /** Shared-element name for a morph (e.g. `service-title-{slug}`). */
  viewTransitionName?: string;
  className?: string;
  children: ReactNode;
};

const Accent = ({ children }: { children: string }) => <span className="lux-accent-purple">{children}</span>;

function withAccent(children: ReactNode, accent?: string): ReactNode {
  if (!accent || typeof children !== "string") return children;
  const at = children.indexOf(accent);
  if (at < 0) return children;
  return (
    <>
      {children.slice(0, at)}
      <Accent>{accent}</Accent>
      {children.slice(at + accent.length)}
    </>
  );
}

/** Words as `<span class="lux-split__w" style="--w:i">`, whitespace kept as plain text nodes between them. */
function splitWords(text: string, accent: string | undefined): ReactNode[] {
  const at = accent ? text.indexOf(accent) : -1;
  const parts: { text: string; accent?: boolean }[] =
    accent && at >= 0
      ? [{ text: text.slice(0, at) }, { text: accent, accent: true }, { text: text.slice(at + accent.length) }]
      : [{ text }];

  const out: ReactNode[] = [];
  let w = 0;
  parts.forEach((part, p) => {
    if (part.accent) {
      out.push(
        <span key={`a${p}`} className="lux-split__w lux-split__w--accent" style={{ "--w": w++ } as CSSProperties}>
          <Accent>{part.text}</Accent>
        </span>
      );
      return;
    }
    part.text.split(/(\s+)/).forEach((token, t) => {
      if (!token) return;
      if (/^\s+$/.test(token)) out.push(token);
      else
        out.push(
          <span key={`${p}-${t}`} className="lux-split__w" style={{ "--w": w++ } as CSSProperties}>
            {token}
          </span>
        );
    });
  });
  return out;
}

export function Heading({ as: Tag, size, accent, split, id, viewTransitionName, className, children }: HeadingProps) {
  const resolved = size ?? (Tag === "h1" ? "display" : Tag);
  const doSplit = (split ?? Tag !== "h3") && typeof children === "string";
  const el = (
    <Tag
      id={id}
      className={cn("lux-heading", `lux-heading--${resolved}`, doSplit && "lux-split", doSplit && Tag === "h1" && "lux-split--load", className)}
    >
      {doSplit ? splitWords(children as string, accent) : withAccent(children, accent)}
    </Tag>
  );
  return viewTransitionName ? <ViewTransition name={viewTransitionName}>{el}</ViewTransition> : el;
}
