import type { LucideIcon } from "lucide-react";
import type { AppRoleCode } from "@/types/rbac";
import type { BadgeVariant } from "@/components/ui/badge";
import type { ChartPoint } from "@/components/ui/chart";

export type DashboardMetric = {
  label: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
};

export type DashboardAction = {
  label: string;
  href: string;
  tone?: "primary" | "secondary" | "outline";
};

export type DashboardListItem = {
  title: string;
  description?: string;
  href?: string;
  timestamp?: string;
  tone?: BadgeVariant;
};

export type DashboardTableColumn = {
  label: string;
  align?: "left" | "right" | "center";
};

export type DashboardTableRow = {
  cells: string[];
  href?: string;
};

export type DashboardTable = {
  title: string;
  description?: string;
  columns: DashboardTableColumn[];
  rows: DashboardTableRow[];
  emptyTitle: string;
  emptyDescription: string;
  action?: DashboardAction;
};

export type DashboardChart = {
  title: string;
  description?: string;
  points: ChartPoint[];
};

export type DashboardModel = {
  role: AppRoleCode;
  title: string;
  description: string;
  primaryAction: DashboardAction;
  secondaryActions: DashboardAction[];
  metrics: DashboardMetric[];
  chart?: DashboardChart;
  lists: {
    title: string;
    description?: string;
    items: DashboardListItem[];
    emptyTitle: string;
    emptyDescription: string;
    action?: DashboardAction;
  }[];
  tables: DashboardTable[];
};
