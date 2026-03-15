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
import { SIDEBAR_PLAN, SIDEBAR_TEAM_NAME } from "@/Shared/config/brand";
import { getSidebarNavItems } from "@/Shared/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navMain = getSidebarNavItems();

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
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
