import { rejectCrossSite } from "../_lib/auth";
import { proxyAuthedJson } from "../_lib/proxy";

export async function POST(request: Request) {
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;

  // Field validation happens in the API (server/src/routes/bookings.ts); the
  // body is passed through so its 400s reach the wizard with field errors.
  const body = await request.json().catch(() => ({}));
  return proxyAuthedJson({ path: "/bookings", method: "POST", body });
}
