import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  prompt_text: z.string().optional(),
  logo_url: z
    .string()
    .optional()
    .refine((val) => {
      const v = val?.trim();
      if (!v) return true;
      return z.string().url().safeParse(v).success;
    }, "Must be a valid URL"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
