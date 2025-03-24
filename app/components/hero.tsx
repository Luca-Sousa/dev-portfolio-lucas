import { TextGenerateEffect } from "./ui/text-generate-effect";
import MagicButton from "./magic-button";
import { FaArrowDown, FaDownload } from "react-icons/fa6";
import { Spotlight } from "./ui/spotlight-new";
import Link from "next/link";
import Image from "next/image";
import { FlipWords } from "./ui/flip-words";
import { socialMedia } from "../data";

interface HeroProps {
  isPages?: boolean;
}

const Hero = ({ isPages }: HeroProps) => {
  const words = ["frontend", "next.js", "react.js"];

  return (
    <div className={`${isPages ? "pb-40" : "pb-20 pt-36"}`}>
      <Spotlight />

      <div
        className={`${
          isPages ? "h-auto" : "h-screen"
        } absolute left-0 top-0 flex w-full items-center justify-center bg-black-100 bg-grid-white/[0.05]`}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      {!isPages && (
        <div className="relative z-10 my-20 flex items-center justify-center">
          <div className="flex max-w-[89vw] flex-col items-center justify-center md:max-w-2xl lg:max-w-[60vw]">
            <div className="flex items-center gap-3">
              <span className="relative z-50 size-2.5 rounded-full bg-emerald-400">
                <span className="absolute inset-0 animate-ping-large rounded-full bg-emerald-400 opacity-75"></span>
              </span>
              <h2 className="max-w-80 text-center text-sm tracking-widest">
                Disponível para Trabalho
              </h2>
            </div>

            <TextGenerateEffect
              words="Transformando conceitos em experiências de usuário profissionais"
              className="text-center text-[40px] md:text-4xl lg:text-5xl"
            />

            <div className="mb-4 text-center text-sm md:text-lg md:tracking-wider lg:text-2xl">
              Olá! Sou Lucas Sousa, um desenvolvedor{" "}
              <FlipWords
                words={words}
                className="text-base font-bold uppercase !text-purple md:text-xl lg:text-2xl"
              />
            </div>

            <div className="flex w-full flex-wrap items-center justify-center gap-6 md:gap-3">
              {socialMedia.map((info) => (
                <div
                  key={info.id}
                  className="saturate-180 flex h-10 w-fit cursor-pointer items-center justify-center rounded-lg border border-black-200 bg-black-200 bg-opacity-75 px-3 backdrop-blur-lg backdrop-filter transition-colors hover:border-black-300 hover:bg-black-300"
                >
                  <Link
                    href={info.link}
                    target="_blank"
                    className="flex items-center justify-center gap-2"
                  >
                    <Image src={info.img} alt="icons" width={20} height={20} />
                    <span>{info.title}</span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 lg:flex-row">
              <Link href="/curriculo-lucas-de-sousa-silva.pdf">
                <MagicButton
                  title="Download CV"
                  icon={<FaDownload />}
                  position="right"
                  otherClasses="bg-gradient-to-t from-purple/20 to-purple/20 hover:from-purple/30 hover:to-purple/30 transition-colors"
                />
              </Link>

              <Link href="#about">
                <MagicButton
                  title="Ver meu trabalho"
                  icon={<FaArrowDown />}
                  position="right"
                />
              </Link>
            </div>
          </div>

          <figure className="via-purple/from-purple/60 ml-auto hidden w-full max-w-[440px] overflow-hidden rounded-[3.75rem] bg-gradient-to-t from-purple/60 via-45% to-65% xl:block">
            <Image
              src="/perfil.png"
              alt="Hero Image"
              width={656}
              height={756}
              className="w-full"
            />
          </figure>
        </div>
      )}
    </div>
  );
};

export default Hero;
