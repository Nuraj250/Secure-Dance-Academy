"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  fullScreen?: boolean;
  className?: string;
};

export function ErrorState({
  title,
  description,
  actionLabel,
  onAction,
  fullScreen = true,
  className,
}: ErrorStateProps) {
  const content = (
    <section
      className={cn(
        "w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-sm",
        className,
      )}
    >
      <h1 className="text-xl font-semibold text-card-foreground">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
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
