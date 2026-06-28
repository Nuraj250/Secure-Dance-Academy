import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import type { SessionContext } from "@/types/auth";

export type RequestContext = SessionContext;

export function createRequestContext(
  overrides: Partial<RequestContext> = {},
): RequestContext {
  return {
    requestId: randomUUID(),
    ipAddress: null,
    userAgent: null,
    origin: null,
    supabaseIdentity: null,
    user: null,
    isAuthenticated: false,
    ...overrides,
  };
}

function readHeaderValue(request: NextRequest, headerName: string) {
  return request.headers.get(headerName)?.trim() || null;
}

function normalizeOriginHeader(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return value;
  }
}

function readForwardedIp(request: NextRequest) {
  const forwardedFor = readHeaderValue(request, "x-forwarded-for");
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    return firstIp?.trim() || null;
  }

  return (
    readHeaderValue(request, "x-real-ip") ||
    readHeaderValue(request, "cf-connecting-ip")
  );
}

export function buildRequestContext(request: NextRequest): RequestContext {
  const requestId = readHeaderValue(request, "x-request-id") || randomUUID();

  return {
    requestId,
    ipAddress: readForwardedIp(request),
    userAgent: readHeaderValue(request, "user-agent"),
    origin: normalizeOriginHeader(
      readHeaderValue(request, "origin") || readHeaderValue(request, "referer"),
    ),
    supabaseIdentity: null,
    user: null,
    isAuthenticated: false,
  };
}
