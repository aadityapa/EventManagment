export function extractMainHtml(fullHtml: string): string {
  const mainMatch = fullHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) return mainMatch[1];

  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    let body = bodyMatch[1];
    body = body.replace(/<header[\s\S]*?<\/header>/gi, "");
    body = body.replace(/<footer[\s\S]*?<\/footer>/gi, "");
    body = body.replace(/<a[^>]*aria-label="WhatsApp[^"]*"[\s\S]*?<\/a>/gi, "");
    return body;
  }

  return fullHtml;
}

export function extractHeadStyles(fullHtml: string): string {
  const styles: string[] = [];
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(fullHtml)) !== null) {
    if (m[1]?.trim()) styles.push(m[1]);
  }
  return styles.join("\n");
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
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("https://wa.me")) {
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
  };
  return map[href] ?? href;
}
