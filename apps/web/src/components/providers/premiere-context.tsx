"use client";

import { createContext, useContext } from "react";

export type PremiereContextValue = {
  /** User has already seen the intro this session */
  skipPremiere: boolean;
  /** Phase 5 handoff started — homepage + nav begin entering */
  handoffActive: boolean;
  /** Intro fully complete — loader unmounted */
  premiereComplete: boolean;
};

const defaultValue: PremiereContextValue = {
  skipPremiere: true,
  handoffActive: false,
  premiereComplete: true,
};

export const PremiereContext = createContext<PremiereContextValue>(defaultValue);

export function usePremiere() {
  return useContext(PremiereContext);
}
