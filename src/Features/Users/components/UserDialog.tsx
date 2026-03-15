import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { User } from "@/Features/Users/models";
import { useCreateUserMutation, useUpdateUserMutation } from "@/Features/Users/query-options";
import {
  type UserCreateFormData,
  type UserUpdateFormData,
  userCreateSchema,
  userUpdateSchema,
} from "@/Features/Users/schemas";
import { Button } from "@/Shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Shared/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/Shared/components/ui/field";
import { Input } from "@/Shared/components/ui/input";
import { AppUserRole } from "@/Shared/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Shared/components/ui/select";

type UserFormData = UserCreateFormData | (UserUpdateFormData & { password?: string });

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  defaultRole?: AppUserRole;
}

export function UserDialog({ open, onOpenChange, user, defaultRole = AppUserRole.STUDENT }: UserDialogProps) {
  const isEditing = !!user;

  const form = useForm<UserFormData>({
    resolver: zodResolver(isEditing ? userUpdateSchema : userCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      mobile_number: null,
      role: AppUserRole.STUDENT,
    },
  });

  useEffect(() => {
    if (open) {
      if (user) {
        form.reset({
          name: user.name,
          email: user.email ?? "",
          mobile_number: user.mobile_number,
          role: user.role,
        });
      } else {
        form.reset({
          name: "",
          email: "",
          password: "",
          mobile_number: null,
          role: defaultRole,
        });
      }
    }
  }, [open, user, form, defaultRole]);

  const createUser = useCreateUserMutation({
    onSuccess: () => {
      toast.success("User created successfully");
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  const updateUser = useUpdateUserMutation({
    onSuccess: () => {
      toast.success("User updated successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (isEditing && user) {
      updateUser.mutate({
        id: user.id,
        updates: {
          name: data.name,
          email: data.email ?? null,
          mobile_number: data.mobile_number,
          role: data.role,
        },
      });
    } else {
      const createData = data as UserCreateFormData;
      createUser.mutate({
        name: createData.name,
        email: createData.email,
        password: createData.password,
        mobile_number: createData.mobile_number,
        role: createData.role,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the user details below."
              : "Create a new user. An auth account will be created automatically with the email and password you provide."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <Input {...form.register("name")} placeholder="Enter display name" />
            <FieldError>{form.formState.errors.name?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Email *</FieldLabel>
            <Input {...form.register("email")} type="email" placeholder="e.g. user@example.com" />
            <FieldError>{form.formState.errors.email?.message}</FieldError>
          </Field>

          {!isEditing && (
            <Field>
              <FieldLabel>Password *</FieldLabel>
              <Input
                {...form.register("password")}
                type="password"
                placeholder="Min 6 characters"
                autoComplete="new-password"
              />
              <FieldError>{form.formState.errors.password?.message}</FieldError>
            </Field>
          )}

          <Field>
            <FieldLabel>Mobile Number</FieldLabel>
            <Input
              {...form.register("mobile_number")}
              placeholder="e.g. 09171234567"
              inputMode="tel"
              maxLength={11}
            />
            <FieldError>{form.formState.errors.mobile_number?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Role *</FieldLabel>
            <Select
              value={form.watch("role")}
              onValueChange={(value) => form.setValue("role", value as AppUserRole)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AppUserRole.STUDENT}>Student</SelectItem>
                <SelectItem value={AppUserRole.EDUCATOR}>Educator</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>{form.formState.errors.role?.message}</FieldError>
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createUser.isPending || updateUser.isPending}
              isLoading={createUser.isPending || updateUser.isPending}
            >
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
