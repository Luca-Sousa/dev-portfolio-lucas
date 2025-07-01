import { z } from "zod";

export const upsertTechnologySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, {
    message: "O nome é obrigatório.",
  }),
  description: z.string().trim().min(1, {
    message: "A descrição é obrigatória.",
  }),
  iconURL: z.string().url({
    message: "URL do ícone inválida.",
  }),
});

export type UpsertTechnologySchema = z.infer<typeof upsertTechnologySchema>;
