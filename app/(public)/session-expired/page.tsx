import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Session expired | Secure Dance Academy",
};

export default function SessionExpiredPage() {
  return (
    <AuthShell
      description="Your secure session ended. Sign in again to continue."
      title="Session expired"
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          No data has been lost. Sign in again to restore access.
        </p>
        <Button asChild>
          <Link href="/login">Sign in again</Link>
        </Button>
      </div>
    </AuthShell>
  );
}

