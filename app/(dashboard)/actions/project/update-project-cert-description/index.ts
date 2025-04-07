"use server";

import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface updateProjectCertDescripProps {
  projectId: string;
  certDescrip: string | null;
}

export const updateProjectCertDescrip = async ({
  projectId,
  certDescrip,
}: updateProjectCertDescripProps) => {
  const user = await getServerSession(authOptions);

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  await db.project.update({
    where: { id: projectId },
    data: { certificateDesc: certDescrip },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
};
