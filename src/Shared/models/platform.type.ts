export const PlatformType = {
  INSTAGRAM: "INSTAGRAM",
  TIKTOK: "TIKTOK",
} as const;

export type PlatformType = (typeof PlatformType)[keyof typeof PlatformType];
