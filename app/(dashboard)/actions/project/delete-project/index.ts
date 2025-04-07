"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteProjectSchema, DeleteProjectSchema } from "./schema";

export const deleteProject = async ({ id }: DeleteProjectSchema) => {
  deleteProjectSchema.parse({ id });

  await db.project.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/dashboard/projects/${id}`);
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${id}`);
};
