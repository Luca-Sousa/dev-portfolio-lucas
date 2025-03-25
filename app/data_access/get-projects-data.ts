"use server";

import { db } from "../lib/prisma";
import { Prisma } from "@prisma/client";

type ProjectWithTechs = Prisma.ProjectGetPayload<{
  include: { technologies: { include: { technology: true } } };
}>;

export const getProjectsData = async (
  data: Prisma.ProjectWhereInput = {},
  limit?: number,
) => {
  try {
    const projects = await db.project.findMany({
      where: { ...data },
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
      ...(limit ? { take: limit } : {}),
    });

    return projects.map((project: ProjectWithTechs) => ({
      ...project,
      technologies: project.technologies.map(({ technology }) => ({
        id: technology.id,
        name: technology.name,
        iconURL: technology.iconURL,
      })),
    }));
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
};
