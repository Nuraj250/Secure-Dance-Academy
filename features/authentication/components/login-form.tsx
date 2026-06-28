"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { signInSchema, type SignInInput } from "@/features/authentication/schemas/auth.schema";
import { signInAction } from "@/features/authentication/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

type LoginFormProps = {
  redirectTo: string;
};

type FormState = Partial<Record<keyof SignInInput | "root", string>>;

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FormState>({});

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const candidate = {
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
        };

        const parsed = signInSchema.safeParse(candidate);
        if (!parsed.success) {
          const nextErrors: FormState = {};
          for (const issue of parsed.error.issues) {
            const key = issue.path[0];
            if (typeof key === "string") {
              nextErrors[key as keyof SignInInput] = issue.message;
            }
          }
          setErrors(nextErrors);
          return;
        }

        setErrors({});
        startTransition(async () => {
          try {
            await signInAction(parsed.data);
            toast.success("Signed in successfully.");
            router.replace(redirectTo || "/dashboard");
            router.refresh();
          } catch (error) {
            const message = error instanceof Error ? error.message : "Sign in failed.";
            setErrors({ root: message });
            toast.error(message);
          }
        });
      }}
    >
      {errors.root ? (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-danger">{errors.root}</p>
          </CardContent>
        </Card>
      ) : null}
      <FormField
        error={errors.email}
        htmlFor="email"
        label="Email"
        required
      >
        <Input
          autoComplete="email"
          defaultValue=""
          id="email"
          name="email"
          placeholder="name@example.com"
          type="email"
        />
      </FormField>
      <FormField
        error={errors.password}
        htmlFor="password"
        label="Password"
        required
      >
        <Input
          autoComplete="current-password"
          id="password"
          name="password"
          placeholder="Enter your password"
          type="password"
        />
      </FormField>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <a className="text-sm text-primary underline-offset-4 hover:underline" href="/forgot-password">
          Forgot password?
        </a>
        <Button disabled={isPending} type="submit">
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
}

