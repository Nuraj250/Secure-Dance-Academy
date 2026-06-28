import { NextResponse, type NextRequest } from "next/server";
import { siteConfig } from "@/config/site";
import { errorResponse } from "@/lib/api/responses";
import { isAppError } from "@/lib/http/errors";
import {
  buildRequestContext,
  type RequestContext,
} from "@/lib/http/request-context";
import { assertSameOriginRequest } from "@/lib/security/csrf";
import { logSecurityEvent } from "@/lib/security/logger";
import { enforceRateLimit } from "@/lib/security/rate-limit";

type ApiHandler<TRouteContext = { params: Promise<Record<string, never>> }> = (
  request: NextRequest,
  context: RequestContext,
  routeContext: TRouteContext,
) => Promise<NextResponse> | NextResponse;

type RouteOptions = {
  requireCsrf?: boolean;
  rateLimit?: {
    key: string | ((request: NextRequest, context: RequestContext) => string);
    limit: number;
    windowMs: number;
    message?: string;
  };
};

function isMutationMethod(method: string) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
}

export function withApiRoute<TRouteContext = { params: Promise<Record<string, never>> }>(
  handler: ApiHandler<TRouteContext>,
  options: RouteOptions = {},
) {
  return async (request: NextRequest, routeContext: TRouteContext) => {
    const context = buildRequestContext(request);

    try {
      if (options.requireCsrf ?? isMutationMethod(request.method)) {
        assertSameOriginRequest(request, siteConfig.appUrl);
      }

      if (options.rateLimit) {
        const key =
          typeof options.rateLimit.key === "function"
            ? options.rateLimit.key(request, context)
            : options.rateLimit.key;
        enforceRateLimit(
          key,
          {
            limit: options.rateLimit.limit,
            windowMs: options.rateLimit.windowMs,
          },
          options.rateLimit.message,
        );
      }

      return await handler(request, context, routeContext);
    } catch (error) {
      if (isAppError(error)) {
        logSecurityEvent({
          level: error.statusCode >= 500 ? "error" : "warn",
          message: error.message,
          context: {
            errorCode: error.errorCode,
            statusCode: error.statusCode,
            requestId: context.requestId,
            path: request.nextUrl.pathname,
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            details: error.details,
          },
        });

        const response = errorResponse(
          error.errorCode,
          error.message,
          error.statusCode,
          error.details,
        );

        if (
          error.errorCode === "RATE_LIMITED" &&
          typeof error.details?.retryAfterSeconds === "number"
        ) {
          response.headers.set(
            "Retry-After",
            String(error.details.retryAfterSeconds),
          );
        }

        return response;
      }

      if (error instanceof Error) {
        logSecurityEvent({
          level: "error",
          message: "Unhandled route handler error.",
          context: {
            requestId: context.requestId,
            path: request.nextUrl.pathname,
            method: request.method,
            name: error.name,
            message: error.message,
          },
        });
      }

      return errorResponse(
        "INTERNAL_SERVER_ERROR",
        "An unexpected error occurred.",
        500,
      );
    }
  };
}
