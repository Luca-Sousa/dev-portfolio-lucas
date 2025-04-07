"use server";

import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface UpdateProjectImagesProps {
  projectId: string;
  images: string[];
}

export const updateProjectImages = async ({
  projectId,
  images,
}: UpdateProjectImagesProps) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Usuário não autenticado");

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("Projeto não encontrado");

  const finalImages = images;

  await db.project.update({
    where: { id: projectId },
    data: {
      imagesUrl: finalImages,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
};
