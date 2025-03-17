import { TextGenerateEffect } from "./ui/text-generate-effect";
import MagicButton from "./magic-button";
import { FaDownload, FaLocationArrow } from "react-icons/fa6";
import { Spotlight } from "./ui/spotlight-new";
import Link from "next/link";

interface HeroProps {
  isPages?: boolean;
  isName?: string;
}

const Hero = ({ isPages, isName }: HeroProps) => {
  return (
    <div className={`${isPages ? " pb-40" : "pb-20 pt-36"}`}>
      <Spotlight />

      <div
        className={`${
          isPages ? "h-auto" : "h-screen"
        }  w-full bg-black-100 bg-grid-white/[0.05] flex items-center justify-center absolute top-0 left-0 `}
      >
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      {!isPages && (
        <div className="flex justify-center relative my-20 z-10">
          <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
            {/* <h2 className="uppercase tracking-widest text-xs text-center max-w-80">
            Web Magic Dinâmico com Next.js
          </h2> */}

            <TextGenerateEffect
              words="Transformando conceitos em experiências de usuário profissionais"
              className="text-center text-[40px] md:text-5xl lg:text-6xl"
            />

            <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
              Olá! Sou Lucas Sousa, um desenvolvedor Frontend!
            </p>

            <div className=" flex items-center flex-col mt-10 lg:flex-row justify-center gap-4">
              <Link href="/curriculo-lucas-de-sousa-silva.pdf">
                <MagicButton
                  title="Download CV"
                  icon={<FaDownload />}
                  position="right"
                />
              </Link>

              <Link href="#about">
                <MagicButton
                  title="Ver meu trabalho"
                  icon={<FaLocationArrow />}
                  position="right"
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
