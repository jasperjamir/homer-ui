import type {
  CreateImageGenerationRequest,
  ImageGeneration,
  ImageGenerationAsset,
} from "@/Features/ImageGenerations/models";
import { api } from "@/Shared/services/api";
import { supabase } from "@/Shared/lib/supabase";

function toImageGeneration(row: Record<string, unknown>): ImageGeneration {
  return {
    id: row.id as string,
    context: row.context as string,
    projectId: row.project_id as string | null,
    marketingPromptId: row.marketing_prompt_id as string | null,
    platformType: row.platform_type as ImageGeneration["platformType"],
    assetCount: row.asset_count as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function toImageGenerationAsset(row: Record<string, unknown>): ImageGenerationAsset {
  return {
    id: row.id as string,
    imageGenerationId: row.image_generation_id as string,
    index: row.index as number,
    assetUrl: row.asset_url as string | null,
    createdAt: row.created_at as string,
  };
}

export async function getImageGenerations(): Promise<ImageGeneration[]> {
  const { data, error } = await supabase
    .from("image_generations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toImageGeneration);
}

export async function getImageGenerationById(id: string): Promise<ImageGeneration | null> {
  const { data, error } = await supabase
    .from("image_generations")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data ? toImageGeneration(data) : null;
}

export async function getImageGenerationAssets(
  imageGenerationId: string,
): Promise<ImageGenerationAsset[]> {
  const { data, error } = await supabase
    .from("image_generation_assets")
    .select("*")
    .eq("image_generation_id", imageGenerationId)
    .order("index", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(toImageGenerationAsset);
}

export async function createImageGeneration(
  input: CreateImageGenerationRequest,
): Promise<ImageGeneration> {
  const { data } = await api.post<ImageGeneration>("/image/generate", input);
  return data;
}

export async function deleteImageGeneration(id: string): Promise<void> {
  const { error } = await supabase.from("image_generations").delete().eq("id", id);
  if (error) throw error;
}
