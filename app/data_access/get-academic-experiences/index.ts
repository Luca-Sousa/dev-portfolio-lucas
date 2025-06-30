"use server";

import { db } from "@/app/lib/prisma";

export const getAcademicExperiences = async () => {
  const experiences = await db.academicExperience.findMany();

  return experiences;
};
