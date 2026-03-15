export interface ImageGeneration {
  id: string;
  context: string;
  project_id: string | null;
  marketing_prompt_id: string | null;
  platform_type_id: string | null;
  asset_count: number;
  created_at: string;
  updated_at: string;
}

export interface ImageGenerationAsset {
  id: string;
  image_generation_id: string;
  index: number;
  asset_url: string | null;
  created_at: string;
}

export type ImageGenerationInsert = Omit<
  ImageGeneration,
  "id" | "created_at" | "updated_at"
>;
