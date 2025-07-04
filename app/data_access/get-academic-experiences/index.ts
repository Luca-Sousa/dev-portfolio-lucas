"use server";

import { db } from "@/app/lib/prisma";

export const getAcademicExperiences = async () => {
  const experiences = await db.academicExperience.findMany({
    include: {
      modules: {
        include: {
          programContent: true,
        },
        orderBy: {
          title: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return experiences;
};
