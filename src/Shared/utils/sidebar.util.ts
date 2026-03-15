import {
  Home,
  ImageIcon,
  Video,
  Upload,
  FolderOpen,
  MessageSquare,
  Globe,
  type LucideIcon,
} from "lucide-react";
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
  { title: "Projects", url: ROUTES.PROJECTS, icon: FolderOpen, isActive: false, items: [] },
  {
    title: "Marketing prompts",
    url: ROUTES.MARKETING_PROMPTS,
    icon: MessageSquare,
    isActive: false,
    items: [],
  },
  { title: "Platforms", url: ROUTES.PLATFORMS, icon: Globe, isActive: false, items: [] },
  {
    title: "Image generations",
    url: ROUTES.IMAGE_GENERATIONS,
    icon: ImageIcon,
    isActive: false,
    items: [],
  },
  {
    title: "Video generations",
    url: ROUTES.VIDEO_GENERATIONS,
    icon: Video,
    isActive: false,
    items: [],
  },
  { title: "Upload", url: ROUTES.UPLOAD, icon: Upload, isActive: false, items: [] },
];

export const SIDEBAR_CONFIG: SidebarConfig[] = SIDEBAR_ITEMS;

export function getSidebarNavItems(): SidebarConfig[] {
  return SIDEBAR_ITEMS;
}
