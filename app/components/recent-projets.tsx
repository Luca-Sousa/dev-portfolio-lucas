/* eslint-disable @next/next/no-img-element */
"use client";

import { FaLocationArrow } from "react-icons/fa6";
import { projects } from "../data";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RecentProjetsPros {
  isPage?: boolean;
}

const RecentProjets = ({ isPage }: RecentProjetsPros) => {
  const router = useRouter();

  return (
    <div className="py-20" id="projects">
      <h1 className="heading">
        Meus{" "}
        <span className="text-purple">Projetos {!isPage && "Recentes"}</span>
      </h1>

      <div className="grid w-full items-center justify-center gap-x-10 gap-y-20 py-20 lg:grid-cols-2 lg:flex-row lg:flex-wrap">
        {projects.map((item) => (
          <CardContainer className="inter-var !z-[9999] w-full" key={item.id}>
            <CardBody className="group/card relative h-fit w-fit rounded-xl border border-white/[0.2] p-6 hover:shadow-2xl hover:shadow-emerald-500/[0.1] lg:p-8">
              <CardItem
                translateZ="50"
                className="line-clamp-1 text-base font-bold md:text-xl lg:text-2xl"
              >
                {item.title}
              </CardItem>

              <CardItem
                as="p"
                translateZ="60"
                className="line-clamp-2 text-sm font-light lg:text-xl lg:font-normal"
                style={{
                  color: "#BEC1DD",
                  margin: "1vh 0",
                }}
              >
                {item.des}
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
                  src={item.img}
                  alt="cover"
                  className="absolute bottom-0 z-10"
                />
              </CardItem>

              <div className="mb-3 mt-7 flex items-center justify-between">
                <CardItem translateZ={20} className="flex items-center">
                  <div className="flex items-center">
                    {item.iconLists.map((icon, index) => (
                      <div
                        key={index}
                        className="flex size-9 items-center justify-center rounded-full border border-white/[.2] md:size-10"
                        style={{
                          transform: `translateX(-${5 * index + 2}px)`,
                          background: "rgb(4,7,29)",
                          backgroundColor:
                            "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                        }}
                      >
                        <Image
                          src={icon}
                          alt="icon5"
                          width={40}
                          height={40}
                          className="p-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardItem>

                <CardItem
                  translateZ={20}
                  as={"button"}
                  onClick={() => router.push(`/projects/${item.id}`)}
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
