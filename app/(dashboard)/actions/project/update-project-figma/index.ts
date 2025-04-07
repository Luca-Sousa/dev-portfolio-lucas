"use server";

import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface updateProjectFigmaProps {
  projectId: string;
  figmaUrl: string | null;
}

export const updateProjectFigma = async ({
  projectId,
  figmaUrl,
}: updateProjectFigmaProps) => {
  const user = await getServerSession(authOptions);
  if (!user) throw new Error("Usuário não autenticado");

  await db.project.update({
    where: { id: projectId },
    data: { figmaUrl },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
};
