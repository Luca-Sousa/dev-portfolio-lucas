"use server";

import { revalidatePath } from "next/cache";
import { createTechnologySchema, CreateTechnologySchema } from "./schema";
import { db } from "@/app/lib/prisma";

export const createTechnology = async (data: CreateTechnologySchema) => {
  createTechnologySchema.parse(data);

  await db.technology.create({
    data,
  });

  revalidatePath("/dashboard/projects");
};
