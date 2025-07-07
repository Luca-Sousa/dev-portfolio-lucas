"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { actionClient } from "@/app/lib/safe-action";
import { upsertTechnologySchema } from "./schema";
import { deleteFileFromBucketByUrl } from "@/app/utils/delete-file";

export const upsertTechnology = actionClient
  .schema(upsertTechnologySchema)
  .action(async ({ parsedInput }) => {
    const user = await getServerSession(authOptions);

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const { id, iconURL, filesToDelete, ...rest } = parsedInput;

    // Processar arquivos marcados para deletar (substituições)
    if (filesToDelete && filesToDelete.length > 0) {
      await Promise.all(
        filesToDelete.map(async (fileUrl) => {
          try {
            await deleteFileFromBucketByUrl(fileUrl);
          } catch (e) {
            console.error("Erro ao deletar arquivo substituído:", e);
          }
        }),
      );
    }

    // Buscar tecnologia anterior para pegar o ícone antigo
    let previousIconUrl: string | undefined = undefined;
    if (id) {
      const existingTech = await db.technology.findUnique({
        where: { id },
        select: { iconURL: true },
      });
      previousIconUrl = existingTech?.iconURL ?? undefined;
    }

    // Remover ícone antigo do bucket se mudou
    let iconUrlString = iconURL;
    if (previousIconUrl && iconUrlString && previousIconUrl !== iconUrlString) {
      try {
        await deleteFileFromBucketByUrl(previousIconUrl);
      } catch (e) {
        console.error("Erro ao deletar ícone antigo:", e);
      }
    }
    if (!iconUrlString && previousIconUrl) {
      iconUrlString = previousIconUrl;
    }

    const technologyData = {
      ...rest,
      iconURL: iconUrlString ?? "",
    };

    await db.technology.upsert({
      where: {
        id: id || "",
      },
      update: technologyData,
      create: technologyData,
    });

    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard/technologies");
  });
