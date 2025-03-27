"use server";

import { ProjectStatus } from "@prisma/client";
import { db } from "../lib/prisma";

interface GetProjectsProps {
  status?: ProjectStatus;
}

export const getProjects = async ({ status }: GetProjectsProps) => {
  const projects = await db.project.findMany({
    where: status ? { status } : {},
    include: {
      technologies: {
        include: {
          technology: true,
        },
      },
    },
  });

  const sortedProjects = projects.sort(
    (a, b) => b.technologies.length - a.technologies.length,
  );

  return sortedProjects.map((project) => ({
    ...project,
    technologies: project.technologies.map((tech) => ({
      id: tech.technologyId,
      name: tech.technology.name,
      description: tech.technology.description,
      iconURL: tech.technology.iconURL,
    })),
  }));
};
