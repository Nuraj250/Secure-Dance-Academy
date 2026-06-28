import type { SessionUser } from "@/types/auth";

export type UserStatusFilter =
  | "pending"
  | "active"
  | "suspended"
  | "disabled"
  | "archived";

export type UserSummary = SessionUser & {
  createdAt: string;
  updatedAt: string;
  disabledAt: string | null;
  archivedAt: string | null;
};

export type UserUpdateInput = {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string | null;
  locale?: string | null;
  timezone?: string | null;
  status?: UserStatusFilter;
};

export type UserListFilter = {
  page: number;
  pageSize: number;
  search?: string;
  status?: UserStatusFilter;
  roleCode?: string;
};
