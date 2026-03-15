import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/Shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/Shared/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Shared/components/ui/select";
import { Textarea } from "@/Shared/components/ui/textarea";
import { getMarketingPromptsQueryOptions } from "@/Features/MarketingPrompts/query-options";
import { getProjectsQueryOptions } from "@/Features/Projects/query-options";
import { PlatformType, PLATFORM_TYPE_LABELS } from "@/Shared/models/platform.type";
import type { GenerationFormData } from "@/Features/ImageGenerations/schemas";
import {
  generationFormSchema,
  IMAGE_MODEL_LABELS,
  IMAGE_MODELS,
  SORA_DURATIONS,
  VIDEO_MODEL_LABELS,
  VIDEO_MODELS,
} from "@/Features/ImageGenerations/schemas";

interface GenerationFormProps {
  defaultValues?: Partial<GenerationFormData>;
  onSubmit: (data: GenerationFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
  /** Show model dropdown; modelType determines which options (image: Grok/Nano Banana, video: Grok/Sora) */
  showModelField?: boolean;
  modelType?: "image" | "video";
  /** Show duration field (video only, seconds) */
  showDurationField?: boolean;
}

export function GenerationForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = "Generate",
  showModelField = false,
  modelType = "image",
  showDurationField = false,
}: GenerationFormProps) {
  const { data: projects = [] } = useQuery(getProjectsQueryOptions());
  const { data: marketingPrompts = [] } = useQuery(getMarketingPromptsQueryOptions());

  const form = useForm<GenerationFormData>({
    resolver: zodResolver(generationFormSchema),
    defaultValues: {
      context: "",
      projectId: null,
      marketingPromptId: null,
      platformType: null,
      assetCount: 5,
      model: "GROK",
      duration: 12,
      ...defaultValues,
    },
  });

  const model = form.watch("model");
  const isSora = modelType === "video" && model === "SORA";

  useEffect(() => {
    if (!showDurationField) return;
    const duration = form.getValues("duration") ?? 12;
    if (isSora && !SORA_DURATIONS.includes(duration as (typeof SORA_DURATIONS)[number])) {
      form.setValue("duration", 12);
    } else if (!isSora && duration > 15) {
      form.setValue("duration", 12);
    }
  }, [showDurationField, isSora, form]);

  const handleInvalid = (errors: Record<string, { message?: string }>) => {
    const messages = Object.values(errors)
      .map((e) => e?.message)
      .filter(Boolean);
    toast.error(messages[0] ?? "Please fill in all required fields");
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit, handleInvalid)} className="space-y-6">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Project</FieldLabel>
          <Select
            value={form.watch("projectId") ?? ""}
            onValueChange={(v) => form.setValue("projectId", v || null)}
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
            value={form.watch("marketingPromptId") ?? ""}
            onValueChange={(v) => form.setValue("marketingPromptId", v || null)}
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
            value={form.watch("platformType") ?? ""}
            onValueChange={(v) => form.setValue("platformType", (v as "INSTAGRAM" | "TIKTOK") || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Instagram or Tiktok" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PlatformType.INSTAGRAM}>{PLATFORM_TYPE_LABELS.INSTAGRAM}</SelectItem>
              <SelectItem value={PlatformType.TIKTOK}>{PLATFORM_TYPE_LABELS.TIKTOK}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        {showModelField && (
          <Field>
            <FieldLabel>Model</FieldLabel>
            <Controller
              name="model"
              control={form.control}
              defaultValue="GROK"
              render={({ field }) => (
                <Select
                  value={field.value ?? "GROK"}
                  onValueChange={(v) =>
                    field.onChange(
                      modelType === "video"
                        ? (v as "GROK" | "SORA")
                        : (v as "GROK" | "NANO BANANA")
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelType === "video"
                      ? VIDEO_MODELS.map((m) => (
                          <SelectItem key={m} value={m}>
                            {VIDEO_MODEL_LABELS[m]}
                          </SelectItem>
                        ))
                      : IMAGE_MODELS.map((m) => (
                          <SelectItem key={m} value={m}>
                            {IMAGE_MODEL_LABELS[m]}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        )}
        {showDurationField && (
          <Field>
            <FieldLabel>Duration</FieldLabel>
            <Select
              value={String(
                (() => {
                  const d = form.watch("duration") ?? 12;
                  return isSora && !SORA_DURATIONS.includes(d as (typeof SORA_DURATIONS)[number]) ? 12 : d;
                })()
              )}
              onValueChange={(v) => form.setValue("duration", Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {(isSora ? SORA_DURATIONS : Array.from({ length: 15 }, (_, i) => i + 1)).map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}s
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
        <Field>
          <FieldLabel>Number of assets</FieldLabel>
          <Controller
            name="assetCount"
            control={form.control}
            defaultValue={5}
            render={({ field }) => (
              <Select
                value={String(field.value ?? 5)}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={form.formState.errors.assetCount ? [form.formState.errors.assetCount] : undefined} />
        </Field>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? "Creating…" : submitLabel}
      </Button>
    </form>
  );
}
