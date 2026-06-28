import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandProps = {
  href?: string;
  compact?: boolean;
  className?: string;
};

export function Brand({ href = "/", compact, className }: BrandProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-md text-sm font-semibold text-foreground transition hover:text-primary",
        className,
      )}
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block">Secure Dance</span>
        {!compact ? <span className="block text-muted-foreground">Academy</span> : null}
      </span>
    </Link>
  );
}

