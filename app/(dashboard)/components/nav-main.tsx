"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/app/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { data } = useSession();

  const isItemActive = (url: string): boolean => {
    return pathname.startsWith(url);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span>Bem Vindo, {data?.user?.name}</span>
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isItemActive(item.url)}
              tooltip={item.title}
              onClick={() => setOpenMobile(false)}
            >
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>

                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
