"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  IconCircleCheck,
  IconClick,
  IconEyeCheck,
  IconProgressCheck,
  IconProgressX,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/app/hooks/use-outside-click";
import MagicButton from "../magic-button";
import Link from "next/link";
import Image from "next/image";
import { Meteors } from "./meteors";
import { HoverBorderGradient } from "./hover-border-gradient";

interface SingleCardButtonProps {
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
      program_content: string[];
    }[];
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
              className="relative z-[60] mx-auto my-10 w-[95vw] max-w-5xl rounded-3xl bg-black-200 p-6 xl:w-screen"
            >
              <button
                className="sticky right-0 top-4 z-50 ml-auto flex size-8 items-center justify-center rounded-full bg-white"
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
                      <li key={index}>
                        <div className="relative size-full">
                          <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-red-500 bg-gradient-to-r from-blue-500 to-purple blur-3xl" />

                          <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border-[1.5px] border-black-300 bg-gray-900 px-4 py-6 shadow-xl">
                            <div className="flex items-center gap-3">
                              <div className="relative aspect-square size-8">
                                <Image
                                  alt="Imagem do Módulo do curso"
                                  src={module.icon}
                                  fill
                                  className="object-contain"
                                />
                              </div>

                              <h1 className="relative z-50 font-medium text-white">
                                {module.title}
                              </h1>
                            </div>

                            <ul className="relative z-50 mb-4 ml-7 flex-1 list-disc space-y-1.5 text-base font-normal text-slate-500">
                              {module.program_content.map((content, index) => (
                                <li
                                  key={index}
                                  className="text-sm leading-[1.6] text-white-200"
                                >
                                  {content}
                                </li>
                              ))}
                            </ul>

                            <div className="flex w-full items-center justify-between pl-3">
                              <div>
                                {module.status === "completed" && (
                                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                                    <IconCircleCheck
                                      title="Módulo Concluído"
                                      size={16}
                                      className="stroke-emerald-500"
                                    />
                                    Módulo Concluído
                                  </span>
                                )}
                                {module.status === "in-progress" && (
                                  <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
                                    <IconProgressCheck
                                      title="Módulo em Andamento"
                                      size={16}
                                      className="stroke-amber-500"
                                    />
                                    Módulo em Andamento
                                  </span>
                                )}
                                {module.status === "not-started" && (
                                  <span className="flex items-center gap-1 text-xs font-medium text-orange-500">
                                    <IconProgressX
                                      title="Módulo Não Iniciado"
                                      size={16}
                                      className="stroke-orange-500"
                                    />
                                    Módulo não Iniciado
                                  </span>
                                )}
                              </div>

                              {/* <div className="flex justify-center text-center">
                                <HoverBorderGradient
                                  containerClassName="rounded-full"
                                  as="button"
                                  className="bg-gray-900 px-3 py-1.5"
                                >
                                  Ver
                                </HoverBorderGradient>
                              </div> */}
                            </div>

                            <Meteors number={20} />
                          </div>
                        </div>
                      </li>
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
}
