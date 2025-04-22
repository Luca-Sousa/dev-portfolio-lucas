import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Meteors } from "@/app/components/ui/meteors";
import { IconEyeCheck, IconPointFilled } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import StatusInfoAcademicExperiences from "./status-info-academic-experiences";

const SingleCardFormationsModules = ({
  module,
}: {
  module: {
    title: string;
    icon: string;
    status: string;
    program_content: {
      title: string;
      description: string;
      certUrl?: string;
    }[];
  };
}) => {
  return (
    <li className="relative size-full">
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

        <Accordion
          type="single"
          collapsible
          className="relative z-50 mb-4 w-full flex-1"
        >
          {module.program_content.map((content, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="gap-2 px-1 text-left text-sm leading-[1.6] text-white-200">
                <IconPointFilled size={14} />
                <span className="flex-1">{content.title}</span>
              </AccordionTrigger>
              <AccordionContent className="text-slate-400">
                {content.description && (
                  <p className="mb-4">{content.description}</p>
                )}

                {content.certUrl && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">Certificado:</span>

                      <Link
                        href={content.certUrl}
                        target="_blank"
                        className="mr-1 flex items-center gap-1 text-sm text-blue-400 hover:underline"
                      >
                        <IconEyeCheck size={14} />
                        Ver PDF
                      </Link>
                    </div>

                    <div className="w-full overflow-hidden rounded-md">
                      <iframe
                        src={`${content.certUrl}#view=FitH`}
                        title={`PDF - ${content.title}`}
                        width="100%"
                        height="100%"
                        loading="lazy"
                        className="aspect-video"
                      >
                        <p>
                          Seu navegador não suporta visualização de PDF.
                          <a href={content.certUrl}>Clique para baixar</a>.
                        </p>
                      </iframe>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="pl-3">
          <StatusInfoAcademicExperiences status={module.status} size={16} />
        </div>

        <Meteors number={20} />
      </div>
    </li>
  );
};

export default SingleCardFormationsModules;
