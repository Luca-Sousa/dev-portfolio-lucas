import Link from "next/link";
import Image from "next/image";
import { CardSpotlight } from "../../components/ui/card-spotlight";
import ModalAcademicExperienciesButton from "./modal-academic-experiencies-button";
import StatusInfoAcademicExperiences from "./status-info-academic-experiences";

const SingleCardAcademicExperiences = ({
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
  return (
    <CardSpotlight className="flex size-full flex-col justify-between gap-6 bg-black-200">
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="z-10 me-3">
            <Link href={experience.link} target="_blank">
              <Image
                src={experience.img}
                alt="profile"
                width={64}
                height={64}
                className="rounded-full transition-all hover:scale-110"
              />
            </Link>
          </div>

          <h1 className="z-10 text-sm font-bold leading-[1.6] text-white md:text-lg xl:text-lg">
            {experience.title}
          </h1>
        </div>

        <div className="flex flex-col justify-between gap-0.5 text-xs leading-[1.6] text-white-200 sm:flex-row sm:items-center md:text-sm xl:flex-col xl:items-start">
          <div className="z-10">
            <Link href={experience.link} target="_blank">
              <p className="text-sm font-semibold text-purple hover:underline md:text-base">
                {experience.institution}
              </p>
            </Link>

            <span>{experience.type}</span>
          </div>

          <span className="z-10">{experience.date_duration}</span>
        </div>

        <div className="flex w-full flex-1 flex-row items-center">
          <span className="flex flex-col gap-3">
            <span className="z-10 line-clamp-3 text-sm leading-[1.6] text-white md:text-base lg:text-base">
              {experience.description}
            </span>

            <div className="z-10 space-y-1">
              <h2 className="font-medium leading-[1.6] text-white-200">
                Principais Módulos/Disciplinas:
              </h2>

              <ul className="space-y-1.5 pl-5">
                {experience.modules.map((module, index) => (
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

                    <StatusInfoAcademicExperiences
                      status={module.status}
                      size={24}
                      icon
                    />
                  </li>
                ))}
              </ul>
            </div>
          </span>
        </div>
      </div>

      <div className="flex w-full items-center justify-end">
        <ModalAcademicExperienciesButton experience={experience} />
      </div>
    </CardSpotlight>
  );
};

export default SingleCardAcademicExperiences;
