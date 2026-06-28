import { z } from "zod";
import {
  pageSchema,
  pageSizeSchema,
  optionalSafeTextSchema,
  safeTextSchema,
  searchTextSchema,
} from "@/lib/validation/primitives";
import { appRoleCodes } from "@/types/rbac";

export const userListQuerySchema = z.object({
  page: pageSchema,
  pageSize: pageSizeSchema,
  search: searchTextSchema(120),
  status: z
    .enum(["pending", "active", "suspended", "disabled", "archived"])
    .optional(),
  roleCode: z.enum(appRoleCodes).optional(),
});

export const userUpdateSchema = z.object({
  firstName: safeTextSchema(100).optional(),
  lastName: safeTextSchema(100).optional(),
  displayName: safeTextSchema(160).optional(),
  phone: optionalSafeTextSchema(32),
  locale: optionalSafeTextSchema(32),
  timezone: optionalSafeTextSchema(64),
  status: z
    .enum(["pending", "active", "suspended", "disabled", "archived"])
    .optional(),
}).refine(
  (value) => Object.values(value).some((item) => item !== undefined),
  {
    message: "At least one field must be provided.",
  },
);

export type UserListQueryInput = z.infer<typeof userListQuerySchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
