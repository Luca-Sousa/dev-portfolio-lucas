"use server";

import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface updateProjectDeployProps {
  projectId: string;
  deployUrl: string | null;
}

export const updateProjectDeploy = async ({
  projectId,
  deployUrl,
}: updateProjectDeployProps) => {
  const user = await getServerSession(authOptions);

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  await db.project.update({
    where: { id: projectId },
    data: { deployUrl },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
};
