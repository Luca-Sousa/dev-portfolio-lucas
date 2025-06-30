"use server";

import { db } from "@/app/lib/prisma";
import { contactMessageSchema, ContactMessageSchema } from "./schema";
import { revalidatePath } from "next/cache";

export const createContactMessage = async (data: ContactMessageSchema) => {
  contactMessageSchema.parse(data);

  await db.contactMessage.create({
    data,
  });

  revalidatePath("/dashboard/projects");
};
