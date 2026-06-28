import { MainNavigation } from "@/components/layout/main-navigation";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      <main>{children}</main>
    </div>
  );
}
