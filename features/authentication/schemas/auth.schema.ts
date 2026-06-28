import { z } from "zod";
import { emailSchema } from "@/lib/validation/primitives";

const passwordSchema = z
  .string()
  .min(12)
  .max(128)
  .refine((value) => !/\s/.test(value), {
    message: "Password must not contain whitespace.",
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const passwordRecoverySchema = z.object({
  email: emailSchema,
});

export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(
    (value) => value.password === value.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    },
  );

export type SignInInput = z.infer<typeof signInSchema>;
export type PasswordRecoveryInput = z.infer<typeof passwordRecoverySchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
