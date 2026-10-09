/**
 * Post-auth redirect target from a `?next=` query value. Same-origin paths
 * only: rejects absolute URLs, protocol-relative `//host`, backslashes and
 * control characters (a tab or newline between two slashes is stripped by
 * URL parsers, turning the path into `//evil.example`), after undoing nested
 * percent-encoding. Shared by the login and register forms.
 */
export function safeNextPath(raw: string | null, fallback = "/dashboard"): string {
  if (!raw) return fallback;
  let path = raw;
  try {
    // Undo nested encoding (`%2509` → `%09` → tab) before checking.
    for (let i = 0; i < 3 && /%[0-9a-f]{2}/i.test(path); i++) path = decodeURIComponent(path);
  } catch {
    return fallback;
  }
  if (/[\u0000-\u001f\u007f\\]/.test(path)) return fallback;
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  // The decoded form passed, so the original (with its own encoding intact) is safe too.
  return raw;
}
