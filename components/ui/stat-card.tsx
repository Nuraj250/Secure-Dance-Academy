import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type StatCardProps = {
  label: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    label: string;
    tone?: "success" | "warning" | "danger" | "secondary";
  };
  className?: string;
};

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
          </div>
          {Icon ? (
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-3">
          {description ? (
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          ) : (
            <span />
          )}
          {trend ? (
            <Badge variant={trend.tone ?? "secondary"}>{trend.label}</Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

