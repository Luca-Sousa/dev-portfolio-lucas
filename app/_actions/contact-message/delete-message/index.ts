"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteContactMessage, DeleteContactMessage } from "./schema";

export const deleteMessage = async ({ id }: DeleteContactMessage) => {
  deleteContactMessage.parse({ id });

  await db.contactMessage.delete({
    where: { id },
  });

  revalidatePath("/dashboard/projects");
};
