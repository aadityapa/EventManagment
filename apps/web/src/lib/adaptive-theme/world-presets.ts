/**
 * V5 world atmosphere presets — merged with frame analysis at runtime.
 * Apply via `data-world="wedding"` on `<html>` or section wrapper.
 */

export type WorldPresetId = "wedding" | "corporate" | "destination" | "celebration" | "culture";

export type WorldPreset = {
  id: WorldPresetId;
  label: string;
  tint: string;
  glow: string;
  atmosphere: string;
  surface: string;
};

export const WORLD_PRESETS: Record<WorldPresetId, WorldPreset> = {
  wedding: {
    id: "wedding",
    label: "Wedding World",
    tint: "rgba(247, 243, 235, 0.08)",
    glow: "#f5d76e",
    atmosphere: "rgba(230, 198, 122, 0.14)",
    surface: "rgba(253, 251, 245, 0.55)",
  },
  corporate: {
    id: "corporate",
    label: "Corporate World",
    tint: "rgba(244, 239, 229, 0.06)",
    glow: "#d8b26e",
    atmosphere: "rgba(201, 162, 39, 0.08)",
    surface: "rgba(247, 243, 235, 0.5)",
  },
  destination: {
    id: "destination",
    label: "Destination World",
    tint: "rgba(184, 134, 11, 0.05)",
    glow: "#b8860b",
    atmosphere: "rgba(184, 134, 11, 0.12)",
    surface: "rgba(244, 239, 229, 0.48)",
  },
  celebration: {
    id: "celebration",
    label: "Celebration World",
    tint: "rgba(253, 251, 245, 0.1)",
    glow: "#e6c67a",
    atmosphere: "rgba(245, 215, 110, 0.16)",
    surface: "rgba(253, 251, 245, 0.58)",
  },
  culture: {
    id: "culture",
    label: "Culture World",
    tint: "rgba(5, 5, 5, 0.12)",
    glow: "#c9a227",
    atmosphere: "rgba(212, 175, 55, 0.18)",
    surface: "rgba(17, 17, 17, 0.55)",
  },
};

/** Apply V5 adaptive extensions for a world preset on the document root. */
export function applyWorldPreset(world: WorldPresetId) {
  if (typeof document === "undefined") return;
  const preset = WORLD_PRESETS[world];
  const root = document.documentElement;
  root.dataset.world = world;
  root.style.setProperty("--adaptive-world-tint", preset.tint);
  root.style.setProperty("--adaptive-glow", preset.glow);
  root.style.setProperty("--adaptive-atmosphere", preset.atmosphere);
  root.style.setProperty("--adaptive-surface", preset.surface);
}

export function clearWorldPreset() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  delete root.dataset.world;
  root.style.removeProperty("--adaptive-world-tint");
  root.style.removeProperty("--adaptive-glow");
  root.style.removeProperty("--adaptive-atmosphere");
  root.style.removeProperty("--adaptive-surface");
}

