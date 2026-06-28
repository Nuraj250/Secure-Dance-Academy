import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/layout/auth-shell";
import { ResetPasswordForm } from "@/features/authentication/components/reset-password-form";
import { SessionService } from "@/features/authentication/services/session.service";

export const metadata: Metadata = {
  title: "Reset password | Secure Dance Academy",
};

export const dynamic = "force-dynamic";

const sessionService = new SessionService();

export default async function ResetPasswordPage() {
  const session = await sessionService.resolveSession();

  if (session.user && session.user.status === "active") {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      description="Set a new password after opening a valid reset link."
      title="Reset password"
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
