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
import { LuCirclePlus } from "react-icons/lu";

import Link from "next/link";
import { IconHomeShare, IconStackPush } from "@tabler/icons-react";
import { Project } from "@prisma/client";
import { useIsMobile } from "@/app/hooks/use-mobile";
import MagicLink from "../magic-link";

interface ProjectWithTechs extends Project {
  technologies: { id: string; name: string; iconURL: string }[];
}

export const FloatingNav = ({
  className,
  navItemsHome,
  projects,
}: {
  navItemsHome: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  projects: ProjectWithTechs[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const isMobile = useIsMobile();

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
          "border-black/.1 fixed inset-x-0 top-10 z-[5000] mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-lg border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]",
          className,
        )}
        style={{
          backdropFilter: "blur(16px) saturate(180%)",
          backgroundColor: "rgba(17, 25, 40, 0.75)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.125)",
        }}
      >
        <Menu setActive={setActive}>
          {isMobile ? (
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
          ) : (
            <>
              <HoveredLink href={"/#"}>Início</HoveredLink>

              <HoveredLink href={"/#about"}>Sobre</HoveredLink>

              <HoveredLink href={"/#academic-experiencies"}>
                Exp. Acadêmicas
              </HoveredLink>

              <HoveredLink href={"/#contact"}>Contato</HoveredLink>
            </>
          )}

          <MenuItem setActive={setActive} active={active} item="Projetos">
            <div className="grid grid-cols-1 p-1.5 text-sm md:p-4 lg:grid-cols-2">
              {projects.map((project, index) => (
                <div key={index} onClick={() => setActive(null)}>
                  <ProductItem
                    title={project.title}
                    projectId={project.id}
                    src={project.thumbnailUrl}
                    description={project.description}
                  />
                </div>
              ))}
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-5 xl:flex-row xl:justify-end">
              {!isMobile && (
                <MagicLink
                  href="/#projects"
                  handleClick={() => setActive(null)}
                  title="Ver Projetos Recentes"
                  icon={<IconStackPush size={20} />}
                  position="right"
                  otherClasses="bg-gradient-to-t from-purple/20 to-purple/20 hover:from-purple/30 hover:to-purple/30 transition-colors"
                />
              )}

              <MagicLink
                href="/projects"
                handleClick={() => setActive(null)}
                title="Ver Mais Projetos"
                icon={<LuCirclePlus size={20} />}
                position="right"
              />
            </div>
          </MenuItem>

          <div className="right-0 hidden pl-4 xl:block">
            <Link href="/login">
              <button className="relative rounded-full border border-neutral-200 p-2 dark:border-white/[0.2]">
                <IconHomeShare />
                <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              </button>
            </Link>
          </div>
        </Menu>
      </motion.div>
    </AnimatePresence>
  );
};
