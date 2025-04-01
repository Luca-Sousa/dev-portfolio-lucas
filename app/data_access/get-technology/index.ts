"use server";

import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";

export const getTechnology = async (id: { id: string }) => {
  const user = await getServerSession(authOptions);

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const TechnologyData = await db.technology.findUnique({
    where: id,
  });

  return TechnologyData;
};
