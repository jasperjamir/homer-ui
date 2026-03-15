import { z } from "zod";
import { PlatformType } from "@/Shared/models/platform.type";

export const IMAGE_MODELS = ["GROK", "NANO BANANA"] as const;
export type ImageModel = (typeof IMAGE_MODELS)[number];

export const IMAGE_MODEL_LABELS: Record<ImageModel, string> = {
  GROK: "Grok",
  "NANO BANANA": "Nano Banana",
};

export const VIDEO_MODELS = ["GROK", "SORA"] as const;
export type VideoModel = (typeof VIDEO_MODELS)[number];

export const VIDEO_MODEL_LABELS: Record<VideoModel, string> = {
  GROK: "Grok",
  SORA: "Sora",
};

/** Duration options when SORA model is selected (seconds) */
export const SORA_DURATIONS = [4, 8, 12] as const;

/** Union of all model values for form validation */
const ALL_MODELS = [...IMAGE_MODELS, ...VIDEO_MODELS] as const;

export const generationFormSchema = z.object({
  context: z.string().min(1, "Context is required"),
  projectId: z.string().optional().nullable(),
  marketingPromptId: z.string().optional().nullable(),
  platformType: z.enum([PlatformType.INSTAGRAM, PlatformType.TIKTOK]).optional().nullable(),
  assetCount: z.number().min(1, "Select number of assets (1–10)").max(10, "Select number of assets (1–10)"),
  model: z.enum(ALL_MODELS).optional(),
  /** Video only: total duration in seconds (GROK: 1–15, SORA: 4|8|12) */
  duration: z.number().min(1).max(15).optional(),
});

export type GenerationFormData = z.infer<typeof generationFormSchema>;
