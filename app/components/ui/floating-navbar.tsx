/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/app/lib/utils";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./navbar-menu";
import { projects } from "@/app/data";
import MagicButton from "../magic-button";
import { LuCirclePlus } from "react-icons/lu";

import Link from "next/link";

export const FloatingNav = ({
  className,
  navItemsHome,
}: {
  navItemsHome: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState<string | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit md:min-w-[70vw] lg:min-w-fit fixed z-[5000] top-10 inset-x-0 mx-auto rounded-lg border border-black/.1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-center space-x-4",
          className
        )}
        style={{
          backdropFilter: "blur(16px) saturate(180%)",
          backgroundColor: "rgba(17, 25, 40, 0.75)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.125)",
        }}
      >
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Início">
            <div className="flex flex-col space-y-4 text-sm">
              {navItemsHome.map((item, index) => (
                <HoveredLink key={index} href={item.link}>
                  {item.icon}
                  {item.name}
                </HoveredLink>
              ))}
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Projetos">
            <div className=" text-sm grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 p-1.5 md:p-4">
              {projects.map((project, index) => (
                <ProductItem
                  key={index}
                  title={project.title}
                  projectId={project.id}
                  src={project.img}
                  description={project.des}
                />
              ))}
            </div>

            <Link href="/projects" className="flex justify-end w-full">
              <MagicButton
                title="Ver Mais Projetos"
                icon={<LuCirclePlus size={20} />}
                position="right"
              />
            </Link>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="teste">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/hobby">Hobby</HoveredLink>
              <HoveredLink href="/individual">Individual</HoveredLink>
              <HoveredLink href="/team">Team</HoveredLink>
              <HoveredLink href="/enterprise">Enterprise</HoveredLink>
            </div>
          </MenuItem>
        </Menu>

        {/* <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center  flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className=" text-sm !cursor-pointer">{navItem.name}</span>
          </Link> */}

        {/* <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
          <span>Login</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
        </button> */}
      </motion.div>
    </AnimatePresence>
  );
};
