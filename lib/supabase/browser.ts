import { createBrowserClient } from "@supabase/ssr";
import { env, hasSupabaseBrowserConfig } from "@/lib/env";

export function createSupabaseBrowserClient() {
  if (!hasSupabaseBrowserConfig()) {
    throw new Error("Supabase browser configuration is missing.");
  }

  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
