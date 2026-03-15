import { z } from "zod";
import { PlatformType } from "@/Shared/models/platform.type";

export const IMAGE_MODELS = ["GROK", "NANO BANANA"] as const;
export type ImageModel = (typeof IMAGE_MODELS)[number];

export const IMAGE_MODEL_LABELS: Record<ImageModel, string> = {
  GROK: "Grok",
  "NANO BANANA": "Nano Banana",
};

export const generationFormSchema = z.object({
  context: z.string().min(1, "Context is required"),
  projectId: z.string().optional().nullable(),
  marketingPromptId: z.string().optional().nullable(),
  platformType: z.enum([PlatformType.INSTAGRAM, PlatformType.TIKTOK]).optional().nullable(),
  assetCount: z.number().min(1).max(10),
  model: z.enum(IMAGE_MODELS).optional(),
});

export type GenerationFormData = z.infer<typeof generationFormSchema>;
