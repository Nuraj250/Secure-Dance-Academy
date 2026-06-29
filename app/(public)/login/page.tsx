import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/layout/auth-shell";
import { LoginForm } from "@/features/authentication/components/login-form";
import { SessionService } from "@/features/authentication/services/session.service";
import { getSupabaseConfigStatus } from "@/lib/env";

export const metadata: Metadata = {
  title: "Sign in | Secure Dance Academy",
};

export const dynamic = "force-dynamic";

const sessionService = new SessionService();

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await sessionService.resolveSession();
  const supabaseConfig = getSupabaseConfigStatus();

  if (session.user) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const redirectTo =
    typeof resolvedSearchParams.redirectTo === "string"
      ? resolvedSearchParams.redirectTo
      : "/dashboard";

  return (
    <AuthShell
      description="Use your academy credentials to access the protected workspace."
      title="Sign in"
      footer={
        <span>
          Need a reset link?{" "}
          <a className="text-primary underline-offset-4 hover:underline" href="/forgot-password">
            Request one here
          </a>
          .
        </span>
      }
    >
      {supabaseConfig.isDevelopmentDemoMode ? (
        <div className="mb-4 rounded-md border border-warning/40 bg-warning/10 p-4 text-sm">
          <p className="font-semibold text-foreground">Local demo mode</p>
          <p className="mt-1 leading-6 text-muted-foreground">
            Supabase authentication is not configured, so the app is running in
            a safe unauthenticated state. Add real Supabase values to
            .env.local to enable sign-in.
          </p>
        </div>
      ) : null}
      <LoginForm
        authUnavailable={supabaseConfig.isDevelopmentDemoMode}
        redirectTo={redirectTo}
      />
    </AuthShell>
  );
}
