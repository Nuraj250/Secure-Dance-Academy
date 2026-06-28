import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/layout/auth-shell";
import { ForgotPasswordForm } from "@/features/authentication/components/forgot-password-form";
import { SessionService } from "@/features/authentication/services/session.service";

export const metadata: Metadata = {
  title: "Forgot password | Secure Dance Academy",
};

export const dynamic = "force-dynamic";

const sessionService = new SessionService();

export default async function ForgotPasswordPage() {
  const session = await sessionService.resolveSession();

  if (session.user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      description="Request a secure reset link for the account email address."
      title="Forgot password"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
