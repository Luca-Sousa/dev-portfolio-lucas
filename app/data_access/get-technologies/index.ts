"use server";

import { db } from "@/app/lib/prisma";

export const getTechnologies = async () => {
  const technologies = await db.technology.findMany();

  return technologies;
};
