import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env, hasSupabaseBrowserConfig } from "@/lib/env";
import { normalizeSecureCookieOptions } from "@/lib/security/cookies";

export async function createSupabaseServerClient() {
  if (!hasSupabaseBrowserConfig()) {
    throw new Error("Supabase server configuration is missing.");
  }

  const cookieStore = await cookies();
  type CookieStore = Awaited<typeof cookieStore>;
  type CookieToSet = {
    name: string;
    value: string;
    options?: Parameters<CookieStore["set"]>[2];
  };

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(
              name,
              value,
              normalizeSecureCookieOptions(options),
            );
          });
        },
      },
    },
  );
}
