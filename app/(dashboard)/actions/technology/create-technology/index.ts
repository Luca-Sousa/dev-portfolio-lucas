"use server";

import { revalidatePath } from "next/cache";
import { createTechnologySchema, CreateTechnologySchema } from "./schema";
import { db } from "@/app/lib/prisma";

export const createTechnology = async (data: CreateTechnologySchema) => {
  createTechnologySchema.parse(data);

  const technologyData = {
    ...data,
    iconURL: typeof data.iconURL === "string" ? data.iconURL : "",
  };

  await db.technology.create({
    data: technologyData,
  });

  revalidatePath("/dashboard/projects");
};
