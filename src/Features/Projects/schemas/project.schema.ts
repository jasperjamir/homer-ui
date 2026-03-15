import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  prompt_text: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
