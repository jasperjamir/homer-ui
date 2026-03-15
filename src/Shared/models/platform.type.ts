export const PlatformType = {
  INSTAGRAM: "INSTAGRAM",
  TIKTOK: "TIKTOK",
} as const;

export type PlatformType = (typeof PlatformType)[keyof typeof PlatformType];

export const PLATFORM_TYPE_LABELS: Record<PlatformType, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "Tiktok",
};
