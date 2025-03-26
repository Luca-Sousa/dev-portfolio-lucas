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
    imagesUrl: data.imagesUrl.filter((url) => typeof url === "string"),
    technologies: {
      create: data.technologies.map((techId) => ({
        technology: {
          connect: { id: techId },
        },
      })),
    },
  };

  // Criação do projeto no banco de dados
  await db.project.create({
    data: projectData,
  });

  // Revalidação dos caminhos
  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
};
