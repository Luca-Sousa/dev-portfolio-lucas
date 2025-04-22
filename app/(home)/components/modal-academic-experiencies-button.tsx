"use client";

import React, { useState, useRef, useEffect } from "react";
import { IconClick, IconEyeCheck, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/app/hooks/use-outside-click";
import MagicButton from "../../components/magic-button";
import Link from "next/link";
import Image from "next/image";
import { HoverBorderGradient } from "../../components/ui/hover-border-gradient";
import SingleCardFormationsModules from "./single-card-formations-modules";

const ModalAcademicExperienciesButton = ({
  experience,
}: {
  experience: {
    title: string;
    type: string;
    institution: string;
    date_duration: string;
    certificate?: string;
    declaration?: string;
    description: string;
    img: string;
    link: string;
    modules: {
      title: string;
      icon: string;
      status: string;
      program_content: {
        title: string;
        description: string;
        certUrl?: string;
      }[];
    }[];
  };
}) => {
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
              className="relative z-[60] mx-auto my-10 w-[95vw] max-w-7xl rounded-3xl bg-black-200 p-6 xl:w-screen"
            >
              <button
                className="sticky right-0 top-4 z-[60] ml-auto flex size-8 items-center justify-center rounded-full bg-white"
                onClick={() => setOpen(false)}
              >
                <IconX className="size-6 text-black" />
              </button>

              <div className="space-y-4">
                <span className="text-base font-medium text-white">
                  {experience.type}
                </span>

                <div className="flex gap-3">
                  <Link href={experience.link} target="_blank">
                    <Image
                      src={experience.img}
                      alt="profile"
                      width={64}
                      height={64}
                      className="rounded-full transition-all hover:scale-110"
                    />
                  </Link>

                  <div>
                    <h2 className="text-2xl font-semibold text-white md:text-4xl">
                      {experience.title}
                    </h2>

                    <Link href={experience.link} target="_blank">
                      <p className="text-sm font-semibold text-purple hover:underline md:text-base">
                        {experience.institution}
                      </p>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-400">
                    {experience.date_duration}
                  </p>

                  {experience.declaration && (
                    <Link href={experience.declaration} target="_blank">
                      <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="button"
                        className="flex items-center gap-1 !bg-black-200 px-3 py-1.5 text-sm"
                      >
                        <IconClick size={16} />
                        {experience.declaration && "Declaração de Participação"}
                      </HoverBorderGradient>
                    </Link>
                  )}
                </div>

                <p>{experience.description}</p>

                <div className="space-y-3">
                  <h2 className="relative z-50 font-medium leading-[1.6] text-white-200">
                    Principais Módulos/Disciplinas:
                  </h2>

                  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {experience.modules.map((module, index) => (
                      <SingleCardFormationsModules
                        key={index}
                        module={module}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalAcademicExperienciesButton;
