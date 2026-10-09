import { rejectCrossSite } from "../../../_lib/auth";
import { proxyAuthedJson } from "../../../_lib/proxy";

export async function POST(request: Request) {
  const blocked = rejectCrossSite(request);
  if (blocked) return blocked;

  const body = await request.json().catch(() => ({}));
  return proxyAuthedJson({ path: "/payments/razorpay/create-order", method: "POST", body });
}
