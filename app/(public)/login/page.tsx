import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/layout/auth-shell";
import { LoginForm } from "@/features/authentication/components/login-form";
import { SessionService } from "@/features/authentication/services/session.service";

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
      <LoginForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
