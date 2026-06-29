import { z } from "zod";

const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().optional());

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: optionalTrimmedString,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalTrimmedString,
  SUPABASE_SERVICE_ROLE_KEY: optionalTrimmedString,
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

export type SupabaseConfigIssue =
  | "missing_url"
  | "invalid_url"
  | "placeholder_url"
  | "missing_anon_key"
  | "placeholder_anon_key";

export type SupabaseConfigStatus = {
  issue: SupabaseConfigIssue | null;
  isConfigured: boolean;
  isDevelopmentDemoMode: boolean;
};

const placeholderValues = new Set([
  "example",
  "example-anon-key",
  "example-service-role-key",
  "replace-me",
  "replace_with_supabase_url",
  "replace_with_supabase_anon_key",
  "your-anon-key",
  "your-service-role-key",
  "your-supabase-anon-key",
  "your-supabase-service-role-key",
  "your-supabase-url",
]);

function isPlaceholderValue(value: string | undefined) {
  if (!value) {
    return false;
  }

  return placeholderValues.has(value.trim().toLowerCase());
}

function parseSupabaseUrl(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function getSupabaseConfigIssue(): SupabaseConfigIssue | null {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    return "missing_url";
  }

  const parsedUrl = parseSupabaseUrl(supabaseUrl);
  if (!parsedUrl || !["http:", "https:"].includes(parsedUrl.protocol)) {
    return "invalid_url";
  }

  if (
    isPlaceholderValue(supabaseUrl) ||
    parsedUrl.hostname.toLowerCase() === "example.supabase.co"
  ) {
    return "placeholder_url";
  }

  if (!supabaseAnonKey) {
    return "missing_anon_key";
  }

  if (isPlaceholderValue(supabaseAnonKey)) {
    return "placeholder_anon_key";
  }

  return null;
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const issue = getSupabaseConfigIssue();

  return {
    issue,
    isConfigured: issue === null,
    isDevelopmentDemoMode: env.NODE_ENV === "development" && issue !== null,
  };
}

export function hasSupabaseBrowserConfig() {
  return getSupabaseConfigStatus().isConfigured;
}

export function isDevelopmentSupabaseDemoMode() {
  return getSupabaseConfigStatus().isDevelopmentDemoMode;
}

export function getSupabaseConnectOrigin() {
  const status = getSupabaseConfigStatus();
  if (!status.isConfigured || !env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  return parseSupabaseUrl(env.NEXT_PUBLIC_SUPABASE_URL)?.origin ?? null;
}
