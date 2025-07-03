"use server";

import { getServerSession } from "next-auth";
import { upsertProjectSchema } from "./schema";
import { actionClient } from "@/app/lib/safe-action";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteFileFromBucket } from "@/app/utils/delete-file";

export const upsertProject = actionClient
  .schema(upsertProjectSchema)
  .action(async ({ parsedInput }) => {
    const user = await getServerSession(authOptions);
    if (!user) throw new Error("Usuário não autenticado");

    const {
      id,
      certificateUrl,
      thumbnailUrl,
      imagesUrl,
      technologies,
      filesToDelete,
      ...rest
    } = parsedInput;

    // Processar arquivos marcados para deletar (substituições)
    if (filesToDelete && filesToDelete.length > 0) {
      await Promise.all(
        filesToDelete.map(async (fileUrl) => {
          try {
            const url = new URL(fileUrl);
            const fileKey =
              url.pathname.startsWith("/") && url.pathname.length > 1
                ? url.pathname.slice(1)
                : url.pathname;
            await deleteFileFromBucket(fileKey);
          } catch (e) {
            console.error("Erro ao deletar arquivo substituído:", e);
          }
        }),
      );
    }

    // Busca projeto anterior para comparar/remover arquivos antigos
    let previousThumbnailUrl: string | undefined = undefined;
    let previousCertificateUrl: string | undefined = undefined;
    let previousImagesUrl: string[] = [];

    if (id) {
      const existingProject = await db.project.findUnique({
        where: { id },
        select: {
          thumbnailUrl: true,
          certificateUrl: true,
          imagesUrl: true,
        },
      });
      previousThumbnailUrl = existingProject?.thumbnailUrl ?? undefined;
      previousCertificateUrl = existingProject?.certificateUrl ?? undefined;
      previousImagesUrl = existingProject?.imagesUrl ?? [];
    }

    // THUMBNAIL - Remover do bucket se mudou
    let thumbnailUrlString = thumbnailUrl || "";
    if (
      previousThumbnailUrl &&
      thumbnailUrlString &&
      previousThumbnailUrl !== thumbnailUrlString
    ) {
      try {
        const url = new URL(previousThumbnailUrl);
        const fileKey =
          url.pathname.startsWith("/") && url.pathname.length > 1
            ? url.pathname.slice(1)
            : url.pathname;
        await deleteFileFromBucket(fileKey);
      } catch (e) {
        console.error("Erro ao deletar thumbnail antiga:", e);
      }
    }
    if (!thumbnailUrlString && previousThumbnailUrl) {
      thumbnailUrlString = previousThumbnailUrl;
    }

    // CERTIFICADO - Remover do bucket se mudou
    let certificateUrlString = certificateUrl || "";
    if (
      previousCertificateUrl &&
      certificateUrlString &&
      previousCertificateUrl !== certificateUrlString
    ) {
      try {
        const url = new URL(previousCertificateUrl);
        const fileKey =
          url.pathname.startsWith("/") && url.pathname.length > 1
            ? url.pathname.slice(1)
            : url.pathname;
        await deleteFileFromBucket(fileKey);
      } catch (e) {
        console.error("Erro ao deletar certificado antigo:", e);
      }
    }
    if (!certificateUrlString && previousCertificateUrl) {
      certificateUrlString = previousCertificateUrl;
    }

    // IMAGENS DO PROJETO - Remover imagens antigas que não estão mais presentes
    let imagesUrlArray: string[] = Array.isArray(imagesUrl) ? imagesUrl : [];
    if (previousImagesUrl && previousImagesUrl.length > 0) {
      const toDelete = previousImagesUrl.filter(
        (oldUrl) => !imagesUrlArray.includes(oldUrl),
      );
      await Promise.all(
        toDelete.map(async (imgUrl) => {
          try {
            const url = new URL(imgUrl);
            const fileKey =
              url.pathname.startsWith("/") && url.pathname.length > 1
                ? url.pathname.slice(1)
                : url.pathname;
            await deleteFileFromBucket(fileKey);
          } catch (e) {
            console.error("Erro ao deletar imagem antiga:", e);
          }
        }),
      );
    }
    if (
      imagesUrlArray.length === 0 &&
      previousImagesUrl &&
      previousImagesUrl.length > 0
    ) {
      imagesUrlArray = previousImagesUrl;
    }

    // Remover tecnologias relacionadas antes de atualizar
    if (id) {
      await db.projectTechnology.deleteMany({
        where: { projectId: id },
      });
    }

    const projectData = {
      ...rest,
      certificateUrl: certificateUrlString ?? "",
      thumbnailUrl: thumbnailUrlString ?? "",
      imagesUrl: imagesUrlArray ?? [],
    };

    await db.project.upsert({
      where: { id: id ?? "" },
      update: {
        ...projectData,
        technologies: {
          create: technologies.map((techId: string, index: number) => ({
            order: index,
            technology: {
              connect: { id: techId },
            },
          })),
        },
      },
      create: {
        ...projectData,
        id: id ?? undefined,
        technologies: {
          create: technologies.map((techId: string, index: number) => ({
            order: index,
            technology: {
              connect: { id: techId },
            },
          })),
        },
      },
    });

    revalidatePath("/dashboard/projects");
  });
