import type { PoolAsset } from "@/Features/Upload/models";
import { supabase } from "@/Shared/lib/supabase";

export interface GetAssetsInRangeOptions {
  /** Filter assets created after this date (e.g. last hour) */
  since?: Date;
  limit?: number;
}

/** Get all asset links (image + video) optionally filtered by time - for Upload step */
export async function getAssetsInRange(
  options: GetAssetsInRangeOptions = {},
): Promise<PoolAsset[]> {
  const { since, limit = 500 } = options;
  const sinceIso = since?.toISOString();

  let imageQuery = supabase
    .from("image_generation_assets")
    .select("id, asset_url, created_at, index, image_generation_id")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (sinceIso) imageQuery = imageQuery.gte("created_at", sinceIso);

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

export interface SaveMappingsInput {
  image: Array<{ image_generation_asset_id: string; upload_platform_id: string }>;
  video: Array<{ video_generation_asset_id: string; upload_platform_id: string }>;
}

/** Replace mappings for the given assets. Removes existing mappings for these assets, then inserts new ones. */
export async function saveMappings(input: SaveMappingsInput): Promise<void> {
  const imagePairs = input.image ?? [];
  const videoPairs = input.video ?? [];

  if (imagePairs.length > 0) {
    const assetIds = [...new Set(imagePairs.map((p) => p.image_generation_asset_id))];
    await supabase
      .from("image_asset_platform_mappings")
      .delete()
      .in("image_generation_asset_id", assetIds);
    const { error } = await supabase
      .from("image_asset_platform_mappings")
      .insert(
        imagePairs.map((p) => ({
          image_generation_asset_id: p.image_generation_asset_id,
          upload_platform_id: p.upload_platform_id,
        })),
      );
    if (error) throw error;
  }

  if (videoPairs.length > 0) {
    const assetIds = [...new Set(videoPairs.map((p) => p.video_generation_asset_id))];
    await supabase
      .from("video_asset_platform_mappings")
      .delete()
      .in("video_generation_asset_id", assetIds);
    const { error } = await supabase
      .from("video_asset_platform_mappings")
      .insert(
        videoPairs.map((p) => ({
          video_generation_asset_id: p.video_generation_asset_id,
          upload_platform_id: p.upload_platform_id,
        })),
      );
    if (error) throw error;
  }
}

/** Get existing mappings for a set of asset ids (image and video) - for pre-filling matrix */
export async function getMappingsForAssets(assetIds: { image: string[]; video: string[] }) {
  const [imgRes, vidRes] = await Promise.all([
    assetIds.image.length > 0
      ? supabase
          .from("image_asset_platform_mappings")
          .select("image_generation_asset_id, upload_platform_id")
          .in("image_generation_asset_id", assetIds.image)
      : { data: [] as { image_generation_asset_id: string; upload_platform_id: string }[] },
    assetIds.video.length > 0
      ? supabase
          .from("video_asset_platform_mappings")
          .select("video_generation_asset_id, upload_platform_id")
          .in("video_generation_asset_id", assetIds.video)
      : { data: [] as { video_generation_asset_id: string; upload_platform_id: string }[] },
  ]);
  if (imgRes.error) throw imgRes.error;
  if (vidRes.error) throw vidRes.error;
  return {
    image: (imgRes.data ?? []) as { image_generation_asset_id: string; upload_platform_id: string }[],
    video: (vidRes.data ?? []) as { video_generation_asset_id: string; upload_platform_id: string }[],
  };
}
