import { z } from "zod";
import {
  sanitizeEmail,
  sanitizeSearchText,
  sanitizeText,
} from "@/lib/security/sanitize";

export const uuidSchema = z.string().uuid();

export const emailSchema = z
  .string()
  .trim()
  .email()
  .max(320)
  .transform((value) => sanitizeEmail(value));

export function safeTextSchema(maxLength = 255) {
  return z
    .string()
    .trim()
    .min(1)
    .max(maxLength)
    .transform((value) => sanitizeText(value));
}

export function optionalSafeTextSchema(maxLength = 255) {
  return z
    .union([z.string().trim().min(1).max(maxLength), z.null(), z.undefined()])
    .transform((value) => {
      if (value === undefined) {
        return undefined;
      }

      if (value === null) {
        return null;
      }

      return sanitizeText(value);
    });
}

export function searchTextSchema(maxLength = 120) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .transform((value) => sanitizeSearchText(value))
    .optional();
}

export const pageSchema = z.coerce.number().int().min(1).default(1);

export const pageSizeSchema = z.coerce.number().int().min(1).max(100).default(20);

export const sortDirectionSchema = z.enum(["asc", "desc"]).default("desc");

export const paginationQuerySchema = z.object({
  page: pageSchema,
  pageSize: pageSizeSchema,
});
