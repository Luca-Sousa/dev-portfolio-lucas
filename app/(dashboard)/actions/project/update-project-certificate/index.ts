"use server";

import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface UpdateProjectCertificateProps {
  projectId: string;
  certificateUrl: string | null;
}

export const updateProjectCertificate = async ({
  projectId,
  certificateUrl,
}: UpdateProjectCertificateProps) => {
  const user = await getServerSession(authOptions);
  if (!user) throw new Error("Usuário não autenticado");

  await db.project.update({
    where: { id: projectId },
    data: { certificateUrl: certificateUrl },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
};
