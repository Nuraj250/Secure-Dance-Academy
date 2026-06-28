"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function GlobalError({
  _error,
  reset,
}: {
  _error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorState
          title="Something went wrong"
          description="The application could not complete the request."
          actionLabel="Try again"
          onAction={reset}
        />
      </body>
    </html>
  );
}
