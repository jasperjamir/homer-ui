/** Unified asset for Upload flow - from image or video generation assets */
export type AssetType = "image" | "video";

export interface PoolAsset {
  type: AssetType;
  id: string;
  asset_url: string | null;
  created_at: string;
  index: number;
  /** For display: generation context or id */
  generation_id: string;
}

export interface AssetPlatformMapping {
  assetType: AssetType;
  assetId: string;
  uploadPlatformId: string;
}
