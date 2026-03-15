import type { PlatformType } from "@/Shared/models/platform.type";

export interface VideoGeneration {
  id: string;
  context: string;
  projectId: string | null;
  marketingPromptId: string | null;
  platformType: PlatformType | null;
  assetCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoGenerationStoryboard {
  id: string;
  videoGenerationId: string;
  content: Record<string, unknown>;
  updatedAt: string;
}

export interface VideoGenerationAsset {
  id: string;
  videoGenerationId: string;
  index: number;
  assetUrl: string | null;
  createdAt: string;
}

export type VideoGenerationInsert = Omit<
  VideoGeneration,
  "id" | "createdAt" | "updatedAt"
>;

/** API request payload for POST /video/storyboard */
export interface CreateVideoStoryboardRequest {
  marketingPromptId: string | null;
  projectId: string | null;
  context: string;
  platformType: PlatformType | null;
  assetCount: number;
}

/** API request payload for POST /video/generate */
export interface GenerateVideoFromStoryboardRequest {
  videoGenerationStoryboardId: string;
  storyboard: Record<string, unknown>;
  videoGenerationId: string;
}

/** Default mock storyboard structure for MVP */
export const MOCK_STORYBOARD_CONTENT: Record<string, unknown> = {
  frames: [
    { scene: "Scene 1", description: "Opening shot", duration: 5 },
    { scene: "Scene 2", description: "Main content", duration: 10 },
    { scene: "Scene 3", description: "Closing", duration: 5 },
  ],
};
