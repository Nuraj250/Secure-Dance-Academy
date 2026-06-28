import { cn } from "@/lib/utils";

export type ChartPoint = {
  label: string;
  value: number;
};

type BarChartProps = {
  title: string;
  description?: string;
  points: ChartPoint[];
  className?: string;
};

export function BarChart({ title, description, points, className }: BarChartProps) {
  const maxValue = Math.max(...points.map((point) => point.value), 1);

  return (
    <figure className={cn("space-y-4 rounded-lg border border-border bg-card p-5", className)}>
      <div className="space-y-1">
        <figcaption className="text-base font-semibold">{title}</figcaption>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div
        aria-label={title}
        className="grid min-h-48 grid-cols-[repeat(auto-fit,minmax(36px,1fr))] items-end gap-3"
        role="img"
      >
        {points.map((point) => {
          const height = Math.max(8, (point.value / maxValue) * 100);

          return (
            <div key={point.label} className="flex h-full flex-col items-center justify-end gap-2">
              <div className="text-xs font-medium text-muted-foreground">{point.value}</div>
              <div className="flex h-32 w-full items-end">
                <div
                  className="w-full rounded-t-md bg-primary"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="max-w-full truncate text-[11px] text-muted-foreground">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

