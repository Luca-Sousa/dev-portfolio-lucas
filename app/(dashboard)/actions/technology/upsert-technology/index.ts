"use server";

import { revalidatePath } from "next/cache";
import { upsertTechnologySchema, UpsertTechnologySchema } from "./schema";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export const upsertTechnology = async (data: UpsertTechnologySchema) => {
  upsertTechnologySchema.parse(data);

  const user = await getServerSession(authOptions);

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const technologyData = {
    ...data,
    iconURL: typeof data.iconURL === "string" ? data.iconURL : "",
  };

  await db.technology.upsert({
    where: {
      id: data.id || "",
    },
    update: technologyData,
    create: technologyData,
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard/technologies");
};
