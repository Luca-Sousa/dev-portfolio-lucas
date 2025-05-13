"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

interface MagicLinkProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
  position: "left" | "right";
  handleClick?: () => void;
  otherClasses?: string;
}

const MagicLink = ({
  title,
  icon,
  href,
  target,
  position,
  handleClick,
  otherClasses,
}: MagicLinkProps) => {
  return (
    <Link href={href} target={target} onClick={handleClick}>
      <motion.span
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.8 }}
        className="relative inline-flex h-12 w-full overflow-hidden rounded-lg p-[1px] focus:outline-none md:w-60"
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

        <span
          className={`inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl ${otherClasses}`}
        >
          {position === "left" && icon}
          {title}
          {position === "right" && icon}
        </span>
      </motion.span>
    </Link>
  );
};

export default MagicLink;
