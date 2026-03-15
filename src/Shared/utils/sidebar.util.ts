import { Home, Upload, Sparkles, LayoutList, Settings2, type LucideIcon } from "lucide-react";
import { ROUTES } from "./routes.util";

export type SidebarConfig = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
  items: { title: string; url: string }[];
};

const SIDEBAR_ITEMS: SidebarConfig[] = [
  { title: "Home", url: ROUTES.HOME, icon: Home, isActive: false, items: [] },
  {
    title: "Generate",
    url: ROUTES.IMAGE_GENERATIONS_NEW,
    icon: Sparkles,
    isActive: false,
    items: [
      { title: "Image", url: ROUTES.IMAGE_GENERATIONS_NEW },
      { title: "Video", url: ROUTES.VIDEO_GENERATIONS_NEW },
    ],
  },
  {
    title: "View",
    url: ROUTES.IMAGE_GENERATIONS,
    icon: LayoutList,
    isActive: false,
    items: [
      { title: "Images", url: ROUTES.IMAGE_GENERATIONS },
      { title: "Videos", url: ROUTES.VIDEO_GENERATIONS },
    ],
  },
  { title: "Upload", url: ROUTES.UPLOAD, icon: Upload, isActive: false, items: [] },
  {
    title: "Edit AI Builder",
    url: ROUTES.PLATFORMS,
    icon: Settings2,
    isActive: false,
    items: [
      { title: "Platforms", url: ROUTES.PLATFORMS },
      { title: "Marketing Prompts", url: ROUTES.MARKETING_PROMPTS },
      { title: "Project Prompts", url: ROUTES.PROJECTS },
    ],
  },
];

export const SIDEBAR_CONFIG: SidebarConfig[] = SIDEBAR_ITEMS;

export function getSidebarNavItems(): SidebarConfig[] {
  return SIDEBAR_ITEMS;
}
