import { cacheKey, getCachedPalette, setCachedPalette } from "./cache";
import { BRIGHTNESS_THRESHOLD, contrastingMuted, contrastingText, relativeLuminance } from "./color-utils";
import type { AdaptivePalette, ImageAnalysis, SampleRegion } from "./types";

export { BRIGHTNESS_THRESHOLD };

const BUTTON_SAMPLE_RGB: [number, number, number] = [201, 162, 39];

const GOLD = {
  accent: "#C9A227",
  accentLight: "#E6C67A",
  metallic: "#B8860B",
  shine: "#D4AF37",
};

const CHAMPAGNE = {
  accent: "#D4C4A8",
  accentLight: "#E8DCC8",
  metallic: "#C4B896",
  shine: "#E0D0B8",
};

export function generatePalette(analysis: ImageAnalysis, region: SampleRegion = "full"): AdaptivePalette {
  const key = cacheKey(`${analysis.brightness}:${analysis.dominant.join(",")}:${analysis.warmth}`, region);
  const cached = getCachedPalette(key);
  if (cached) return cached;

  const { isDark, isWarm, brightness } = analysis;
  const accentSet = isWarm ? GOLD : CHAMPAGNE;

  const text = contrastingText(brightness, BRIGHTNESS_THRESHOLD);
  const muted = contrastingMuted(brightness, BRIGHTNESS_THRESHOLD);
  const buttonLuminance = relativeLuminance(...BUTTON_SAMPLE_RGB);
  const buttonText = contrastingText(buttonLuminance, BRIGHTNESS_THRESHOLD);

  const overlayBase = isDark ? [5, 5, 5] : [253, 251, 245];
  const overlayAlpha = isDark ? 0.32 : 0.58;
  const overlay = `rgba(${overlayBase[0]}, ${overlayBase[1]}, ${overlayBase[2]}, ${overlayAlpha})`;

  const scrimStart = overlayAlpha + (isDark ? 0.03 : 0.14);
  const scrimMid = overlayAlpha * 0.45;
  const scrim = isDark
    ? `linear-gradient(90deg, rgba(5,5,5,${scrimStart}) 0%, rgba(5,5,5,${scrimMid}) 40%, transparent 68%)`
    : `linear-gradient(90deg, rgba(253,251,245,${scrimStart}) 0%, rgba(247,243,235,${scrimMid}) 38%, transparent 68%)`;

  const scrimBottom = isDark
    ? `linear-gradient(to top, rgba(5,5,5,${overlayAlpha}) 0%, transparent 38%)`
    : `linear-gradient(to top, rgba(247,243,235,${overlayAlpha * 0.85}) 0%, transparent 35%)`;

  const shadowRgb = isWarm ? "201, 162, 39" : "212, 196, 168";
  const shadow = `0 0 32px rgba(${shadowRgb}, ${isDark ? 0.35 : 0.22})`;
  const shadowStrong = `0 0 48px rgba(${shadowRgb}, ${isDark ? 0.45 : 0.3})`;

  const gradientGold = isWarm
    ? "linear-gradient(135deg, #B8860B 0%, #E6C67A 42%, #C9A227 78%, #D4AF37 100%)"
    : "linear-gradient(135deg, #C4B896 0%, #E8DCC8 45%, #D4C4A8 78%, #E0D0B8 100%)";

  const button = isWarm
    ? "linear-gradient(135deg, #B8860B 0%, #E6C67A 50%, #C9A227 100%)"
    : "linear-gradient(135deg, #C4B896 0%, #E8DCC8 50%, #D4C4A8 100%)";

  const palette: AdaptivePalette = {
    text,
    muted,
    accent: accentSet.accent,
    accentLight: accentSet.accentLight,
    overlay,
    scrim,
    scrimBottom,
    shadow,
    shadowStrong,
    button,
    buttonText,
    gradientGold,
  };

  setCachedPalette(key, palette);
  return palette;
}
