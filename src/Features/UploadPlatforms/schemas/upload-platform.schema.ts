import { z } from "zod";
import { PlatformType } from "@/Shared/models";

export const uploadPlatformSchema = z.object({
  name: z.string().min(1, "Name is required"),
  platform_type: z.enum([PlatformType.IG, PlatformType.Tiktok]),
});

export type UploadPlatformFormData = z.infer<typeof uploadPlatformSchema>;
