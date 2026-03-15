import { z } from "zod";

export const uploadPlatformSchema = z.object({
  name: z.string().min(1, "Name is required"),
  platform_type: z.enum([PlatformType.INSTAGRAM, PlatformType.TIKTOK]),
});

export type UploadPlatformFormData = z.infer<typeof uploadPlatformSchema>;
