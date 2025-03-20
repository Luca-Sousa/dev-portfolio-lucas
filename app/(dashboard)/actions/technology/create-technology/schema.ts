import { z } from "zod";

export const createTechnologySchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome é obrigatório.",
  }),
  iconURL: z.string().url("A Imagem é obrigatória."),
});

export type CreateTechnologySchema = z.infer<typeof createTechnologySchema>;
