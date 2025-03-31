import BadgeStatus from "@/app/components/badge-status";
import { ButtonLinks } from "@/app/components/button-links";
import CarouselImagesProject from "@/app/components/carousel-images";
import Footer from "@/app/components/footer";
import Hero from "@/app/components/hero";
import SkillCard from "@/app/components/skill-card";
import { MacbookScroll } from "@/app/components/ui/macbook-scroll";
import { TextGenerateEffect } from "@/app/components/ui/text-generate-effect";
import { TracingBeam } from "@/app/components/ui/tracing-beam";
import { TypewriterEffectSmooth } from "@/app/components/ui/typewriter-effect";
import { getProjects } from "@/app/data_access/get-projects";
import { IconBrandGithub, IconBrandVercelFilled } from "@tabler/icons-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const ProjectPage = async ({ params }: { params: { id: string } }) => {
  const projects = await getProjects({
    data: {},
  });
  const project = projects.find((p) => p.id === params.id);

  if (!project) return notFound();

  const words = [
    {
      text: project.title,
      className: "lg:text:3xl font-bold text-base md:text-xl xl:text-3xl",
    },
  ];

  return (
    <div className="w-full lg:pt-10">
      <Hero isPages />

      <TracingBeam className="!z-50 pb-24 pl-8 xl:pb-32 xl:pl-0">
        <div className="relative pt-2 antialiased">
          <div className="space-y-3 lg:space-y-1.5">
            <div className="flex w-full flex-col gap-2.5 md:flex-row md:items-center">
              <h2 className="w-fit flex-1 rounded-full">
                <TypewriterEffectSmooth words={words} />
              </h2>

              <BadgeStatus status={project.status} />
            </div>

            <div className="flex flex-col justify-between text-xs/6 font-medium text-neutral-300 sm:flex-row sm:items-center md:text-sm/6">
              <div>
                Data de Início:{" "}
                <span className="text-purple underline">
                  {project.startDate.toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div>
                Última Atualização:{" "}
                <span className="text-purple underline">
                  {project.updatedAt.toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <TextGenerateEffect
            words={project.description}
            className="py-6 text-sm font-medium sm:text-base"
          />

          <CarouselImagesProject project={project.imagesUrl} />

          <div className="space-y-10 pt-14 xl:pt-16">
            <p className="max-w-full text-center text-3xl font-bold uppercase text-purple md:text-xl lg:text-2xl xl:text-3xl">
              Tecnologias
            </p>

            <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-3">
              {project.technologies.map((tech) => (
                <SkillCard
                  key={tech.id}
                  imageURL={tech.iconURL}
                  label={tech.name}
                  description={tech.description}
                />
              ))}
            </div>
          </div>

          <div className="space-y-10 pt-14 xl:pt-16">
            <p className="max-w-full text-center text-3xl font-bold uppercase text-purple md:text-xl lg:text-2xl xl:text-3xl">
              Links
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-10">
              <ButtonLinks
                icon={<IconBrandGithub className="size-8" />}
                link={project.repositoryUrl}
                title="Github"
              />

              {project.deployUrl && (
                <ButtonLinks
                  icon={<IconBrandVercelFilled className="size-8" />}
                  link={project.deployUrl}
                  title="Vercel"
                />
              )}
            </div>
          </div>

          {project.certificateUrl && (
            <div className="w-full overflow-hidden">
              <MacbookScroll
                title={
                  <p className="flex max-w-lg flex-col gap-1.5 sm:max-w-xl lg:max-w-2xl">
                    <span className="text-5xl uppercase text-purple md:text-xl lg:text-2xl xl:text-3xl">
                      Certificação
                    </span>
                    <span className="text-xl md:text-lg/5 lg:text-xl/7">
                      {project.certificateDesc}
                    </span>
                  </p>
                }
                badge={
                  <Link href="/projects">
                    <Badge className="size-10 -rotate-12 transform" />
                  </Link>
                }
                src={project.certificateUrl}
                showGradient={false}
              />
            </div>
          )}

          {project.figmaUrl && (
            <div className="hidden space-y-10 pt-14 lg:block xl:pt-16">
              <p className="max-w-full text-center text-3xl font-bold uppercase text-purple md:text-xl lg:text-2xl xl:text-3xl">
                Prototipação - Figma
              </p>

              <iframe
                className="min-h-[70vh] w-full max-w-full rounded-lg border border-gray-300 bg-black shadow-lg"
                src={project.figmaUrl}
                allowFullScreen
              />
            </div>
          )}
        </div>
      </TracingBeam>

      <Footer />
    </div>
  );
};

export default ProjectPage;

const Badge = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z"
        fill="#00AA45"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M28 54C42.3594 54 54 42.3594 54 28C54 13.6406 42.3594 2 28 2C13.6406 2 2 13.6406 2 28C2 42.3594 13.6406 54 28 54ZM28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
        fill="#219653"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M27.0769 12H15V46H24.3846V38.8889H27.0769C34.7305 38.8889 41 32.9048 41 25.4444C41 17.984 34.7305 12 27.0769 12ZM24.3846 29.7778V21.1111H27.0769C29.6194 21.1111 31.6154 23.0864 31.6154 25.4444C31.6154 27.8024 29.6194 29.7778 27.0769 29.7778H24.3846Z"
        fill="#24292E"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18 11H29.0769C36.2141 11 42 16.5716 42 23.4444C42 30.3173 36.2141 35.8889 29.0769 35.8889H25.3846V43H18V11ZM25.3846 28.7778H29.0769C32.1357 28.7778 34.6154 26.39 34.6154 23.4444C34.6154 20.4989 32.1357 18.1111 29.0769 18.1111H25.3846V28.7778Z"
        fill="white"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17 10H29.0769C36.7305 10 43 15.984 43 23.4444C43 30.9048 36.7305 36.8889 29.0769 36.8889H26.3846V44H17V10ZM19 12V42H24.3846V34.8889H29.0769C35.6978 34.8889 41 29.7298 41 23.4444C41 17.1591 35.6978 12 29.0769 12H19ZM24.3846 17.1111H29.0769C32.6521 17.1111 35.6154 19.9114 35.6154 23.4444C35.6154 26.9775 32.6521 29.7778 29.0769 29.7778H24.3846V17.1111ZM26.3846 19.1111V27.7778H29.0769C31.6194 27.7778 33.6154 25.8024 33.6154 23.4444C33.6154 21.0864 31.6194 19.1111 29.0769 19.1111H26.3846Z"
        fill="#24292E"
      ></path>
    </svg>
  );
};
