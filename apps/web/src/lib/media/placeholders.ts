/** AI-generated coming soon placeholders — used when a folder has no uploads */
export const COMING_SOON_IMAGES = {
  generic: "/images/placeholders/generic-coming-soon.png",
  corporate: "/images/placeholders/corporate-coming-soon.png",
  destination: "/images/placeholders/destination-coming-soon.png",
  portfolio: "/images/placeholders/portfolio-coming-soon.png",
  wedding: "/images/placeholders/generic-coming-soon.png",
  celebrity: "/images/placeholders/generic-coming-soon.png",
  stories: "/images/placeholders/generic-coming-soon.png",
} as const;

const PLACEHOLDER_SET = new Set<string>(Object.values(COMING_SOON_IMAGES));

export function isComingSoonImage(src: string | undefined | null): boolean {
  if (!src) return true;
  return PLACEHOLDER_SET.has(src) || src.includes("/placeholders/");
}

export function pickOrPlaceholder(items: string[], placeholder: string, count: number): string[] {
  if (items.length >= count) return items.slice(0, count);
  const filled = [...items];
  while (filled.length < count) filled.push(placeholder);
  return filled;
}

export function pickOneOrPlaceholder(items: string[], placeholder: string, index = 0): string {
  return items[index] ?? items[0] ?? placeholder;
}
