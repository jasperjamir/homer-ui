import type { ConnectedPlatformAccount } from "@/Features/Accounts/models";
import type { PoolAsset } from "@/Features/Upload/models";
import { api } from "@/Shared/services/api";

export interface UploadSelectedResult {
  success: number;
  failed: number;
  errors: string[];
}

export interface BackendPostTarget {
  accountId: string;
  platform: string;
}

export interface BackendPostItem {
  mediaUrl: string;
  mediaType: PoolAsset["type"];
  targets: BackendPostTarget[];
}

export interface BackendPostRequest {
  items: BackendPostItem[];
  text: string;
}

/**
 * From checked set (keys "type:assetId:platformId"), group by asset and build a grouped `/post` payload.
 * Returns success/failed counts and error messages matching the existing UI expectations.
 */
export async function uploadSelectedAssets(
  assets: PoolAsset[],
  platforms: ConnectedPlatformAccount[],
  checked: Set<string>,
): Promise<UploadSelectedResult>;
// Backwards-compatible overload: older code paths passed platformTypes as a third argument.
export async function uploadSelectedAssets(
  assets: PoolAsset[],
  platforms: ConnectedPlatformAccount[],
  _platformTypes: unknown,
  checked: Set<string>,
): Promise<UploadSelectedResult>;
export async function uploadSelectedAssets(
  assets: PoolAsset[],
  platforms: ConnectedPlatformAccount[],
  third: Set<string> | unknown,
  fourth?: Set<string>,
): Promise<UploadSelectedResult> {
  const checked = third instanceof Set ? third : fourth;
  if (!checked) {
    throw new Error("uploadSelectedAssets: missing checked platforms set");
  }
  const result: UploadSelectedResult = { success: 0, failed: 0, errors: [] };
  const platformById = new Map(platforms.map((p) => [p.id, p]));

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

  const items: BackendPostItem[] = [];
  for (const { asset, platformIds } of byAsset.values()) {
    if (!asset.asset_url) {
      result.failed += 1;
      result.errors.push(`Asset ${asset.type} #${asset.index} has no URL`);
      continue;
    }

    const targets: BackendPostTarget[] = [];
    const seenTargetKey = new Set<string>();

    for (const pid of platformIds) {
      const account = platformById.get(pid);
      if (!account) continue;
      if (!account.platform) continue;

      const platform = account.platform;
      const accountId = account.account_id ?? account.id;
      const key = `${accountId}:${platform}`;
      if (seenTargetKey.has(key)) continue;
      seenTargetKey.add(key);

      targets.push({ accountId, platform });
    }

    if (targets.length === 0) {
      result.failed += 1;
      result.errors.push(`Asset ${asset.type} #${asset.index}: no connected platform selected`);
      continue;
    }

    items.push({
      mediaUrl: asset.asset_url,
      mediaType: asset.type,
      targets,
    });
  }

  if (items.length === 0) return result;

  const payload: BackendPostRequest = {
    items,
    text: "",
  };

  // Backend translates each target into a Blotato `POST /v2/posts` call.
  const backendRes = await api.post<UploadSelectedResult>("/post", payload);
  const backendData = backendRes.data;

  const backendSuccess = backendData?.success ?? 0;
  const backendFailed = backendData?.failed ?? 0;
  const backendErrors = Array.isArray(backendData?.errors) ? backendData.errors : [];

  return {
    success: result.success + backendSuccess,
    failed: result.failed + backendFailed,
    errors: [...result.errors, ...backendErrors],
  };
}
