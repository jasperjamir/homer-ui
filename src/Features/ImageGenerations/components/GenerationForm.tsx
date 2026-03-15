import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/Shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/Shared/components/ui/field";
import { Input } from "@/Shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Shared/components/ui/select";
import { Textarea } from "@/Shared/components/ui/textarea";
import { getMarketingPromptsQueryOptions } from "@/Features/MarketingPrompts/query-options";
import { getPlatformTypesQueryOptions } from "@/Features/PlatformTypes/query-options";
import { getProjectsQueryOptions } from "@/Features/Projects/query-options";
import { getUploadPlatformsQueryOptions } from "@/Features/UploadPlatforms/query-options";
import type { GenerationFormData } from "@/Features/ImageGenerations/schemas";
import { generationFormSchema } from "@/Features/ImageGenerations/schemas";

interface GenerationFormProps {
  defaultValues?: Partial<GenerationFormData>;
  onSubmit: (data: GenerationFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function GenerationForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = "Generate",
}: GenerationFormProps) {
  const { data: projects = [] } = useQuery(getProjectsQueryOptions());
  const { data: marketingPrompts = [] } = useQuery(getMarketingPromptsQueryOptions());
  const { data: platformTypes = [] } = useQuery(getPlatformTypesQueryOptions());
  const { data: platforms = [] } = useQuery(getUploadPlatformsQueryOptions());

  const form = useForm<GenerationFormData>({
    resolver: zodResolver(generationFormSchema),
    defaultValues: {
      context: "",
      project_id: null,
      marketing_prompt_id: null,
      platform_type_id: null,
      asset_count: 5,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel>Context</FieldLabel>
        <Textarea
          {...form.register("context")}
          placeholder="e.g. Granddaughter asking her grandmother to have an online neurologist checkup"
          rows={4}
          className="resize-none"
        />
        <FieldError errors={form.formState.errors.context ? [form.formState.errors.context] : undefined} />
      </Field>
      <Field>
        <FieldLabel>Project</FieldLabel>
        <Select
          value={form.watch("project_id") ?? ""}
          onValueChange={(v) => form.setValue("project_id", v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel>Marketing prompt</FieldLabel>
        <Select
          value={form.watch("marketing_prompt_id") ?? ""}
          onValueChange={(v) => form.setValue("marketing_prompt_id", v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select marketing prompt" />
          </SelectTrigger>
          <SelectContent>
            {marketingPrompts.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel>Platform type</FieldLabel>
        <Select
          value={form.watch("platform_type_id") ?? ""}
          onValueChange={(v) => form.setValue("platform_type_id", v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select platform type" />
          </SelectTrigger>
          <SelectContent>
            {platformTypes.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel>Number of assets (1–10)</FieldLabel>
        <Input
          type="number"
          min={1}
          max={10}
          {...form.register("asset_count", { valueAsNumber: true })}
        />
        <FieldError errors={form.formState.errors.asset_count ? [form.formState.errors.asset_count] : undefined} />
      </Field>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating…" : submitLabel}
      </Button>
    </form>
  );
}
