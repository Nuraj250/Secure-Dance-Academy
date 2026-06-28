import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  fullScreen?: boolean;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  fullScreen = true,
  className,
}: EmptyStateProps) {
  const content = (
    <section
      className={cn(
        "w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-sm",
        className,
      )}
    >
      <h1 className="text-xl font-semibold text-card-foreground">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </section>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      {content}
    </main>
  );
}
