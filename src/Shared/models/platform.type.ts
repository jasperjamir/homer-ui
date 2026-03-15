export const PlatformType = {
  IG: "IG",
  Tiktok: "Tiktok",
} as const;

export type PlatformType = (typeof PlatformType)[keyof typeof PlatformType];
