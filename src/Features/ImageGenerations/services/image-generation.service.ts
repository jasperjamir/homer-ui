import type {
  ImageGeneration,
  ImageGenerationAsset,
  ImageGenerationInsert,
} from "@/Features/ImageGenerations/models";
import { supabase } from "@/Shared/lib/supabase";

/** Mock image URL for MVP - replace with real API later */
function getMockImageUrl(generationId: string, index: number): string {
  return `https://picsum.photos/seed/${generationId}-${index}/400/400`;
}

export async function getImageGenerations(): Promise<ImageGeneration[]> {
  const { data, error } = await supabase
    .from("image_generations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ImageGeneration[];
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
  return data as ImageGeneration;
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
  return data as ImageGenerationAsset[];
}

export async function createImageGenerationWithMockLinks(
  input: ImageGenerationInsert,
): Promise<ImageGeneration> {
  const assetCount = Math.min(10, Math.max(1, input.asset_count));
  const { data: gen, error: genError } = await supabase
    .from("image_generations")
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
  const generation = gen as ImageGeneration;

  const assets = Array.from({ length: assetCount }, (_, i) => ({
    image_generation_id: generation.id,
    index: i + 1,
    asset_url: getMockImageUrl(generation.id, i + 1),
  }));
  const { error: assetsError } = await supabase
    .from("image_generation_assets")
    .insert(assets);
  if (assetsError) throw assetsError;

  return generation;
}

export async function deleteImageGeneration(id: string): Promise<void> {
  const { error } = await supabase.from("image_generations").delete().eq("id", id);
  if (error) throw error;
}
