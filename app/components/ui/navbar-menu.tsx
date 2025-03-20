/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { motion } from "framer-motion";
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
    <div
      onMouseEnter={() => setActive(item)}
      className="relative flex items-center"
    >
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
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
            <div className="absolute left-1/2 top-[calc(100%_+_1.2rem)] -translate-x-1/2 transform pt-2">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="overflow-hidden rounded-2xl border border-black/[0.2] bg-white shadow-xl backdrop-blur-sm dark:border-white/[0.2] dark:bg-black"
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
      className="relative flex justify-center space-x-4 px-6 py-4 shadow-input"
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

  return (
    <button
      className="flex space-x-2"
      onClick={() => router.push(`/projects/${projectId}`)}
    >
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="mb-1 text-xs font-medium text-black dark:text-white md:text-sm md:font-bold">
          {title}
        </h4>
        <p className="line-clamp-4 max-w-[10rem] text-xs text-neutral-700 dark:text-neutral-300 md:max-w-[14rem]">
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
      className="flex items-center gap-1.5 text-neutral-700 hover:text-purple dark:text-neutral-200"
    >
      {children}
    </Link>
  );
};
