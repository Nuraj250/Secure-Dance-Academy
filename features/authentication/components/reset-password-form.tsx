"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { passwordResetSchema } from "@/features/authentication/schemas/auth.schema";
import { resetPasswordAction } from "@/features/authentication/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

type FormState = {
  password?: string;
  confirmPassword?: string;
  root?: string;
};

export function ResetPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<FormState>({});

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const candidate = {
          password: String(form.get("password") ?? ""),
          confirmPassword: String(form.get("confirmPassword") ?? ""),
        };

        const parsed = passwordResetSchema.safeParse(candidate);
        if (!parsed.success) {
          const nextState: FormState = {};
          for (const issue of parsed.error.issues) {
            const key = issue.path[0];
            if (key === "password" || key === "confirmPassword") {
              nextState[key] = issue.message;
            }
          }
          setState(nextState);
          return;
        }

        setState({});
        startTransition(async () => {
          try {
            const result = await resetPasswordAction(parsed.data);
            toast.success(result.message);
            router.replace("/login");
            router.refresh();
          } catch (error) {
            const message = error instanceof Error ? error.message : "Password reset failed.";
            setState({ root: message });
            toast.error(message);
          }
        });
      }}
    >
      {state.root ? (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-danger">{state.root}</p>
          </CardContent>
        </Card>
      ) : null}
      <FormField
        error={state.password}
        htmlFor="password"
        label="New password"
        hint="Use at least 12 characters and avoid whitespace."
        required
      >
        <Input autoComplete="new-password" id="password" name="password" type="password" />
      </FormField>
      <FormField
        error={state.confirmPassword}
        htmlFor="confirmPassword"
        label="Confirm password"
        required
      >
        <Input
          autoComplete="new-password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
        />
      </FormField>
      <Button disabled={isPending} type="submit">
        {isPending ? "Updating..." : "Reset password"}
      </Button>
    </form>
  );
}

