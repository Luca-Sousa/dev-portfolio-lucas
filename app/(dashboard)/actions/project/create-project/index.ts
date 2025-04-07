"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { createProjectSchema, CreateProjectSchema } from "./schema";

export const createProject = async (data: CreateProjectSchema) => {
  // Validação dos dados
  createProjectSchema.parse(data);

  const user = await getServerSession(authOptions);

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  // Garantindo que certificateUrl e thumbnailUrl sejam strings ou null
  const projectData = {
    ...data,
    certificateUrl:
      typeof data.certificateUrl === "string" ? data.certificateUrl : null,
    thumbnailUrl:
      typeof data.thumbnailUrl === "string" ? data.thumbnailUrl : "",
    imagesUrl: data.imagesUrl
      ? data.imagesUrl.filter((url) => typeof url === "string")
      : [],
    technologies: {
      create: data.technologies.map((techId) => ({
        technology: {
          connect: { id: techId },
        },
      })),
    },
  };

  const createdProject = await db.project.create({
    data: projectData,
  });

  const projectId = createdProject.id;

  // Revalidação dos caminhos
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
};
