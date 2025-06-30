"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/app/components/ui/sidebar";
import { Separator } from "@/app/components/ui/separator";
import { Logo } from "./logo";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { data } from "@/app/data";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pt-5">
        <Logo />
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <Separator className="group-data-[collapsible=icon]:hidden" />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
