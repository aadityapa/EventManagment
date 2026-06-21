/** True on Vercel serverless at request time — filesystem is read-only. */
export function isMediaReadonly(): boolean {
  if (process.env.MEDIA_READONLY === "1") return true;
  // Build scripts and `next build` SSG must still scan/write manifest locally.
  if (process.env.VERCEL !== "1") return false;
  return process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge";
}
