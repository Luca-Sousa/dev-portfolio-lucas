"use server";

import { db } from "../lib/prisma";

interface GetProjectsProps {
  limit?: number;
}

export const getProjects = async ({ limit }: GetProjectsProps) => {
  const projects = await db.project.findMany({
    include: {
      technologies: {
        include: {
          technology: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const sortedProjects = projects.sort(
    (a, b) => b.technologies.length - a.technologies.length,
  );

  const limitedProjects = limit
    ? sortedProjects.slice(0, limit)
    : sortedProjects;

  return limitedProjects.map((project) => ({
    ...project,
    technologies: project.technologies.map((tech) => ({
      id: tech.technologyId,
      name: tech.technology.name,
      description: tech.technology.description,
      iconURL: tech.technology.iconURL,
    })),
  }));
};
