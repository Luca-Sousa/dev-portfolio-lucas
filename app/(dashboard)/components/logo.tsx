"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function Logo() {
  const { data } = useSession();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          asChild
          tooltip={"Página Inicial"}
        >
          <Link href="/">
            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-primary ring-2 ring-primary">
              <Image src="/logo.png" alt="Logo" width={30} height={30} />
            </div>

            <div className="flex flex-col gap-1 leading-none">
              <span className="font-semibold">Portfólio de Projetos</span>
              <span className="text-xs">{data?.user?.name}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
