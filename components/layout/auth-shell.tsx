import type { ReactNode } from "react";
import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Brand />
          <ThemeToggle />
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
          <div className="mt-6">{children}</div>
        </div>
        {footer ? <div className="mt-4 text-sm text-muted-foreground">{footer}</div> : null}
      </section>
    </main>
  );
}

