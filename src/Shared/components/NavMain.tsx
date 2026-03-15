import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/Shared/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/Shared/components/ui/sidebar";
import type { SidebarConfig } from "@/Shared/utils";

export function NavMain({ items }: { items: SidebarConfig[] }) {
  const location = useLocation();

  const isActiveRoute = (url: string) => {
    const urlPath = url.split("?")[0];
    const urlQuery = url.split("?")[1];
    const currentPath = location.pathname;
    const currentSearch = location.search.replace("?", "");

    if (urlQuery) {
      return currentPath === urlPath && currentSearch === urlQuery;
    }

    return currentPath === urlPath && !currentSearch;
  };

  const isGroupActive = (item: SidebarConfig) => {
    return isActiveRoute(item.url) || item.items.some((subItem) => isActiveRoute(subItem.url));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // If item has no sub-items, render as a link
          if (item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActiveRoute(item.url)} tooltip={item.title}>
                  <Link to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // If item has sub-items, render as collapsible
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isGroupActive(item)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={isGroupActive(item)}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto size-4 text-accent-blue/80 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActiveRoute(subItem.url)}
                          className="data-[active=true]:bg-transparent data-[active=true]:font-semibold data-[active=true]:text-accent-blue"
                        >
                          <Link to={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
