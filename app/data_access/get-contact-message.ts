"use server";

import { db } from "../lib/prisma";

export const getContactMessages = async () => {
  const contactMessages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return contactMessages;
};
