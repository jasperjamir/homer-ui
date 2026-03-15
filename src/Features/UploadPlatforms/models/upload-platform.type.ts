export interface UploadPlatform {
  id: string;
  name: string;
  platform_type_id: string;
  created_at: string;
  updated_at: string;
}

export type UploadPlatformInsert = Omit<
  UploadPlatform,
  "id" | "created_at" | "updated_at"
>;
export type UploadPlatformUpdate = Partial<Pick<UploadPlatform, "name" | "platform_type_id">>;
