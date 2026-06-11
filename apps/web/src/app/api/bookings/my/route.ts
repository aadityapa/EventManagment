import { proxyAuthedJson } from "../../_lib/proxy";

export async function GET() {
  return proxyAuthedJson({ path: "/bookings/my", method: "GET" });
}

