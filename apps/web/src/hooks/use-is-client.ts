"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** True after hydration; false on the server and during the hydration pass. */
export function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
