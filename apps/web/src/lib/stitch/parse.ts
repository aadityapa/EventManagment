export function extractStitchContent(fullHtml: string): string {
  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    const mainMatch = fullHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    return mainMatch ? mainMatch[1] : fullHtml;
  }

  let body = bodyMatch[1];
  body = body.replace(/<script[\s\S]*?<\/script>/gi, "");
  body = body.replace(/<header[\s\S]*?<\/header>/gi, "");
  body = body.replace(/<footer[\s\S]*?<\/footer>/gi, "");

  const mainMatch = body.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) return mainMatch[1];

  return body;
}

/** @deprecated use extractStitchContent */
export function extractMainHtml(fullHtml: string): string {
  return extractStitchContent(fullHtml);
}

export function extractHeadStyles(fullHtml: string): string {
  const styles: string[] = [];
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(fullHtml)) !== null) {
    let css = m[1]?.trim() || "";
    css = css.replace(/#0A0A0A/gi, "#FAF8F5");
    css = css.replace(/#0a0a0a/gi, "#FAF8F5");
    css = css.replace(/#000000/gi, "#FAF8F5");
    css = css.replace(/#FAFAFA/gi, "#1C1814");
    css = css.replace(/background-color:\s*#16130b/gi, "background-color: #FAF8F5");
    css = css.replace(/color:\s*#FAFAFA/gi, "color: #1C1814");
    if (css) styles.push(css);
  }
  return styles.join("\n");
}

export function extractTailwindConfig(fullHtml: string): Record<string, unknown> | null {
  const m = fullHtml.match(/<script[^>]*id="tailwind-config"[^>]*>([\s\S]*?)<\/script>/i);
  if (!m?.[1]) return null;

  try {
    const fn = new Function(`${m[1]}; return tailwind.config;`);
    return fn() as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function extractScripts(fullHtml: string): string[] {
  const scripts: string[] = [];
  const re = /<script(?![^>]*\bsrc=)(?![^>]*id="tailwind-config")[^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(fullHtml)) !== null) {
    if (m[1]?.trim()) scripts.push(m[1]);
  }
  return scripts;
}

export function isInternalRoute(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function stitchHrefToRoute(href: string): string {
  if (
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("https://wa.me")
  ) {
    return href;
  }
  const map: Record<string, string> = {
    "#": "/",
    "#contact": "/contact",
    "#services": "/services",
    "#portfolio": "/portfolio",
    "#testimonials": "/testimonials",
    "#about": "/about",
    "#pricing": "/pricing",
    "#gallery": "/gallery",
    "#faqs": "/faqs",
    "#blog": "/blog",
    "#venues": "/venues",
    "#vendors": "/vendors",
  };
  return map[href] ?? href;
}
