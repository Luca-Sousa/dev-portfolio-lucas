"use server";

import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface updateProjectThumbnailProps {
  projectId: string;
  thumbnailUrl: string;
}

export const updateProjectThumbnail = async ({
  projectId,
  thumbnailUrl,
}: updateProjectThumbnailProps) => {
  const user = await getServerSession(authOptions);
  if (!user) throw new Error("Usuário não autenticado");

  await db.project.update({
    where: { id: projectId },
    data: { thumbnailUrl },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
};
