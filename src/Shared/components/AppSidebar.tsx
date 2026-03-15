"use client";

import type * as React from "react";
import { BrandLogo } from "@/Shared/components/BrandLogo";
import { NavMain } from "@/Shared/components/NavMain";
import { NavUser } from "@/Shared/components/NavUser";
import { TeamSwitcher } from "@/Shared/components/TeamSwitcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/Shared/components/ui/sidebar";
import { Switch } from "@/Shared/components/ui/switch";
import { SIDEBAR_PLAN, SIDEBAR_TEAM_NAME } from "@/Shared/config/brand";
import { useCurrentAppUser, useViewMode } from "@/Shared/contexts";
import { getSidebarNavItems } from "@/Shared/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isEducator, isStudent } = useCurrentAppUser();
  const { viewAsStudent, setViewAsStudent } = useViewMode();
  const navMain = getSidebarNavItems({ isEducator, isStudent, viewAsStudent });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            {
              name: SIDEBAR_TEAM_NAME,
              logo: <BrandLogo variant="square" className="size-7" />,
              plan: SIDEBAR_PLAN,
            },
          ]}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        {isEducator && (
          <div className="flex items-center justify-between gap-2 px-2 py-2">
            <span className="text-muted-foreground truncate text-xs">
              View as student
            </span>
            <Switch
              checked={viewAsStudent}
              onCheckedChange={setViewAsStudent}
              aria-label="View as student"
            />
          </div>
        )}
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
