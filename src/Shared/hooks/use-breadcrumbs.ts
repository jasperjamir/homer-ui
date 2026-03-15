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

    if (path === ROUTES.STUDENT_DASHBOARD || path === "/") {
      return breadcrumbs;
    }

    for (const group of SIDEBAR_CONFIG) {
      const activeSubItem = group.items.find((item) => {
        const itemPath = item.url.split("?")[0];
        return itemPath === path;
      });

      if (activeSubItem) {
        const pathSegments = path.split("/").filter(Boolean);
        const parentPath = pathSegments.length > 1 ? `/${pathSegments[0]}` : "#";

        breadcrumbs.push(
          { label: group.title, href: parentPath },
          { label: activeSubItem.title, href: path },
        );
        return breadcrumbs;
      }

      const isParentRoute = group.items.some((item) => {
        const itemPath = item.url.split("?")[0];
        return itemPath.startsWith(`${path}/`);
      });

      if (isParentRoute) {
        breadcrumbs.push({ label: group.title, href: path }, { label: "Overview", href: path });
        return breadcrumbs;
      }

      const groupPath = group.url.split("?")[0];
      if (groupPath !== "#" && groupPath === path) {
        breadcrumbs.push({ label: group.title, href: path });
        return breadcrumbs;
      }
    }

    breadcrumbs.push({ label: "Overview", href: path });
    return breadcrumbs;
  };

  return {
    breadcrumbs: getBreadcrumbs(),
  };
}
