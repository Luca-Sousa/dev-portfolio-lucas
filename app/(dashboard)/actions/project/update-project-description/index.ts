"use server";

import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface updateProjectDescriptionProps {
  projectId: string;
  description: string;
}

export const updateProjectDescription = async ({
  projectId,
  description,
}: updateProjectDescriptionProps) => {
  const user = await getServerSession(authOptions);
  if (!user) throw new Error("Usuário não autenticado");

  await db.project.update({
    where: { id: projectId },
    data: { description },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
};
