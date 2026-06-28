type LoadingStateProps = {
  label: string;
  fullScreen?: boolean;
};

export function LoadingState({ label, fullScreen = true }: LoadingStateProps) {
  const content = (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-card-foreground shadow-sm">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6" aria-live="polite">
      {content}
    </main>
  );
}
