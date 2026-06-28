import { NextResponse, type NextRequest } from "next/server";
import {
  protectedRoutePrefixes,
  publicRoutePrefixes,
} from "@/config/security";
import { applySecurityHeaders } from "@/lib/security/headers";
import { hasSupabaseSessionCookie } from "@/lib/security/cookies";

function isProtectedPath(pathname: string) {
  return protectedRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
}

function isPublicPath(pathname: string) {
  return publicRoutePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  applySecurityHeaders(response);

  if (isPublicPath(request.nextUrl.pathname)) {
    return response;
  }

  if (!isProtectedPath(request.nextUrl.pathname)) {
    return response;
  }

  const hasAuthCookie = hasSupabaseSessionCookie(request.cookies.getAll());

  if (!hasAuthCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
