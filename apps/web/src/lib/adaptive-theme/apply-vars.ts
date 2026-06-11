import type { AdaptivePalette } from "./types";

const ADAPTIVE_KEYS = [
  "--adaptive-text",
  "--adaptive-muted",
  "--adaptive-accent",
  "--adaptive-accent-light",
  "--adaptive-overlay",
  "--adaptive-scrim",
  "--adaptive-scrim-bottom",
  "--adaptive-shadow",
  "--adaptive-shadow-strong",
  "--adaptive-button",
  "--adaptive-button-text",
  "--adaptive-gradient-gold",
] as const;

export function applyAdaptiveVars(target: HTMLElement, palette: AdaptivePalette) {
  target.style.setProperty("--adaptive-text", palette.text);
  target.style.setProperty("--adaptive-muted", palette.muted);
  target.style.setProperty("--adaptive-accent", palette.accent);
  target.style.setProperty("--adaptive-accent-light", palette.accentLight);
  target.style.setProperty("--adaptive-overlay", palette.overlay);
  target.style.setProperty("--adaptive-scrim", palette.scrim);
  target.style.setProperty("--adaptive-scrim-bottom", palette.scrimBottom);
  target.style.setProperty("--adaptive-shadow", palette.shadow);
  target.style.setProperty("--adaptive-shadow-strong", palette.shadowStrong);
  target.style.setProperty("--adaptive-button", palette.button);
  target.style.setProperty("--adaptive-button-text", palette.buttonText);
  target.style.setProperty("--adaptive-gradient-gold", palette.gradientGold);
  target.dataset.adaptiveActive = "true";
}

export function resetAdaptiveVars(target: HTMLElement) {
  for (const key of ADAPTIVE_KEYS) {
    target.style.removeProperty(key);
  }
  delete target.dataset.adaptiveActive;
}

export function applyAdaptiveVarsToSection(section: HTMLElement, palette: AdaptivePalette) {
  applyAdaptiveVars(section, palette);
}
