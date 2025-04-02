"use server";

import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface updateProjectRepositoryProps {
  projectId: string;
  repositoryUrl: string;
}

export const updateProjectRepository = async ({
  projectId,
  repositoryUrl,
}: updateProjectRepositoryProps) => {
  const user = await getServerSession(authOptions);

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  await db.project.update({
    where: { id: projectId },
    data: { repositoryUrl },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
};
