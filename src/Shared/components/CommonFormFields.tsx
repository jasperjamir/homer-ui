import type { FieldPath, FieldValues, PathValue, UseFormReturn } from "react-hook-form";
import type { User } from "@/Features/Users/models";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/Shared/components/ui/field";
import { Input } from "@/Shared/components/ui/input";
import { SearchableSelect } from "@/Shared/components/ui/searchable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Shared/components/ui/select";
import { Textarea } from "@/Shared/components/ui/textarea";

interface CommonFormFieldsProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  users: User[];
  departments: string[];
  assigneeFieldName: FieldPath<T>;
  departmentFieldName: FieldPath<T>;
  pointsFieldName: FieldPath<T>;
  assigneeLabel?: string;
  assigneeDescription?: string;
  assigneeDisabled?: boolean;
  onAssigneeChange?: (value: string) => void;
  pointsLabel?: string;
  pointsOptional?: boolean;
  showDescription?: boolean;
  descriptionFieldName?: FieldPath<T>;
  descriptionLabel?: string;
  descriptionPlaceholder?: string;
}

export function CommonFormFields<T extends FieldValues>({
  form,
  users,
  departments,
  assigneeFieldName,
  departmentFieldName,
  pointsFieldName,
  assigneeLabel = "Assignee",
  assigneeDescription,
  assigneeDisabled = false,
  onAssigneeChange,
  pointsLabel = "Points",
  pointsOptional = false,
  showDescription = true,
  descriptionFieldName,
  descriptionLabel = "Description",
  descriptionPlaceholder = "Enter description",
}: CommonFormFieldsProps<T>) {
  const handleAssigneeChange = (value: string) => {
    form.setValue(assigneeFieldName, value as PathValue<T, FieldPath<T>>);
    onAssigneeChange?.(value);
  };

  const assigneeOptions = users.map((u) => ({
    value: u.id,
    label: u.name || u.email || u.id,
  }));
  const departmentOptions = departments.map((dept) => ({ value: dept, label: dept }));

  return (
    <>
      <Field>
        <FieldLabel>Title *</FieldLabel>
        <Input {...form.register("title" as FieldPath<T>)} placeholder="Enter title" />
        <FieldError>
          {(form.formState.errors["title" as FieldPath<T>] as { message?: string })?.message}
        </FieldError>
      </Field>

      <Field>
        <FieldLabel>{assigneeLabel} *</FieldLabel>
        <SearchableSelect
          value={(form.watch(assigneeFieldName) as string) || ""}
          onValueChange={handleAssigneeChange}
          options={assigneeOptions}
          searchPlaceholder="Search assignees..."
          placeholder="Select assignee"
          disabled={assigneeDisabled}
        />
        {assigneeDescription && <FieldDescription>{assigneeDescription}</FieldDescription>}
        <FieldError>
          {(form.formState.errors[assigneeFieldName] as { message?: string })?.message}
        </FieldError>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Department *</FieldLabel>
          <SearchableSelect
            value={(form.watch(departmentFieldName) as string) || ""}
            onValueChange={(value) =>
              form.setValue(departmentFieldName, value as PathValue<T, FieldPath<T>>)
            }
            options={departmentOptions}
            searchPlaceholder="Search departments..."
          />
          <FieldError>
            {(form.formState.errors[departmentFieldName] as { message?: string })?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel>
            {pointsLabel}
            {!pointsOptional ? " *" : ""}
          </FieldLabel>
          <Select
            value={
              pointsOptional
                ? (form.watch(pointsFieldName) as string | null) || "__none__"
                : (form.watch(pointsFieldName) as string) || undefined
            }
            onValueChange={(value) => {
              if (pointsOptional && value === "__none__") {
                form.setValue(pointsFieldName, null as PathValue<T, FieldPath<T>>);
              } else {
                form.setValue(pointsFieldName, value as PathValue<T, FieldPath<T>>);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pointsOptional && <SelectItem value="__none__">None</SelectItem>}
              <SelectItem value="0.5">0.5 (15 minutes)</SelectItem>
              <SelectItem value="1">1 (1 hour)</SelectItem>
              <SelectItem value="2">2 (2 hours)</SelectItem>
              <SelectItem value="3">3 (half day)</SelectItem>
              <SelectItem value="5">5 (1 day)</SelectItem>
            </SelectContent>
          </Select>
          <FieldError>
            {(form.formState.errors[pointsFieldName] as { message?: string })?.message}
          </FieldError>
        </Field>
      </div>

      {showDescription && descriptionFieldName && (
        <Field>
          <FieldLabel>{descriptionLabel}</FieldLabel>
          <Textarea
            {...form.register(descriptionFieldName)}
            placeholder={descriptionPlaceholder}
            rows={4}
          />
          <FieldError>
            {(form.formState.errors[descriptionFieldName] as { message?: string })?.message}
          </FieldError>
        </Field>
      )}
    </>
  );
}
