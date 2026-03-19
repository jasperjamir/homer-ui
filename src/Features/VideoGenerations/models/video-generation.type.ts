import type { PlatformType } from "@/Shared/models/platform.type";

export interface VideoGeneration {
  id: string;
  context: string;
  projectId: string | null;
  marketingPromptId: string | null;
  platformType: PlatformType | null;
  model: "GROK" | "SORA" | null;
  assetCount: number;
  duration: number | null;
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

export type VideoAssetStatusValue =
  | "queued"
  | "in_progress"
  | "success"
  | "failed"
  | "expired";

/** Asset shape returned by /video/generations/:id/assets and /video/assets/:assetId */
export interface VideoGenerationPolledAsset {
  id: string;
  videoGenerationId: string;
  index: number;
  status: VideoAssetStatusValue | null;
  pollingRequestId: string | null;
  assetUrl: string | null;
}

/** Response shape returned by /video/generations/:id/assets */
export interface VideoGenerationAssetsResponse {
  id: string;
  assets: VideoGenerationPolledAsset[];
}

export type VideoGenerationStatusValue =
  | "pending"
  | "storyboard"
  | "success"
  | "failed";

export type VideoGenerationAssetStatusValue =
  | "queued"
  | "in_progress"
  | "success"
  | "failed"
  | "expired";

export interface VideoGenerationStatusAsset {
  id: string;
  index: number;
  status: VideoGenerationAssetStatusValue | null;
  pollingRequestId: string | null;
  url: string | null;
}

export interface VideoGenerationStatus {
  id: string;
  status: VideoGenerationStatusValue;
  storyboardId: string | null;
  assets: VideoGenerationStatusAsset[];
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
  model: "GROK" | "SORA";
  duration: number;
}

/** API request payload for POST /video/generate */
export interface GenerateVideoFromStoryboardRequest {
  videoGenerationStoryboardId: string;
  storyboard: Record<string, unknown>;
  videoGenerationId: string;
  duration: number;
}

/** A single frame in the storyboard */
export interface StoryboardFrame {
  scene: string;
  duration: number;
  description: string;
}

/** Storyboard content structure */
export interface StoryboardContent {
  frames: StoryboardFrame[];
}

/** Parse content to StoryboardContent; returns empty frames if invalid */
export function parseStoryboardContent(content: Record<string, unknown>): StoryboardContent {
  const raw = content?.frames;
  if (!Array.isArray(raw)) return { frames: [] };
  const frames: StoryboardFrame[] = raw
    .filter((f): f is Record<string, unknown> => f != null && typeof f === "object")
    .map((f) => ({
      scene: typeof f.scene === "string" ? f.scene : "",
      duration: Math.min(15, Math.max(1, typeof f.duration === "number" ? f.duration : 2)),
      description: typeof f.description === "string" ? f.description : "",
    }));
  return { frames };
}

/** Convert StoryboardContent back to Record for API */
export function storyboardContentToRecord(content: StoryboardContent): Record<string, unknown> {
  return { frames: content.frames };
}

/** Default mock storyboard structure for MVP */
export const MOCK_STORYBOARD_CONTENT: Record<string, unknown> = {
  frames: [
    { scene: "Scene 1", description: "Opening shot", duration: 5 },
    { scene: "Scene 2", description: "Main content", duration: 10 },
    { scene: "Scene 3", description: "Closing", duration: 5 },
  ],
};
