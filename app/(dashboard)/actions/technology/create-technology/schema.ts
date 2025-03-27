import { z } from "zod";

const fileOrUrl = z
  .union([
    z.instanceof(Blob, { message: "Input not instance of File" }),
    z.string().url({ message: "Invalid URL" }),
  ])
  .optional();

export const createTechnologySchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome é obrigatório.",
  }),
  description: z.string().trim().min(1, {
    message: "A descrição é obrigatória.",
  }),
  iconURL: fileOrUrl.refine((val) => val !== undefined, {
    message: "A Imagem é obrigatória.",
  }),
});

export type CreateTechnologySchema = z.infer<typeof createTechnologySchema>;
