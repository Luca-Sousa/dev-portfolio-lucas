"use server";

import { getServerSession } from "next-auth";
import {
  upsertAcademicExperienceSchema,
  deleteAcademicExperienceSchema,
} from "./schema";
import { revalidatePath } from "next/cache";
import { db } from "@/app/lib/prisma";
import { actionClient } from "@/app/lib/safe-action";
import { authOptions } from "@/app/lib/auth";
import { deleteFileFromBucketByUrl } from "@/app/utils/delete-file";

export const upsertAcademicExperience = actionClient
  .schema(upsertAcademicExperienceSchema)
  .action(async ({ parsedInput }) => {
    const user = await getServerSession(authOptions);
    if (!user) throw new Error("Usuário não autenticado");

    const { id, modules = [], ...data } = parsedInput;

    // Usar uma transação para garantir consistência
    const academicExperience = await db.$transaction(async (tx) => {
      // 1. Criar ou atualizar a experiência acadêmica
      const academicExp = await tx.academicExperience.upsert({
        where: { id: id || "" },
        update: {
          title: data.title,
          type: data.type,
          dateDuration: data.dateDuration,
          institution: data.institution,
          description: data.description,
          imageUrl: data.imageUrl,
          institutionUrl: data.institutionUrl,
          certificateUrl: data.certificateUrl || null,
          declarationUrl: data.declarationUrl || null,
        },
        create: {
          title: data.title,
          type: data.type,
          dateDuration: data.dateDuration,
          institution: data.institution,
          description: data.description,
          imageUrl: data.imageUrl,
          institutionUrl: data.institutionUrl,
          certificateUrl: data.certificateUrl || null,
          declarationUrl: data.declarationUrl || null,
        },
      });

      // 2. Se está editando, deletar módulos existentes (cascade vai deletar programContent)
      if (id) {
        await tx.module.deleteMany({
          where: { academicExperienceId: academicExp.id },
        });
      }

      // 3. Criar novos módulos com seu conteúdo programático
      for (const moduleData of modules) {
        const createdModule = await tx.module.create({
          data: {
            title: moduleData.title,
            iconUrl: moduleData.iconUrl,
            status: moduleData.status,
            academicExperienceId: academicExp.id,
          },
        });

        // 4. Criar conteúdo programático para cada módulo
        if (moduleData.programContent && moduleData.programContent.length > 0) {
          await tx.programContent.createMany({
            data: moduleData.programContent.map((content) => ({
              title: content.title,
              description: content.description,
              certUrl: content.certUrl || null,
              moduleId: createdModule.id,
            })),
          });
        }
      }

      return academicExp;
    });

    revalidatePath("/academic-experiences");
    return academicExperience;
  });

export const deleteAcademicExperience = actionClient
  .schema(deleteAcademicExperienceSchema)
  .action(async ({ parsedInput }) => {
    const user = await getServerSession(authOptions);
    if (!user) throw new Error("Usuário não autenticado");

    const { id } = parsedInput;

    // Buscar a experiência acadêmica com todos os módulos e conteúdos antes de deletar
    const academicExperience = await db.academicExperience.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            programContent: true,
          },
        },
      },
    });

    if (!academicExperience) {
      throw new Error("Experiência acadêmica não encontrada");
    }

    // Coletar todas as URLs de arquivos para deletar
    const filesToDelete: string[] = [];

    // Arquivos da experiência acadêmica principal
    if (academicExperience.imageUrl) {
      filesToDelete.push(academicExperience.imageUrl);
    }
    if (academicExperience.certificateUrl) {
      filesToDelete.push(academicExperience.certificateUrl);
    }
    if (academicExperience.declarationUrl) {
      filesToDelete.push(academicExperience.declarationUrl);
    }

    // Arquivos dos módulos
    for (const moduleItem of academicExperience.modules) {
      if (moduleItem.iconUrl) {
        filesToDelete.push(moduleItem.iconUrl);
      }

      // Arquivos dos conteúdos programáticos
      for (const content of moduleItem.programContent) {
        if (content.certUrl) {
          filesToDelete.push(content.certUrl);
        }
      }
    }

    // Deletar a experiência acadêmica do banco de dados
    await db.academicExperience.delete({
      where: { id },
    });

    // Deletar arquivos do bucket (não bloqueante - se falhar, não impede a exclusão)
    for (const fileUrl of filesToDelete) {
      try {
        await deleteFileFromBucketByUrl(fileUrl);
      } catch (error) {
        console.error(`Erro ao deletar arquivo ${fileUrl}:`, error);
        // Continua com os outros arquivos mesmo se um falhar
      }
    }

    revalidatePath("/academic-experiences");
  });
