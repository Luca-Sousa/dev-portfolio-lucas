"use server";

import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface UpdateProjectTechnologiesProps {
  projectId: string;
  technologies: {
    id: string;
    order: number;
  }[];
  technologiesToRemove?: string[];
}

export const updateProjectTechnologies = async ({
  projectId,
  technologies,
  technologiesToRemove = [],
}: UpdateProjectTechnologiesProps) => {
  const user = await getServerSession(authOptions);
  if (!user) throw new Error("Usuário não autenticado");

  await db.$transaction(async (prisma) => {
    for (const tech of technologies) {
      await prisma.projectTechnology.update({
        where: {
          projectId_technologyId: {
            projectId,
            technologyId: tech.id,
          },
        },
        data: {
          order: tech.order,
        },
      });
    }

    if (technologiesToRemove.length > 0) {
      await prisma.projectTechnology.deleteMany({
        where: {
          projectId,
          technologyId: {
            in: technologiesToRemove,
          },
        },
      });
    }
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
};
