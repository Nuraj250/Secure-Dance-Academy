import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getNavigationSections } from "@/lib/navigation";
import { SessionService } from "@/features/authentication/services/session.service";

const sessionService = new SessionService();

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await sessionService.resolveSession();

  if (!session.user || !session.isAuthenticated) {
    redirect("/login");
  }

  if (session.user.status === "pending") {
    redirect("/pending-approval");
  }

  if (
    session.user.status === "suspended" ||
    session.user.status === "disabled" ||
    session.user.status === "archived"
  ) {
    redirect("/403");
  }

  return (
    <AppShell user={session.user} sections={getNavigationSections(session.user)}>
      {children}
    </AppShell>
  );
}
