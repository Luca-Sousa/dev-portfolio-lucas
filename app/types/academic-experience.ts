import { AcademicExperience, Module, ProgramContent } from "@prisma/client";

export type AcademicExperienceWithModules = AcademicExperience & {
  modules: (Module & {
    programContent: ProgramContent[];
  })[];
};
