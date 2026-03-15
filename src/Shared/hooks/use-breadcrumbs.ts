import { useLocation } from "react-router";
import { ROUTES, SIDEBAR_CONFIG } from "@/Shared/utils";

export type Breadcrumb = {
  label: string;
  href: string;
  isHome?: boolean;
  onClick?: () => void;
};

function findSidebarEntry(path: string): { group: (typeof SIDEBAR_CONFIG)[0]; subItem?: { title: string; url: string } } | null {
  const pathNorm = path.split("?")[0];
  for (const item of SIDEBAR_CONFIG) {
    if (item.url === pathNorm && item.items.length === 0) {
      return { group: item };
    }
    for (const sub of item.items) {
      if (sub.url === pathNorm || pathNorm.startsWith(sub.url + "/")) {
        return { group: item, subItem: sub };
      }
    }
  }
  return null;
}

export function useBreadcrumbs() {
  const location = useLocation();

  const getBreadcrumbs = (): Breadcrumb[] => {
    const path = location.pathname;
    const breadcrumbs: Breadcrumb[] = [{ label: "Home", href: ROUTES.HOME, isHome: true }];

    if (path === ROUTES.HOME || path === "/" || path === "/home") {
      return breadcrumbs;
    }

    const entry = findSidebarEntry(path);
    if (entry) {
      if (entry.subItem) {
        breadcrumbs.push({ label: entry.group.title, href: entry.subItem.url });
        breadcrumbs.push({ label: entry.subItem.title, href: path });
      } else {
        breadcrumbs.push({ label: entry.group.title, href: path });
      }
      return breadcrumbs;
    }

    breadcrumbs.push({ label: "Page", href: path });
    return breadcrumbs;
  };

  return {
    breadcrumbs: getBreadcrumbs(),
  };
}
