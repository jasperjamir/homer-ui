import { BookOpen, LayoutDashboard, type LucideIcon, Users } from "lucide-react";
import { ROUTES } from "./routes.util";

export type SidebarConfig = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
  items: { title: string; url: string }[];
};

/** Student-only menu items: Student Dashboard, Learning Modules */
const STUDENT_SIDEBAR_ITEMS: SidebarConfig[] = [
  {
    title: "Student Dashboard",
    url: ROUTES.STUDENT_DASHBOARD,
    icon: LayoutDashboard,
    isActive: false,
    items: [],
  },
  {
    title: "Learning Modules",
    url: ROUTES.LEARNING_MODULES,
    icon: BookOpen,
    isActive: false,
    items: [],
  },
];

/** Educator-only menu items (in addition to student items) */
const EDUCATOR_SIDEBAR_ITEMS: SidebarConfig[] = [
  ...STUDENT_SIDEBAR_ITEMS,
  {
    title: "Educator Dashboard",
    url: ROUTES.EDUCATOR_DASHBOARD,
    icon: LayoutDashboard,
    isActive: false,
    items: [],
  },
  {
    title: "Learning Module Editor",
    url: ROUTES.LEARNING_MODULE_EDITOR,
    icon: BookOpen,
    isActive: false,
    items: [],
  },
  {
    title: "Users",
    url: ROUTES.USERS,
    icon: Users,
    isActive: false,
    items: [],
  },
];

/** Full config for breadcrumbs and other uses that need all routes. */
export const SIDEBAR_CONFIG: SidebarConfig[] = EDUCATOR_SIDEBAR_ITEMS;

export type GetSidebarNavItemsOptions = {
  isEducator: boolean;
  isStudent: boolean;
  viewAsStudent?: boolean;
};

/** Nav items for sidebar: STUDENT sees only student items; EDUCATOR sees educator items (or student items when viewAsStudent). */
export function getSidebarNavItems(options: GetSidebarNavItemsOptions): SidebarConfig[] {
  const { isEducator, isStudent, viewAsStudent } = options;

  if (isStudent) {
    return STUDENT_SIDEBAR_ITEMS;
  }

  if (isEducator) {
    return viewAsStudent ? STUDENT_SIDEBAR_ITEMS : EDUCATOR_SIDEBAR_ITEMS;
  }

  return STUDENT_SIDEBAR_ITEMS;
}
