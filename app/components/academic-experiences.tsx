"use client";

import Link from "next/link";
import { academic_experiences } from "../data";
import Image from "next/image";
import { CardSpotlight } from "./ui/card-spotlight";
import SingleCardButton from "./ui/single-card-button";
import {
  IconCircleCheck,
  IconProgressCheck,
  IconProgressX,
} from "@tabler/icons-react";

const AcademicExperiences = () => {
  return (
    <section id="academic-experiencies" className="space-y-20 py-20">
      <h1 className="heading">
        Minhas <span className="text-purple">Experiências Acadêmicas</span>
      </h1>

      <div className="grid items-center gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {academic_experiences.map((item, index) => (
          <CardSpotlight
            key={index}
            className="flex size-full flex-col justify-between gap-6 bg-black-200"
          >
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="z-10 me-3">
                  <Link href={item.link} target="_blank">
                    <Image
                      src={item.img}
                      alt="profile"
                      width={64}
                      height={64}
                      className="rounded-full transition-all hover:scale-110"
                    />
                  </Link>
                </div>

                <h1 className="z-10 text-sm font-bold leading-[1.6] text-white md:text-lg xl:text-lg">
                  {item.title}
                </h1>
              </div>

              <div className="flex flex-col justify-between gap-0.5 text-xs leading-[1.6] text-white-200 sm:flex-row sm:items-center md:text-sm xl:flex-col xl:items-start">
                <div className="z-10">
                  <Link href={item.link} target="_blank">
                    <p className="text-sm font-semibold text-purple hover:underline md:text-base">
                      {item.institution}
                    </p>
                  </Link>

                  <span>{item.type}</span>
                </div>

                <span className="z-10">{item.date_duration}</span>
              </div>

              <div className="flex w-full flex-1 flex-row items-center">
                <span className="flex flex-col gap-3">
                  <span className="z-10 line-clamp-4 text-sm leading-[1.6] text-white md:text-base lg:text-base">
                    {item.description}
                  </span>

                  <div className="z-10 space-y-1">
                    <h2 className="font-medium leading-[1.6] text-white-200">
                      Principais Módulos/Disciplinas:
                    </h2>

                    <ul className="space-y-1.5 pl-5">
                      {item.modules.map((module, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between gap-3 text-sm leading-[1.6] text-white-200"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              alt="Imagem do Módulo do curso"
                              src={module.icon}
                              width={28}
                              height={28}
                            />

                            {module.title}
                          </div>

                          <span>
                            {module.status === "completed" && (
                              <IconCircleCheck
                                title="Módulo Concluído"
                                size={24}
                                className="stroke-emerald-500"
                              />
                            )}
                            {module.status === "in-progress" && (
                              <IconProgressCheck
                                title="Módulo Em Andamento"
                                size={24}
                                className="stroke-amber-500"
                              />
                            )}
                            {module.status === "not-started" && (
                              <IconProgressX
                                title="Módulo Não Iniciado"
                                size={24}
                                className="stroke-orange-500"
                              />
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </span>
              </div>
            </div>

            <div className="flex w-full items-center justify-end">
              <SingleCardButton experience={item} />
            </div>
          </CardSpotlight>
        ))}
      </div>
    </section>
  );
};

export default AcademicExperiences;
