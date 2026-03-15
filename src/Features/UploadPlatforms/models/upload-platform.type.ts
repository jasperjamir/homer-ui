import type { PlatformType } from "@/Shared/models";

export interface UploadPlatform {
  id: string;
  name: string;
  platform_type: PlatformType;
  created_at: string;
  updated_at: string;
}

export type UploadPlatformInsert = Omit<
  UploadPlatform,
  "id" | "created_at" | "updated_at"
>;
export type UploadPlatformUpdate = Partial<Pick<UploadPlatform, "name" | "platform_type">>;
