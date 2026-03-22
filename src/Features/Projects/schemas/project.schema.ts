import { z } from "zod";

const ALLOWED_LOGO_EXTENSIONS = /\.(png|jpg|jpeg)$/i;

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  prompt_text: z.string().optional(),
  logo_url: z
    .string()
    .optional()
    .superRefine((val, ctx) => {
      const v = val?.trim();
      if (!v) return;

      if (!z.string().url().safeParse(v).success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must be a valid URL" });
        return;
      }

      let pathname: string;
      try {
        pathname = new URL(v).pathname;
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must be a valid URL" });
        return;
      }

      if (!ALLOWED_LOGO_EXTENSIONS.test(pathname)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Logo URL must point to a PNG or JPEG file (.png, .jpg, .jpeg)",
        });
      }
    }),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
