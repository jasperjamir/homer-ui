import { useLocation } from "react-router";
import { ROUTES, SIDEBAR_CONFIG } from "@/Shared/utils";

export type Breadcrumb = {
  label: string;
  href: string;
  isHome?: boolean;
  onClick?: () => void;
};

export function useBreadcrumbs() {
  const location = useLocation();

  const getBreadcrumbs = (): Breadcrumb[] => {
    const path = location.pathname;
    const breadcrumbs: Breadcrumb[] = [{ label: "Home", href: ROUTES.HOME, isHome: true }];

    if (path === ROUTES.HOME || path === "/") {
      return breadcrumbs;
    }

    const groupPath = SIDEBAR_CONFIG[0]?.url.split("?")[0];
    if (groupPath === path) {
      return breadcrumbs;
    }

    breadcrumbs.push({ label: "Overview", href: path });
    return breadcrumbs;
  };

  return {
    breadcrumbs: getBreadcrumbs(),
  };
}
