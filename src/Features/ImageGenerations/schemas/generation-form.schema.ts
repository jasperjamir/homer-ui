import { z } from "zod";
import { PlatformType } from "@/Shared/models";

export const generationFormSchema = z.object({
  context: z.string().min(1, "Context is required"),
  project_id: z.string().optional().nullable(),
  marketing_prompt_id: z.string().optional().nullable(),
  platform_type: z.enum([PlatformType.IG, PlatformType.Tiktok]).optional().nullable(),
  asset_count: z.number().min(1).max(10),
});

export type GenerationFormData = z.infer<typeof generationFormSchema>;
