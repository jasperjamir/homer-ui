import { z } from "zod";

export const generationFormSchema = z.object({
  context: z.string().min(1, "Context is required"),
  project_id: z.string().optional().nullable(),
  marketing_prompt_id: z.string().optional().nullable(),
  platform_type_id: z.string().uuid().optional().nullable(),
  asset_count: z.number().min(1).max(10),
});

export type GenerationFormData = z.infer<typeof generationFormSchema>;
