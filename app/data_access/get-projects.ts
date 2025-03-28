"use server";

import { Prisma } from "@prisma/client";
import { db } from "../lib/prisma";

interface GetProjectsProps {
  data: Prisma.ProjectWhereInput;
  limit?: number;
}

export const getProjects = async ({ data, limit }: GetProjectsProps) => {
  const projects = await db.project.findMany({
    where: { ...data },
    orderBy: { createdAt: "desc" },
    take: limit ?? undefined,
  });

  const projectsWithTechs = await Promise.all(
    projects.map(async (project) => {
      const technologies = await db.projectTechnology.findMany({
        where: { projectId: project.id },
        include: {
          technology: true,
        },
      });

      return {
        ...project,
        technologies: technologies.map(({ technology }) => ({
          id: technology.id,
          name: technology.name,
          description: technology.description,
          iconURL: technology.iconURL,
        })),
      };
    }),
  );

  return projectsWithTechs;
};
