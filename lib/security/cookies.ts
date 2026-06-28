import { env } from "@/lib/env";

export type SecureCookieOptions = {
  httpOnly?: boolean;
  sameSite?: boolean | "strict" | "lax" | "none";
  secure?: boolean;
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: number | Date;
};

export function hasSupabaseSessionCookie(
  cookies: readonly { name: string }[],
) {
  return cookies.some((cookie) => cookie.name.startsWith("sb-"));
}

export function normalizeSecureCookieOptions(
  options: SecureCookieOptions | undefined,
): SecureCookieOptions {
  const { domain: _domain, ...rest } = options ?? {};

  return {
    ...rest,
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
  };
}
