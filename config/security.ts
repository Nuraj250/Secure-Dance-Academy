import { env } from "../lib/env";

const supabaseConnectSrc = env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(env.NEXT_PUBLIC_SUPABASE_URL).origin
  : null;

const connectSrc = ["'self'", supabaseConnectSrc, "https://*.supabase.co"]
  .filter((value): value is string => Boolean(value))
  .join(" ");

export const publicRoutePrefixes = [
  "/",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/pending-approval",
  "/session-expired",
  "/403",
  "/404",
  "/500",
  "/accept-invite",
  "/api/health",
];

export const protectedRoutePrefixes = [
  "/dashboard",
  "/search",
  "/artists",
  "/parents",
  "/coaches",
  "/attendance",
  "/performances",
  "/injuries",
  "/medical",
  "/activities",
  "/reports",
  "/notifications",
  "/profile",
  "/users",
  "/audit-log",
  "/settings",
];

const scriptSrc =
  env.NODE_ENV === "production"
    ? "script-src 'self' 'unsafe-inline';"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval';";

export const responseSecurityHeaders = {
  "Content-Security-Policy":
    `default-src 'self'; ${scriptSrc} style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src ${connectSrc}; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`,
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "X-DNS-Prefetch-Control": "off",
  ...(env.NODE_ENV === "production"
    ? {
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      }
    : {}),
};
