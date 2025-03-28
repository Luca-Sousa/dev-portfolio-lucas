"use client";

import React, { useState, useRef, useEffect } from "react";
import { IconEyeCheck, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/app/hooks/use-outside-click";
import MagicButton from "../magic-button";

interface SingleCardButtonProps {
  experience: {
    title: string;
    type: string;
    institution: string;
    date_duration: string;
    description: string;
    img: string;
    link: string;
  };
}

export default function SingleCardButton({
  experience,
}: SingleCardButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => setOpen(false));

  return (
    <>
      <MagicButton
        title="Ver Detalhes"
        icon={<IconEyeCheck />}
        position="left"
        handleClick={() => setOpen(true)}
        otherClasses="bg-gradient-to-t from-purple/20 to-purple/20 hover:from-purple/30 hover:to-purple/30 transition-colors"
      />

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 !z-[9999] h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              className="relative z-[60] mx-auto my-10 w-[95vw] max-w-5xl rounded-3xl bg-white p-6 dark:bg-neutral-900 xl:w-screen"
            >
              <button
                className="sticky right-0 top-4 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
                onClick={() => setOpen(false)}
              >
                <IconX className="h-6 w-6 text-white dark:text-black" />
              </button>
              <p className="text-base font-medium text-black dark:text-white">
                {experience.type}
              </p>
              <p className="mt-4 text-2xl font-semibold text-neutral-700 dark:text-white md:text-5xl">
                {experience.title}
              </p>
              <div className="py-10">{experience.date_duration}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
