"use client";

import Link from "next/link";
import { academic_experiences } from "../data";
import Image from "next/image";
import { CardSpotlight } from "./ui/card-spotlight";
import { useIsMobile } from "../hooks/use-mobile";
import SingleCardButton from "./ui/single-card-button";

const AcademicExperiences = () => {
  const isMobile = useIsMobile();

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
                      width={isMobile ? 64 : 84}
                      height={isMobile ? 64 : 84}
                      className="rounded-full transition-all hover:scale-110"
                    />
                  </Link>
                </div>

                <div className="z-10 flex w-full flex-col gap-1">
                  <h1 className="text-sm font-bold leading-[1.6] text-white md:text-lg xl:text-lg">
                    {item.title}
                  </h1>

                  <Link href={item.link} target="_blank">
                    <p className="text-sm font-semibold text-purple hover:underline md:text-base">
                      {item.institution}
                    </p>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-0.5 text-xs font-normal leading-[1.6] text-white-200 sm:flex-row sm:items-center md:text-sm xl:flex-col xl:items-start">
                <span className="z-10">{item.type}</span>

                <span className="z-10">{item.date_duration}</span>
              </div>

              <div className="flex w-full flex-1 flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="z-10 text-sm font-normal leading-[1.6] text-white md:text-base lg:text-base">
                    {item.description}
                  </span>
                  {/* <span className=" text-sm leading-[1.6] text-white-200 font-normal">
                    {item.title}
                  </span> */}
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
