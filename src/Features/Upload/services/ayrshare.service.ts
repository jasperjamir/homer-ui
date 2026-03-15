import type { PoolAsset } from "@/Features/Upload/models";
import type { UploadPlatform } from "@/Features/UploadPlatforms/models";
import type { PlatformType } from "@/Features/PlatformTypes/models";

const AYRSHARE_POST_URL = "https://api.ayrshare.com/api/post";

export interface AyrsharePostBody {
  post?: string;
  platforms: string[];
  mediaUrls: string[];
  isVideo?: boolean;
}

export interface AyrshareErrorItem {
  message?: string;
  platform?: string;
  code?: number;
  details?: string;
}

export interface AyrsharePostResponse {
  status: string;
  id?: string;
  errors?: AyrshareErrorItem[];
  postIds?: unknown[];
}

const MEDIA_GUIDELINES_URL = "https://www.ayrshare.com/docs/media-guidelines";

function formatAyrshareErrors(errors: AyrshareErrorItem[] | undefined): string {
  if (!Array.isArray(errors) || errors.length === 0) return "";
  return errors
    .map((e) => {
      let text = e.message ?? e.platform ?? "Unknown error";
      if (e.details) text += ` ${e.details}`;
      if (e.code === 170) text += ` See ${MEDIA_GUIDELINES_URL}`;
      return text;
    })
    .join("; ");
}

/** Known video extensions Ayrshare uses to detect video. If URL has no video extension, set isVideo for GIFs etc. */
const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm", ".m4v", ".avi", ".mkv"];

function urlLooksLikeVideo(url: string): boolean {
  const lower = url.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.includes(ext) || lower.endsWith(ext));
}

/** Set isVideo: true for video assets, or when URL is e.g. GIF (no standard video extension). */
export function getIsVideo(asset: PoolAsset): boolean {
  if (asset.type === "video") return true;
  if (!asset.asset_url) return false;
  if (urlLooksLikeVideo(asset.asset_url)) return true;
  if (asset.asset_url.toLowerCase().endsWith(".gif")) return true;
  return false;
}

/**
 * Post to Ayrshare. Requires PUBLIC_AYRSHARE_API_KEY in env.
 */
export async function postToAyrshare(body: AyrsharePostBody): Promise<AyrsharePostResponse> {
  const apiKey = import.meta.env.PUBLIC_AYRSHARE_API_KEY;
  if (!apiKey) {
    throw new Error("PUBLIC_AYRSHARE_API_KEY is not set");
  }
  const res = await fetch(AYRSHARE_POST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      post: body.post ?? "",
      platforms: body.platforms,
      mediaUrls: body.mediaUrls,
      ...(body.isVideo !== undefined && { isVideo: body.isVideo }),
    }),
  });
  const data = (await res.json()) as AyrsharePostResponse;
  if (!res.ok) {
    const msg = formatAyrshareErrors(data.errors) || `Ayrshare error ${res.status}`;
    throw new Error(msg);
  }
  if (data.status === "error" && data.errors?.length) {
    throw new Error(formatAyrshareErrors(data.errors) ?? "Post failed");
  }
  return data;
}

/** Map platform_type code (INSTAGRAM, TIKTOK) to Ayrshare platform name (instagram, tiktok). */
const AYRSHARE_PLATFORMS = new Set(["instagram", "tiktok"]);

function platformCodeToAyrshare(code: string): string | null {
  const name = code.toLowerCase();
  return AYRSHARE_PLATFORMS.has(name) ? name : null;
}

export interface UploadSelectedResult {
  success: number;
  failed: number;
  errors: string[];
}

/**
 * From checked set (keys "type:assetId:platformId"), group by asset, resolve platforms to Ayrshare names,
 * and post each asset once to its selected platforms. Returns success/failed counts and error messages.
 */
export async function uploadSelectedAssets(
  assets: PoolAsset[],
  platforms: UploadPlatform[],
  platformTypes: PlatformType[],
  checked: Set<string>,
): Promise<UploadSelectedResult> {
  const result: UploadSelectedResult = { success: 0, failed: 0, errors: [] };
  const platformById = new Map(platforms.map((p) => [p.id, p]));
  const platformTypeById = new Map(platformTypes.map((t) => [t.id, t]));

  const byAsset = new Map<string, { asset: PoolAsset; platformIds: Set<string> }>();
  for (const k of checked) {
    const [type, assetId, platformId] = k.split(":");
    if (!type || !assetId || !platformId) continue;
    const asset = assets.find((a) => a.type === type && a.id === assetId);
    if (!asset) continue;
    const existing = byAsset.get(`${type}:${assetId}`);
    if (existing) existing.platformIds.add(platformId);
    else byAsset.set(`${type}:${assetId}`, { asset, platformIds: new Set([platformId]) });
  }

  for (const { asset, platformIds } of byAsset.values()) {
    if (!asset.asset_url) {
      result.failed += 1;
      result.errors.push(`Asset ${asset.type} #${asset.index} has no URL`);
      continue;
    }
    const ayrsharePlatforms: string[] = [];
    for (const pid of platformIds) {
      const platform = platformById.get(pid);
      if (!platform) continue;
      const pt = platformTypeById.get(platform.platform_type_id);
      if (!pt) continue;
      const name = platformCodeToAyrshare(pt.code);
      if (name && !ayrsharePlatforms.includes(name)) ayrsharePlatforms.push(name);
    }
    if (ayrsharePlatforms.length === 0) {
      result.failed += 1;
      result.errors.push(`Asset ${asset.type} #${asset.index}: no Instagram/TikTok platform selected`);
      continue;
    }
    try {
      await postToAyrshare({
        post: "",
        platforms: ayrsharePlatforms,
        mediaUrls: [asset.asset_url],
        isVideo: getIsVideo(asset),
      });
      result.success += 1;
    } catch (err) {
      result.failed += 1;
      result.errors.push(`${asset.type} #${asset.index}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return result;
}
