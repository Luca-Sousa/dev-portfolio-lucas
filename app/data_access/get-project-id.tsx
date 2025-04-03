"use server";

import { getServerSession } from "next-auth";
import { db } from "../lib/prisma";
import { authOptions } from "../lib/auth";

interface GetProjectIdProps {
  projectId: string;
}

export const getProjectId = async ({ projectId }: GetProjectIdProps) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Not authenticated");

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      technologies: {
        include: {
          technology: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!project) throw new Error("Project not found");

  return {
    ...project,
    technologies: project.technologies.map((tech) => ({
      id: tech.technologyId,
      name: tech.technology.name,
      description: tech.technology.description,
      iconURL: tech.technology.iconURL,
    })),
  };
};
