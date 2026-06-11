import { proxyAuthedJson } from "../../../_lib/proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return proxyAuthedJson({ path: "/payments/razorpay/create-order", method: "POST", body });
}

