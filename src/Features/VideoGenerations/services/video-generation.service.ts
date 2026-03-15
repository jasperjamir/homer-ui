import type {
  VideoGeneration,
  VideoGenerationAsset,
  VideoGenerationInsert,
  VideoGenerationStoryboard,
} from "@/Features/VideoGenerations/models";
import { MOCK_STORYBOARD_CONTENT } from "@/Features/VideoGenerations/models";
import { supabase } from "@/Shared/lib/supabase";

/** Mock video URL for MVP - replace with real API later */
function getMockVideoUrl(generationId: string, index: number): string {
  return `https://example.com/videos/${generationId}-${index}.mp4`;
}

export async function getVideoGenerations(): Promise<VideoGeneration[]> {
  const { data, error } = await supabase
    .from("video_generations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as VideoGeneration[];
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
  return data as VideoGeneration;
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
  return data as VideoGenerationStoryboard;
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
  return data as VideoGenerationStoryboard;
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
  return data as VideoGenerationAsset[];
}

/** Step 1: Create video generation + mock storyboard + empty asset slots */
export async function createVideoGenerationWithMockStoryboard(
  input: VideoGenerationInsert,
): Promise<VideoGeneration> {
  const assetCount = Math.min(10, Math.max(1, input.asset_count));
  const { data: gen, error: genError } = await supabase
    .from("video_generations")
    .insert({
      context: input.context,
      project_id: input.project_id ?? null,
      marketing_prompt_id: input.marketing_prompt_id ?? null,
      platform_type: input.platform_type ?? null,
      asset_count: assetCount,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (genError) throw genError;
  const generation = gen as VideoGeneration;

  const { error: storyboardError } = await supabase
    .from("video_generation_storyboards")
    .insert({
      video_generation_id: generation.id,
      content: MOCK_STORYBOARD_CONTENT,
      updated_at: new Date().toISOString(),
    });
  if (storyboardError) throw storyboardError;

  const assets = Array.from({ length: assetCount }, (_, i) => ({
    video_generation_id: generation.id,
    index: i + 1,
    asset_url: null,
  }));
  const { error: assetsError } = await supabase
    .from("video_generation_assets")
    .insert(assets);
  if (assetsError) throw assetsError;

  return generation;
}

/** Step 2: Fill video_generation_assets with mock video links */
export async function generateMockVideoLinks(videoGenerationId: string): Promise<void> {
  const assets = await getVideoGenerationAssets(videoGenerationId);
  for (const asset of assets) {
    const { error } = await supabase
      .from("video_generation_assets")
      .update({
        asset_url: getMockVideoUrl(videoGenerationId, asset.index),
      })
      .eq("id", asset.id);
    if (error) throw error;
  }
}

export async function deleteVideoGeneration(id: string): Promise<void> {
  const { error } = await supabase.from("video_generations").delete().eq("id", id);
  if (error) throw error;
}
