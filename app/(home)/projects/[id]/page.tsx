import Footer from "@/app/components/footer";
import Hero from "@/app/components/hero";
import { MacbookScroll } from "@/app/components/ui/macbook-scroll";
import { TextGenerateEffect } from "@/app/components/ui/text-generate-effect";
import { TracingBeam } from "@/app/components/ui/tracing-beam";
import { TypewriterEffectSmooth } from "@/app/components/ui/typewriter-effect";
import { projects } from "@/app/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const project = projects.find((p) => p.id === Number(params.id));

  if (!project) return notFound();

  const words = [
    {
      text: project.title,
      className: "lg:text:3xl font-bold text-base md:text-xl xl:text-3xl",
    },
  ];

  return (
    <div className="w-full">
      <Hero isPages isName="Meus Projetos" />

      <TracingBeam className="pb-96 pl-8 xl:pl-0">
        <div className="relative pt-2 antialiased">
          <div className="space-y-10">
            <div className="space-y-1.5">
              <h2 className="w-fit rounded-full">
                <TypewriterEffectSmooth words={words} />
              </h2>

              <div className="flex items-center justify-between text-sm/6 font-medium text-neutral-300">
                <div>
                  Data de Início:{" "}
                  <span className="text-purple underline">
                    {new Date().toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div>
                  Última Atualização:{" "}
                  <span className="text-purple underline">
                    {new Date().toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <TextGenerateEffect
              words={project.des}
              className="text-xs font-medium sm:text-base"
            />

            <div className="prose prose-sm dark:prose-invert text-sm">
              {project?.img && (
                <Image
                  src={project.img}
                  alt="blog thumbnail"
                  height="1000"
                  width="1000"
                  className="rounded-lg object-cover"
                />
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              {project.iconLists.map((iconList) => (
                <Image
                  key={iconList}
                  src={iconList}
                  alt="teste"
                  width={32}
                  height={32}
                />
              ))}
            </div>

            <div className="w-full overflow-hidden">
              <MacbookScroll
                title={
                  <p className="flex max-w-lg flex-col gap-1.5 sm:max-w-xl lg:max-w-2xl">
                    <span className="text-5xl uppercase text-purple md:text-xl lg:text-2xl xl:text-3xl">
                      Certificação
                    </span>
                    <span className="text-xl md:text-lg/5 lg:text-xl/7">
                      Certificado obtido durante a 6 edição da Full Stact Week,
                      realizada pelo professor Felipe Rocha da formação online
                      Full Stack Club.
                    </span>
                  </p>
                }
                badge={
                  <Link href="/projects">
                    <Badge className="size-10 -rotate-12 transform" />
                  </Link>
                }
                src={`/Certificado-FSW-Barber.jpg`}
                showGradient={false}
              />
            </div>
          </div>
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
