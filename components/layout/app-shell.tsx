import type { SessionUser } from "@/types/auth";
import type { NavigationSection } from "@/lib/navigation";
import type { ReactNode } from "react";
import { MainNavigation } from "@/components/layout/main-navigation";

type AppShellProps = {
  user: SessionUser;
  sections: NavigationSection[];
  children: ReactNode;
};

export function AppShell({ user, sections, children }: AppShellProps) {
  return (
    <MainNavigation user={user} sections={sections}>
      {children}
    </MainNavigation>
  );
}
