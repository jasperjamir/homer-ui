export const ROUTE_BASE = {
  ROOT: "/",
  ACCOUNT: "account",
  LOGIN: "login",
  HOME: "home",
  PROJECTS: "projects",
  MARKETING_PROMPTS: "marketing-prompts",
  PLATFORMS: "platforms",
  IMAGE_GENERATIONS: "image-generations",
  VIDEO_GENERATIONS: "video-generations",
  UPLOAD: "upload",
  NOT_FOUND: "*",
} as const;

export const ROUTES = {
  LOGIN: `/${ROUTE_BASE.ACCOUNT}/${ROUTE_BASE.LOGIN}`,
  HOME: `/${ROUTE_BASE.HOME}`,
  PROJECTS: `/${ROUTE_BASE.PROJECTS}`,
  MARKETING_PROMPTS: `/${ROUTE_BASE.MARKETING_PROMPTS}`,
  PLATFORMS: `/${ROUTE_BASE.PLATFORMS}`,
  IMAGE_GENERATIONS: `/${ROUTE_BASE.IMAGE_GENERATIONS}`,
  IMAGE_GENERATIONS_NEW: `/${ROUTE_BASE.IMAGE_GENERATIONS}/new`,
  VIDEO_GENERATIONS: `/${ROUTE_BASE.VIDEO_GENERATIONS}`,
  VIDEO_GENERATIONS_NEW: `/${ROUTE_BASE.VIDEO_GENERATIONS}/new`,
  UPLOAD: `/${ROUTE_BASE.UPLOAD}`,
} as const;

export function imageGenerationDetail(id: string): string {
  return `/${ROUTE_BASE.IMAGE_GENERATIONS}/${id}`;
}
export function videoGenerationDetail(id: string): string {
  return `/${ROUTE_BASE.VIDEO_GENERATIONS}/${id}`;
}
export function videoGenerationStoryboard(id: string): string {
  return `/${ROUTE_BASE.VIDEO_GENERATIONS}/${id}/storyboard`;
}
