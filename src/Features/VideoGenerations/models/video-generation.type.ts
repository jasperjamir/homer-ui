import type { PlatformType } from "@/Shared/models";

export interface VideoGeneration {
  id: string;
  context: string;
  project_id: string | null;
  marketing_prompt_id: string | null;
  platform_type: PlatformType | null;
  asset_count: number;
  created_at: string;
  updated_at: string;
}

export interface VideoGenerationStoryboard {
  id: string;
  video_generation_id: string;
  content: Record<string, unknown>;
  updated_at: string;
}

export interface VideoGenerationAsset {
  id: string;
  video_generation_id: string;
  index: number;
  asset_url: string | null;
  created_at: string;
}

export type VideoGenerationInsert = Omit<
  VideoGeneration,
  "id" | "created_at" | "updated_at"
>;

/** Default mock storyboard structure for MVP */
export const MOCK_STORYBOARD_CONTENT: Record<string, unknown> = {
  frames: [
    { scene: "Scene 1", description: "Opening shot", duration: 5 },
    { scene: "Scene 2", description: "Main content", duration: 10 },
    { scene: "Scene 3", description: "Closing", duration: 5 },
  ],
};
