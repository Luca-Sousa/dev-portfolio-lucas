/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-white hover:opacity-[0.9]"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute left-1/2 top-[calc(100%_+_1.2rem)] -translate-x-1/2 transform pt-2 lg:pt-4">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="overflow-hidden rounded-xl border border-white/[0.2] shadow-xl backdrop-blur-sm"
                style={{
                  background: "rgb(4,7,29)",
                  backgroundColor:
                    "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                }}
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="h-full w-max p-2 md:p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative flex items-center justify-center space-x-4 rounded-lg px-8 py-6 shadow-input lg:px-6 lg:py-4"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  projectId,
  src,
}: {
  title: string;
  description: string;
  projectId: number;
  src: string;
}) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="group relative flex w-full gap-2 p-2 lg:p-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/projects/${projectId}`)}
    >
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="z-50 shrink-0 shadow-2xl"
      />
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute inset-0 block h-full w-full rounded-xl bg-neutral-200 dark:bg-slate-800/[0.8]"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>
      <div className="z-50">
        <h4 className="mb-1 text-xs font-medium text-white md:text-sm md:font-bold">
          {title}
        </h4>
        <p className="line-clamp-4 max-w-[10rem] text-xs text-neutral-300 md:max-w-[14rem]">
          {description}
        </p>
      </div>
    </button>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="flex items-center gap-1.5 text-neutral-200 transition-colors hover:text-purple"
    >
      {children}
    </Link>
  );
};
