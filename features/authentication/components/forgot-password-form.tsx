"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { passwordRecoverySchema } from "@/features/authentication/schemas/auth.schema";
import { requestPasswordResetAction } from "@/features/authentication/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

type FormState = {
  email?: string;
  root?: string;
  success?: string;
};

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<FormState>({});

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const candidate = {
          email: String(form.get("email") ?? ""),
        };

        const parsed = passwordRecoverySchema.safeParse(candidate);
        if (!parsed.success) {
          const issue = parsed.error.issues[0];
          setState({ email: issue?.message ?? "Enter a valid email address." });
          return;
        }

        setState({});
        startTransition(async () => {
          try {
            const result = await requestPasswordResetAction(parsed.data);
            setState({ success: result.message });
            toast.success(result.message);
          } catch (error) {
            const message = error instanceof Error ? error.message : "Request failed.";
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
      {state.success ? (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-success">{state.success}</p>
          </CardContent>
        </Card>
      ) : null}
      <FormField
        error={state.email}
        htmlFor="email"
        label="Email"
        required
      >
        <Input autoComplete="email" id="email" name="email" type="email" />
      </FormField>
      <Button disabled={isPending} type="submit">
        {isPending ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}

