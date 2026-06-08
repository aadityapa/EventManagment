/** Light luxury palette — remaps Stitch dark tokens for airy, premium UI */
export const STITCH_LIGHT_COLORS: Record<string, string> = {
  "bg-primary": "#FAF8F5",
  "bg-elevated": "#FFFFFF",
  "bg-surface": "#F5F0E8",
  background: "#FAF8F5",
  surface: "#FFFFFF",
  "surface-dim": "#F0EBE3",
  "surface-bright": "#FFFFFF",
  "surface-container": "#F7F3EC",
  "surface-container-low": "#F3EDE4",
  "surface-container-high": "#EDE6DA",
  "surface-container-highest": "#E8E0D2",
  "surface-container-lowest": "#EDE8DF",
  "surface-variant": "#E5DDD0",
  "text-primary": "#1C1814",
  "text-muted": "#6B6358",
  "on-surface": "#2C2620",
  "on-surface-variant": "#5A5248",
  "on-background": "#2C2620",
  primary: "#B8860B",
  "primary-container": "#D4AF37",
  "gold-soft": "#E8C547",
  "on-primary": "#FFFFFF",
  "on-primary-container": "#3D3200",
  "glass-bg": "rgba(255, 255, 255, 0.82)",
  "glass-border": "rgba(197, 160, 40, 0.28)",
  outline: "#C4B8A8",
  "outline-variant": "#DDD5C8",
  secondary: "#FFF9EF",
  "secondary-container": "#FFE88A",
  "inverse-surface": "#2C2620",
  "inverse-on-surface": "#FAF8F5",
};

export function remapConfigToLight(config: Record<string, unknown>): Record<string, unknown> {
  const theme = config.theme as Record<string, unknown> | undefined;
  if (!theme?.extend) return config;

  const extend = theme.extend as Record<string, unknown>;
  const colors = { ...(extend.colors as Record<string, string>) };

  for (const [key, value] of Object.entries(STITCH_LIGHT_COLORS)) {
    if (colors[key] !== undefined) colors[key] = value;
  }

  return {
    ...config,
    theme: {
      ...theme,
      extend: {
        ...extend,
        colors,
      },
    },
  };
}
