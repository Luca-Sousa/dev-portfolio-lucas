"use server";

import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { ProjectStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface updateProjectStatusProps {
  projectId: string;
  status: ProjectStatus;
}

export const updateProjectStatus = async ({
  projectId,
  status,
}: updateProjectStatusProps) => {
  const user = await getServerSession(authOptions);
  if (!user) throw new Error("Usuário não autenticado");

  await db.project.update({
    where: { id: projectId },
    data: { status },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
};
