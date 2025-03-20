"use client";
import React, { useState } from "react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconCapProjecting,
  IconLogout,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export function SidebarDemo() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
    {
      label: "Projetos",
      href: "/dashboard/projects",
      icon: <IconCapProjecting className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
    {
      label: "Profile",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-200" />,
    },
  ];
  const [open, setOpen] = useState(false);

  const handleSignOutWithGoogleClick = () => {
    signOut();
    redirect("/");
  };

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>

        <button
          className="flex w-full cursor-pointer items-center justify-start gap-3 rounded-lg bg-destructive/60 px-3 py-1.5 focus:bg-destructive/45 focus-visible:ring-0"
          onClick={handleSignOutWithGoogleClick}
        >
          {open ? (
            <>
              <IconLogout />
              Sair da Conta
            </>
          ) : (
            <span className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
              <IconLogout />
            </span>
          )}
        </button>
      </SidebarBody>
    </Sidebar>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre font-medium text-white"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-white" />
    </Link>
  );
};
