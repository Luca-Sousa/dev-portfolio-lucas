import { TextGenerateEffect } from "./ui/text-generate-effect";
import MagicButton from "./magic-button";
import { FaLocationArrow } from "react-icons/fa6";
import { Spotlight } from "./ui/spotlight-new";

const Hero = () => {
  return (
    <div className="pb-20 pt-36">
      <Spotlight />

      <div className="h-screen w-full dark:bg-black-100 bg-white  dark:bg-grid-white/[0.05] bg-grid-black/[0.2] flex items-center justify-center absolute top-0 left-0">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <h2 className="uppercase tracking-widest text-xs text-center max-w-80">
            Web Magic Dinâmico com Next.js
          </h2>

          <TextGenerateEffect
            words="Transformando conceitos em experiências de usuário perfeitas"
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
          />

          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            Olá! Sou Lucas, um desenvolvedor Next.js.
          </p>

          <a href="#about">
            <MagicButton
              title="Show my work"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
