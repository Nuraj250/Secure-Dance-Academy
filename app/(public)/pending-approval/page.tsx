import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/authentication/actions";

export const metadata: Metadata = {
  title: "Pending approval | Secure Dance Academy",
};

export default function PendingApprovalPage() {
  return (
    <AuthShell
      description="Your account has been created but is not active yet."
      title="Pending approval"
      footer="Contact the academy administrator if you believe this is incorrect."
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          You can sign out now and return once the account is activated.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link href="/login">Return to sign in</Link>
          </Button>
          <form action={signOutAction}>
            <Button variant="outline">Sign out</Button>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}

