"use server";

import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface updateProjectStartDateProps {
  projectId: string;
  startDate: Date;
}

export const updateProjectStartDate = async ({
  projectId,
  startDate,
}: updateProjectStartDateProps) => {
  const user = await getServerSession(authOptions);

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  await db.project.update({
    where: { id: projectId },
    data: { startDate },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
};
