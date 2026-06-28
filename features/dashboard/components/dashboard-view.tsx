import Link from "next/link";
import { BarChart } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import type { DashboardModel } from "@/features/dashboard/types";

type DashboardViewProps = {
  model: DashboardModel;
};

export function DashboardView({ model }: DashboardViewProps) {
  return (
    <section className="space-y-6">
      <PageHeader
        title={model.title}
        description={model.description}
        primaryAction={<Button asChild><Link href={model.primaryAction.href}>{model.primaryAction.label}</Link></Button>}
        secondaryActions={model.secondaryActions.map((action) => (
          <Button asChild key={action.href} variant={action.tone ?? "outline"}>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ))}
      />

      <div className="grid gap-4 xl:grid-cols-5">
        {model.metrics.map((metric) => (
          <StatCard
            key={metric.label}
            className="xl:col-span-1"
            description={metric.description}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </div>

      {model.chart ? (
        <BarChart
          description={model.chart.description}
          points={model.chart.points}
          title={model.chart.title}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        {model.lists.map((list) => (
          <Card key={list.title}>
            <CardHeader>
              <CardTitle>{list.title}</CardTitle>
              {list.description ? <CardDescription>{list.description}</CardDescription> : null}
            </CardHeader>
            <CardContent className="space-y-3">
              {list.items.length > 0 ? (
                <>
                  {list.items.map((item) => (
                    <div
                      className="flex items-start justify-between gap-3 rounded-md border border-border bg-background p-3"
                      key={`${list.title}-${item.title}-${item.timestamp ?? ""}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{item.title}</p>
                          {item.tone ? <Badge variant={item.tone}>{item.tone}</Badge> : null}
                        </div>
                        {item.description ? (
                          <p className="text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                      {item.timestamp ? (
                        <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                      ) : null}
                    </div>
                  ))}
                  {list.action ? (
                    <Button asChild className="w-full" variant={list.action.tone ?? "outline"}>
                      <Link href={list.action.href}>{list.action.label}</Link>
                    </Button>
                  ) : null}
                </>
              ) : (
                <EmptyState
                  fullScreen={false}
                  action={list.action ? <Link href={list.action.href}>{list.action.label}</Link> : undefined}
                  description={list.emptyDescription}
                  title={list.emptyTitle}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {model.tables.map((table) => (
        <Card key={table.title}>
          <CardHeader>
            <CardTitle>{table.title}</CardTitle>
            {table.description ? <CardDescription>{table.description}</CardDescription> : null}
          </CardHeader>
          <CardContent className="space-y-4">
            {table.rows.length > 0 ? (
              <Table>
                <thead>
                  <TableRow>
                    {table.columns.map((column) => (
                      <TableHead
                        key={column.label}
                        className={column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : undefined}
                      >
                        {column.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </thead>
                <TableBody>
                  {table.rows.map((row, index) => (
                    <TableRow key={`${table.title}-${index}`}>
                      {row.cells.map((cell, cellIndex) => (
                        <TableCell
                          key={`${table.title}-${index}-${cellIndex}`}
                          className={
                            table.columns[cellIndex]?.align === "right"
                              ? "text-right"
                              : table.columns[cellIndex]?.align === "center"
                                ? "text-center"
                                : undefined
                          }
                        >
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                fullScreen={false}
                action={table.action ? <Link href={table.action.href}>{table.action.label}</Link> : undefined}
                description={table.emptyDescription}
                title={table.emptyTitle}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
