/** AI-generated coming soon placeholders — WebP for smaller transfer */
export const COMING_SOON_IMAGES = {
  generic: "/images/placeholders/generic-coming-soon.webp",
  corporate: "/images/placeholders/corporate-coming-soon.webp",
  destination: "/images/placeholders/destination-coming-soon.webp",
  portfolio: "/images/placeholders/portfolio-coming-soon.webp",
  wedding: "/images/placeholders/generic-coming-soon.webp",
  celebrity: "/images/placeholders/generic-coming-soon.webp",
  stories: "/images/placeholders/generic-coming-soon.webp",
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
