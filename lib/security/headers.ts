import type { NextResponse } from "next/server";
import { responseSecurityHeaders } from "@/config/security";

export function applySecurityHeaders(response: NextResponse) {
  Object.entries(responseSecurityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
