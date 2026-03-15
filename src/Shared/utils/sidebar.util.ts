import { Home, type LucideIcon } from "lucide-react";
import { ROUTES } from "./routes.util";

export type SidebarConfig = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
  items: { title: string; url: string }[];
};

const HOME_ITEM: SidebarConfig = {
  title: "Home",
  url: ROUTES.HOME,
  icon: Home,
  isActive: false,
  items: [],
};

export const SIDEBAR_CONFIG: SidebarConfig[] = [HOME_ITEM];

export type GetSidebarNavItemsOptions = {
  isEducator: boolean;
  isStudent: boolean;
  viewAsStudent?: boolean;
};

export function getSidebarNavItems(_options: GetSidebarNavItemsOptions): SidebarConfig[] {
  return [HOME_ITEM];
}
