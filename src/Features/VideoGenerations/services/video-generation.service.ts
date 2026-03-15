import type {
  CreateVideoStoryboardRequest,
  GenerateVideoFromStoryboardRequest,
  VideoGeneration,
  VideoGenerationAsset,
  VideoGenerationStoryboard,
} from "@/Features/VideoGenerations/models";
import { api } from "@/Shared/services/api";
import { supabase } from "@/Shared/lib/supabase";

function toVideoGeneration(row: Record<string, unknown>): VideoGeneration {
  return {
    id: row.id as string,
    context: row.context as string,
    projectId: row.project_id as string | null,
    marketingPromptId: row.marketing_prompt_id as string | null,
    platformType: (row.platform_type ?? row.platform_type_id) as VideoGeneration["platformType"],
    assetCount: row.asset_count as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function toVideoGenerationStoryboard(row: Record<string, unknown>): VideoGenerationStoryboard {
  return {
    id: row.id as string,
    videoGenerationId: row.video_generation_id as string,
    content: row.content as Record<string, unknown>,
    updatedAt: row.updated_at as string,
  };
}

function toVideoGenerationAsset(row: Record<string, unknown>): VideoGenerationAsset {
  return {
    id: row.id as string,
    videoGenerationId: row.video_generation_id as string,
    index: row.index as number,
    assetUrl: row.asset_url as string | null,
    createdAt: row.created_at as string,
  };
}

export async function getVideoGenerations(): Promise<VideoGeneration[]> {
  const { data, error } = await supabase
    .from("video_generations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toVideoGeneration);
}

export async function getVideoGenerationById(id: string): Promise<VideoGeneration | null> {
  const { data, error } = await supabase
    .from("video_generations")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data ? toVideoGeneration(data) : null;
}

export async function getVideoGenerationStoryboard(
  videoGenerationId: string,
): Promise<VideoGenerationStoryboard | null> {
  const { data, error } = await supabase
    .from("video_generation_storyboards")
    .select("*")
    .eq("video_generation_id", videoGenerationId)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data ? toVideoGenerationStoryboard(data) : null;
}

export async function updateVideoGenerationStoryboard(
  videoGenerationId: string,
  content: Record<string, unknown>,
): Promise<VideoGenerationStoryboard> {
  const { data, error } = await supabase
    .from("video_generation_storyboards")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("video_generation_id", videoGenerationId)
    .select()
    .single();
  if (error) throw error;
  return toVideoGenerationStoryboard(data);
}

export async function getVideoGenerationAssets(
  videoGenerationId: string,
): Promise<VideoGenerationAsset[]> {
  const { data, error } = await supabase
    .from("video_generation_assets")
    .select("*")
    .eq("video_generation_id", videoGenerationId)
    .order("index", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toVideoGenerationAsset);
}

export async function createVideoStoryboard(
  input: CreateVideoStoryboardRequest,
): Promise<VideoGeneration> {
  const { data } = await api.post<VideoGeneration>("/video/storyboard", input);
  return data;
}

export async function generateVideoFromStoryboard(
  input: GenerateVideoFromStoryboardRequest,
): Promise<void> {
  await api.post("/video/generate", input);
}

export async function deleteVideoGeneration(id: string): Promise<void> {
  const { error } = await supabase.from("video_generations").delete().eq("id", id);
  if (error) throw error;
}
