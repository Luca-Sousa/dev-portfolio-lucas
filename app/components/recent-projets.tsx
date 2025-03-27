"use client";
/* eslint-disable @next/next/no-img-element */

import { FaLocationArrow } from "react-icons/fa6";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Project } from "@prisma/client";

interface ProjectWithTechs extends Project {
  technologies: {
    id: string;
    name: string;
    description: string;
    iconURL: string;
  }[];
}

interface RecentProjetsPros {
  isPage?: boolean;
  projects: ProjectWithTechs[];
}

const RecentProjets = ({ isPage, projects }: RecentProjetsPros) => {
  const router = useRouter();

  return (
    <div className="py-20" id="projects">
      <h1 className="heading">
        Meus{" "}
        <span className="text-purple">Projetos {!isPage && "Recentes"}</span>
      </h1>

      <div className="mx-auto grid w-full max-w-xs items-center justify-center gap-x-10 gap-y-20 py-20 sm:max-w-sm md:max-w-md lg:max-w-full lg:grid-cols-2 lg:flex-row lg:flex-wrap">
        {projects.map((project) => (
          <CardContainer
            className="inter-var !z-[9999] w-full"
            key={project.id}
          >
            <CardBody className="group/card relative h-fit w-fit rounded-xl border border-white/[0.2] p-6 hover:shadow-2xl hover:shadow-emerald-500/[0.1] lg:p-8">
              <CardItem
                translateZ="50"
                className="line-clamp-1 text-base font-bold md:text-xl lg:text-2xl"
              >
                {project.title}
              </CardItem>

              <CardItem
                as="p"
                translateZ="60"
                className="line-clamp-2 text-sm font-light lg:text-base lg:font-normal xl:text-lg"
                style={{
                  color: "#BEC1DD",
                  margin: "1vh 0",
                }}
              >
                {project.description}
              </CardItem>

              <CardItem
                translateZ="100"
                className="relative mb-10 flex size-full items-center justify-center overflow-hidden"
              >
                <div
                  className="relative size-full overflow-hidden lg:rounded-3xl"
                  style={{ backgroundColor: "#13162D" }}
                >
                  <img src="/bg.png" alt="bgimg" />
                </div>

                <img
                  onClick={() => router.push(`/projects/${project.id}`)}
                  src={project.thumbnailUrl}
                  alt="cover"
                  className="absolute bottom-0 z-10 cursor-pointer rounded-t-3xl"
                  title="Ver Projeto"
                />
              </CardItem>

              <div className="mb-3 mt-7 flex flex-col items-center justify-between gap-6 xl:flex-row xl:gap-0">
                <CardItem translateZ={20} className="flex items-center">
                  <div className="flex items-center">
                    {project.technologies.slice(0, 8).map((tech, index) => (
                      <div
                        key={tech.id}
                        className="flex size-9 items-center justify-center rounded-full border border-white/[.2] md:size-10"
                        style={{
                          transform: `translateX(-${5 * index + 2}px)`,
                          background: "rgb(4,7,29)",
                          backgroundColor:
                            "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                        }}
                        title={tech.name}
                      >
                        <Image
                          src={tech.iconURL}
                          alt={tech.name}
                          width={40}
                          height={40}
                          className="p-2"
                        />
                      </div>
                    ))}

                    {project.technologies.length > 8 && (
                      <div
                        className="flex size-9 items-center justify-center rounded-full border border-white/[.2] md:size-10"
                        style={{
                          transform: `translateX(-${5 * 7 + 2}px)`,
                          background: "rgb(4,7,29)",
                          backgroundColor:
                            "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                        }}
                        title="Mais Tecnologias"
                      >
                        <span className="text-sm font-medium text-purple">
                          +{project.technologies.length - 8}
                        </span>
                      </div>
                    )}
                  </div>
                </CardItem>

                <CardItem
                  translateZ={20}
                  as={"button"}
                  onClick={() => router.push(`/projects/${project.id}`)}
                  className="flex items-center justify-center gap-3 text-base text-purple lg:text-xl"
                >
                  Ver Projeto
                  <FaLocationArrow />
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </div>
  );
};

export default RecentProjets;
