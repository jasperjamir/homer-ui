export interface ImageGeneration {
  id: string;
  context: string;
  projectId: string | null;
  marketingPromptId: string | null;
  platformType: PlatformType | null;
  assetCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ImageGenerationAsset {
  id: string;
  imageGenerationId: string;
  index: number;
  assetUrl: string | null;
  createdAt: string;
}

export type ImageGenerationInsert = Omit<
  ImageGeneration,
  "id" | "createdAt" | "updatedAt"
>;

/** API request payload for POST /generate-image */
export interface CreateImageGenerationRequest {
  marketingPromptId: string | null;
  projectId: string | null;
  context: string;
  platformType: PlatformType | null;
  assetCount: number;
}
