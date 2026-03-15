import { z } from "zod";

export const marketingPromptSchema = z.object({
  name: z.string().min(1, "Name is required"),
  prompt_text: z.string().optional().nullable(),
});

export type MarketingPromptFormData = z.infer<typeof marketingPromptSchema>;
