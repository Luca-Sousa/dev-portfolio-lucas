import { z } from "zod";

export const upsertProjectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  startDate: z
    .date({ message: "A data é obrigatória" })
    .refine((date) => date <= new Date(), {
      message: "A data não pode ser no futuro",
    }),
  certificateUrl: z
    .string()
    .url({
      message: "URL do certificado inválida.",
    })
    .optional(),
  certificateDesc: z.string().optional(),
  imagesUrl: z
    .string()
    .url({
      message: "URL do ícone inválida.",
    })
    .array()
    .optional(),
  thumbnailUrl: z.string().url({
    message: "URL da thumbnail inválida.",
  }),
  repositoryUrl: z.string().url({ message: "URL do repositório inválida" }),
  deployUrl: z.string().optional(),
  figmaUrl: z.string().optional(),
  status: z.enum(["IN_PROGRESS", "IN_UPDATE", "IN_PRODUCTION"], {
    message: "Selecione um status válido",
  }),
  technologies: z
    .array(z.string().min(1, { message: "O nome da tecnologia é obrigatório" }))
    .min(1, { message: "Selecione pelo menos uma tecnologia" }),
});

export type UpsertProjectSchema = z.infer<typeof upsertProjectSchema>;
