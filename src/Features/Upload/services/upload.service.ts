import type { PoolAsset } from "@/Features/Upload/models";
import { supabase } from "@/Shared/lib/supabase";

export interface GetAssetsInRangeOptions {
  /** Filter assets created after this date (e.g. last hour) */
  since?: Date;
  limit?: number;
  /** When set, only return image assets from this image generation (no videos) */
  imageGenerationId?: string;
  /** When set, only return video assets from this video generation (no images) */
  videoGenerationId?: string;
}

/** Get all asset links (image + video) optionally filtered by time or image/video generation - for Upload step */
export async function getAssetsInRange(
  options: GetAssetsInRangeOptions = {},
): Promise<PoolAsset[]> {
  const { since, limit = 500, imageGenerationId, videoGenerationId } = options;
  const sinceIso = since?.toISOString();

  if (videoGenerationId) {
    let videoQuery = supabase
      .from("video_generation_assets")
      .select("id, asset_url, created_at, index, video_generation_id")
      .eq("video_generation_id", videoGenerationId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (sinceIso) videoQuery = videoQuery.gte("created_at", sinceIso);
    const videoResult = await videoQuery;
    if (videoResult.error) throw videoResult.error;
    const videoAssets: PoolAsset[] = (videoResult.data ?? []).map((row: Record<string, unknown>) => ({
      type: "video" as const,
      id: row.id as string,
      asset_url: row.asset_url as string | null,
      created_at: row.created_at as string,
      index: row.index as number,
      generation_id: row.video_generation_id as string,
    }));
    return videoAssets.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  let imageQuery = supabase
    .from("image_generation_assets")
    .select("id, asset_url, created_at, index, image_generation_id")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (sinceIso) imageQuery = imageQuery.gte("created_at", sinceIso);
  if (imageGenerationId) imageQuery = imageQuery.eq("image_generation_id", imageGenerationId);

  if (imageGenerationId) {
    const imageResult = await imageQuery;
    if (imageResult.error) throw imageResult.error;
    const imageAssets: PoolAsset[] = (imageResult.data ?? []).map((row: Record<string, unknown>) => ({
      type: "image" as const,
      id: row.id as string,
      asset_url: row.asset_url as string | null,
      created_at: row.created_at as string,
      index: row.index as number,
      generation_id: row.image_generation_id as string,
    }));
    return imageAssets.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  let videoQuery = supabase
    .from("video_generation_assets")
    .select("id, asset_url, created_at, index, video_generation_id")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (sinceIso) videoQuery = videoQuery.gte("created_at", sinceIso);

  const [imageResult, videoResult] = await Promise.all([
    imageQuery,
    videoQuery,
  ]);

  if (imageResult.error) throw imageResult.error;
  if (videoResult.error) throw videoResult.error;

  const imageAssets: PoolAsset[] = (imageResult.data ?? []).map((row: Record<string, unknown>) => ({
    type: "image" as const,
    id: row.id as string,
    asset_url: row.asset_url as string | null,
    created_at: row.created_at as string,
    index: row.index as number,
    generation_id: row.image_generation_id as string,
  }));

  const videoAssets: PoolAsset[] = (videoResult.data ?? []).map((row: Record<string, unknown>) => ({
    type: "video" as const,
    id: row.id as string,
    asset_url: row.asset_url as string | null,
    created_at: row.created_at as string,
    index: row.index as number,
    generation_id: row.video_generation_id as string,
  }));

  return [...imageAssets, ...videoAssets].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}
