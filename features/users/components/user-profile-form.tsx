"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateUserAction, archiveUserAction } from "@/features/users/actions";
import { userUpdateSchema, type UserUpdateInput } from "@/features/users/schemas/user.schema";
import type { SessionUser } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type UserProfileFormProps = {
  user: SessionUser;
  canEditStatus?: boolean;
  canArchive?: boolean;
};

type UserFormValues = {
  firstName: string;
  lastName: string;
  displayName: string;
  phone: string;
  locale: string;
  timezone: string;
  status: UserUpdateInput["status"];
  notes?: string;
};

function normalizeValue(value: string) {
  return value.trim();
}

export function UserProfileForm({
  user,
  canEditStatus = false,
  canArchive = false,
}: UserProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [archiveOpen, setArchiveOpen] = useState(false);
  const form = useForm<UserFormValues>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      phone: user.phone ?? "",
      locale: user.locale ?? "",
      timezone: user.timezone ?? "",
      status: user.status === "anonymous" ? "active" : user.status,
    },
  });

  const submit = form.handleSubmit((values) => {
    const candidate = {
      firstName: normalizeValue(values.firstName),
      lastName: normalizeValue(values.lastName),
      displayName: normalizeValue(values.displayName),
      phone: normalizeValue(values.phone) || null,
      locale: normalizeValue(values.locale) || null,
      timezone: normalizeValue(values.timezone) || null,
      ...(canEditStatus ? { status: values.status } : {}),
    };

    const parsed = userUpdateSchema.safeParse(candidate);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string") {
          form.setError(key as keyof UserFormValues, { message: issue.message });
        }
      }
      return;
    }

    startTransition(async () => {
      try {
        await updateUserAction({ userId: user.id, input: parsed.data });
        toast.success("Profile updated.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Update failed.");
      }
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile details</CardTitle>
        <CardDescription>Update the permitted identity fields for this account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {user.roles.map((role) => (
            <Badge key={role} variant="secondary" className="capitalize">
              {role}
            </Badge>
          ))}
          <Badge variant="outline" className="capitalize">
            {user.status}
          </Badge>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              error={form.formState.errors.firstName?.message}
              htmlFor="firstName"
              label="First name"
              required
            >
              <Input id="firstName" {...form.register("firstName")} />
            </FormField>
            <FormField
              error={form.formState.errors.lastName?.message}
              htmlFor="lastName"
              label="Last name"
              required
            >
              <Input id="lastName" {...form.register("lastName")} />
            </FormField>
          </div>

          <FormField
            error={form.formState.errors.displayName?.message}
            htmlFor="displayName"
            label="Display name"
            required
          >
            <Input id="displayName" {...form.register("displayName")} />
          </FormField>

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              error={form.formState.errors.phone?.message}
              htmlFor="phone"
              label="Phone"
            >
              <Input id="phone" {...form.register("phone")} />
            </FormField>
            <FormField
              error={form.formState.errors.locale?.message}
              htmlFor="locale"
              label="Locale"
            >
              <Input id="locale" placeholder="en-SG" {...form.register("locale")} />
            </FormField>
            <FormField
              error={form.formState.errors.timezone?.message}
              htmlFor="timezone"
              label="Timezone"
            >
              <Input id="timezone" placeholder="Asia/Singapore" {...form.register("timezone")} />
            </FormField>
          </div>

          {canEditStatus ? (
            <FormField
              error={form.formState.errors.status?.message}
              htmlFor="status"
              label="Status"
              required
            >
              <Select id="status" {...form.register("status")}>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="disabled">Disabled</option>
                <option value="archived">Archived</option>
              </Select>
            </FormField>
          ) : null}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button disabled={isPending} type="submit">
              {isPending ? "Saving..." : "Save changes"}
            </Button>
            {canArchive ? (
              <Button
                onClick={() => setArchiveOpen(true)}
                type="button"
                variant="danger"
              >
                Archive account
              </Button>
            ) : null}
          </div>
        </form>

        <Dialog
          description="Archiving hides the account from active workflows while retaining audit history."
          onOpenChange={setArchiveOpen}
          open={archiveOpen}
          title="Archive account"
          footer={
            <div className="flex items-center justify-end gap-2">
              <Button onClick={() => setArchiveOpen(false)} type="button" variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  startTransition(async () => {
                    try {
                      await archiveUserAction({ userId: user.id });
                      toast.success("Account archived.");
                      setArchiveOpen(false);
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Archive failed.");
                    }
                  });
                }}
                type="button"
                variant="danger"
              >
                Confirm archive
              </Button>
            </div>
          }
        >
          <p className="text-sm leading-6 text-muted-foreground">
            This action keeps the record for audit and compliance but removes the
            account from active access.
          </p>
        </Dialog>
      </CardContent>
    </Card>
  );
}
