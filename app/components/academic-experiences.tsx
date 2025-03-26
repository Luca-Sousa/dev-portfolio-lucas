"use client";

import { academic_experiences } from "../data";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const AcademicExperiences = () => {
  return (
    <section id="academic-experiencies" className="py-20">
      <h1 className="heading">
        Minhas <span className="text-purple">Experiências Acadêmicas</span>
      </h1>

      <div className="flex flex-col items-center max-lg:mt-10">
        <div className="relative flex h-[50vh] flex-col items-center justify-center overflow-hidden rounded-md antialiased md:h-[30rem]">
          <InfiniteMovingCards
            items={academic_experiences}
            direction="right"
            speed="slow"
          />
        </div>
      </div>
    </section>
  );
};

export default AcademicExperiences;
