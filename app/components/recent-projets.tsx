/* eslint-disable @next/next/no-img-element */
"use client";

import { FaLocationArrow } from "react-icons/fa6";
import { projects } from "../data";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import Image from "next/image";
import { useRouter } from "next/navigation";

const RecentProjets = () => {
  const router = useRouter();

  return (
    <div className="py-20" id="projects">
      <h1 className="heading">
        Meus <span className="text-purple">Projetos Recentes</span>
      </h1>

      <div className="grid lg:grid-cols-2 w-full items-center justify-center lg:flex-wrap lg:flex-row py-20 gap-y-20 gap-x-10">
        {projects.map((item) => (
          <CardContainer className="inter-var w-full" key={item.id}>
            <CardBody className="relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] border-white/[0.2] rounded-xl w-fit h-fit p-6 lg:p-8 border">
              <CardItem
                translateZ="50"
                className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1"
              >
                {item.title}
              </CardItem>

              <CardItem
                as="p"
                translateZ="60"
                className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                style={{
                  color: "#BEC1DD",
                  margin: "1vh 0",
                }}
              >
                {item.des}
              </CardItem>

              <CardItem
                translateZ="100"
                className="relative size-full flex items-center justify-center overflow-hidden mb-10"
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
                  className="z-10 absolute bottom-0"
                />
              </CardItem>

              <div className="flex items-center justify-between mt-7 mb-3">
                <CardItem translateZ={20} className="flex items-center">
                  <div className="flex items-center">
                    {item.iconLists.map((icon, index) => (
                      <div
                        key={index}
                        className="border border-white/[.2] rounded-full size-9 md:size-10 flex justify-center items-center"
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

                <CardItem translateZ={20} as={"button"}>
                  <button
                    className="flex justify-center items-center"
                    onClick={() => router.push(`/projects/${item.id}`)}
                  >
                    <p className="flex lg:text-xl text-base text-purple">
                      Ver Projeto
                    </p>
                    <FaLocationArrow className="ms-3" color="#CBACF9" />
                  </button>
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
