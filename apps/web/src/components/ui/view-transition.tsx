import * as React from "react";
import type { ComponentType, ReactNode } from "react";

/** Class name(s) React assigns to the view-transition pseudo-elements; "none" switches a state off. */
type TransitionClass = string | Record<string, string>;

export type ViewTransitionProps = {
  /** Shared-element name; must be unique per page. Omit for "auto". */
  name?: string;
  default?: TransitionClass;
  enter?: TransitionClass;
  exit?: TransitionClass;
  update?: TransitionClass;
  share?: TransitionClass;
  children?: ReactNode;
};

// The vendored React canary exports ViewTransition at runtime (client and
// react-server builds alike), but @types/react does not type it. Read it off
// the namespace so tsc is happy, and fall back to a fragment where it is absent.
const Impl = (React as unknown as { ViewTransition?: ComponentType<ViewTransitionProps> }).ViewTransition;

export function ViewTransition(props: ViewTransitionProps) {
  if (!Impl) return <>{props.children}</>;
  return <Impl {...props} />;
}
