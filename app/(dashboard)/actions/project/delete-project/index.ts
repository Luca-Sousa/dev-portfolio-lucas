"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteProjectSchema, DeleteProjectSchema } from "./schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export const deleteProject = async ({ id }: DeleteProjectSchema) => {
  deleteProjectSchema.parse({ id });

  const user = await getServerSession(authOptions);
  if (!user) throw new Error("Usuário não autenticado");

  await db.project.delete({
    where: { id },
  });

  revalidatePath("/dashboard/projects");
};
