import { z } from "zod";
import {
  pageSchema,
  pageSizeSchema,
  searchTextSchema,
} from "@/lib/validation/primitives";

export const auditListQuerySchema = z.object({
  page: pageSchema,
  pageSize: pageSizeSchema,
  search: searchTextSchema(120),
  actorUserId: z.string().uuid().optional(),
  entityType: z.string().trim().min(1).max(128).optional(),
  action: z.string().trim().min(1).max(128).optional(),
  outcome: z.enum(["SUCCESS", "FAILURE", "DENIED"]).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type AuditListQueryInput = z.infer<typeof auditListQuerySchema>;
