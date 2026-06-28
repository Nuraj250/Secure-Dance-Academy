type LoadingStateProps = {
  label: string;
};

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6" aria-live="polite">
      <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-card-foreground shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </main>
  );
}
