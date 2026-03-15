import { z } from "zod";

export const generationFormSchema = z.object({
  context: z.string().min(1, "Context is required"),
  projectId: z.string().optional().nullable(),
  marketingPromptId: z.string().optional().nullable(),
  platformType: z.enum([PlatformType.INSTAGRAM, PlatformType.TIKTOK]).optional().nullable(),
  assetCount: z.number().min(1).max(10),
});

export type GenerationFormData = z.infer<typeof generationFormSchema>;
