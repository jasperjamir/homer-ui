import { z } from "zod";

export const uploadPlatformSchema = z.object({
  name: z.string().min(1, "Name is required"),
  platform_type_id: z.string().uuid("Select a platform type"),
});

export type UploadPlatformFormData = z.infer<typeof uploadPlatformSchema>;
