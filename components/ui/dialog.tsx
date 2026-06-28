"use client";

import { createPortal } from "react-dom";
import { type ReactNode, useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  variant?: "modal" | "drawer";
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  variant = "modal",
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onOpenChange]);

  const panelClassName = useMemo(() => {
    return variant === "drawer"
      ? "fixed inset-y-0 right-0 w-full max-w-lg border-l border-border bg-card shadow-2xl"
      : "max-w-xl rounded-lg border border-border bg-card shadow-2xl";
  }, [variant]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close dialog"
        className="absolute inset-0 bg-background/70"
        onClick={() => onOpenChange(false)}
        type="button"
      />
      <div
        className={cn(
          "absolute",
          variant === "drawer"
            ? "inset-y-0 right-0 h-full"
            : "left-1/2 top-1/2 w-[min(92vw,40rem)] -translate-x-1/2 -translate-y-1/2 p-4",
        )}
      >
        <div
          ref={panelRef}
          aria-describedby={description ? "dialog-description" : undefined}
          aria-modal="true"
          className={cn("outline-none", panelClassName, className)}
          role="dialog"
          tabIndex={-1}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{title}</h2>
              {description ? (
                <p id="dialog-description" className="text-sm text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
            <Button
              aria-label="Close dialog"
              onClick={() => onOpenChange(false)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="px-5 py-4">{children}</div>
          {footer ? <div className="border-t border-border px-5 py-4">{footer}</div> : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

