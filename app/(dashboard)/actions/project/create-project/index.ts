"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { createProjectSchema, CreateProjectSchema } from "./schema";

export const createProject = async (data: CreateProjectSchema) => {
  createProjectSchema.parse(data);
  const user = await getServerSession(authOptions);

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  await db.project.create({
    data: {
      ...data,
      technologies: {
        create: data.technologies.map((techId) => ({
          technology: {
            connect: { id: techId },
          },
        })),
      },
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
};
