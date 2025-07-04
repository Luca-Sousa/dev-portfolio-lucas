"use server";

import { getServerSession } from "next-auth";
import {
  upsertAcademicExperienceSchema,
  deleteAcademicExperienceSchema,
} from "./schema";
import { actionClient } from "@/app/lib/safe-action";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export const upsertAcademicExperience = actionClient
  .schema(upsertAcademicExperienceSchema)
  .action(async ({ parsedInput }) => {
    const user = await getServerSession(authOptions);
    if (!user) throw new Error("Usuário não autenticado");

    const { id, ...data } = parsedInput;

    const academicExperience = await db.academicExperience.upsert({
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

    revalidatePath("/academic-experiences");
    return academicExperience;
  });

export const deleteAcademicExperience = actionClient
  .schema(deleteAcademicExperienceSchema)
  .action(async ({ parsedInput }) => {
    const user = await getServerSession(authOptions);
    if (!user) throw new Error("Usuário não autenticado");

    const { id } = parsedInput;

    await db.academicExperience.delete({
      where: { id },
    });

    revalidatePath("/academic-experiences");
    return { success: true };
  });
