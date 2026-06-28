import type { NextRequest } from "next/server";
import type { ZodType } from "zod";
import { ValidationError } from "@/lib/http/errors";

export function validateRequest<TInput>(
  schema: ZodType<TInput>,
  input: unknown,
) {
  const result = schema.safeParse(input);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten(),
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}

export async function parseJsonBody(request: NextRequest) {
  const rawBody = await request.text();

  if (rawBody.trim().length === 0) {
    return null;
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    throw new ValidationError("The request body must be valid JSON.");
  }
}

export function assertValidInput<TInput>(
  schema: ZodType<TInput>,
  input: unknown,
  message = "The request payload is invalid.",
) {
  const result = validateRequest(schema, input);

  if (!result.success) {
    throw new ValidationError(message, {
      issues: result.errors.fieldErrors,
    });
  }

  return result.data;
}
