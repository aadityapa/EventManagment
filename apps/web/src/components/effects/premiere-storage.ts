/**
 * Premiere "seen" storage — kept in a tiny standalone module so the shell can
 * check first-visit state WITHOUT pulling the full UniverseLoader (framer-motion
 * animation code) into the initial bundle.
 */
export const LOADER_STORAGE_KEY = "glitz-v7-luxury-premiere-seen";
export const LEGACY_LOADER_KEY = "glitz-loader-seen";

export function hasSeenPremiere() {
  if (typeof window === "undefined") return false;
  try {
    // localStorage: play the premiere once per visitor, not once per session.
    return (
      localStorage.getItem(LOADER_STORAGE_KEY) === "1" ||
      sessionStorage.getItem(LOADER_STORAGE_KEY) === "1" ||
      sessionStorage.getItem(LEGACY_LOADER_KEY) === "1"
    );
  } catch {
    return true; // storage blocked — never gate content behind the intro
  }
}
