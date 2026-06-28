import type { ZodSchema } from "zod";

export function validateRequest<TInput>(schema: ZodSchema<TInput>, input: unknown) {
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
