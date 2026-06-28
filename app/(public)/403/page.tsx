import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Access denied | Secure Dance Academy",
};

export default function ForbiddenPage() {
  return (
    <AuthShell
      description="The requested action is not available for your current access level."
      title="Access denied"
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Use the dashboard to continue or return to sign in if you are using a different account.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link href="/dashboard">Return to dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}

