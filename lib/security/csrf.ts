import type { NextRequest } from "next/server";
import { CsrfError } from "@/lib/http/errors";

function readRequestOrigin(request: NextRequest) {
  return request.headers.get("origin")?.trim() || request.headers.get("referer")?.trim() || null;
}

export function assertSameOriginRequest(
  request: NextRequest,
  allowedOrigin: string,
) {
  const requestOrigin = readRequestOrigin(request);

  if (!requestOrigin) {
    throw new CsrfError("The request origin could not be verified.");
  }

  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(requestOrigin);
  } catch {
    throw new CsrfError("The request origin is malformed.");
  }

  if (parsedOrigin.origin !== allowedOrigin) {
    throw new CsrfError("The request origin is not allowed.");
  }
}
