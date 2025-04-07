"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { createProjectSchema, CreateProjectSchema } from "./schema";

export const createProject = async (data: CreateProjectSchema) => {
  createProjectSchema.parse(data);

  const user = await getServerSession(authOptions);
  if (!user) throw new Error("Usuário não autenticado");

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

  await db.project.create({
    data: projectData,
  });

  revalidatePath("/dashboard/projects");
};
