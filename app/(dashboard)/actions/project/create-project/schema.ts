import { z } from "zod";

export const createProjectSchema = z.object({
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
    .url({ message: "URL do Certificado inválida" })
    .optional(),
  certificateDesc: z.string().optional(),
  imagesUrl: z.array(z.string().url()).min(1, {
    message: "Adicione pelo menos uma imagem válida",
  }),
  thumbnailUrl: z.string().url({ message: "URL da imagem inválida" }),
  repositoryUrl: z.string().url({ message: "URL do repositório inválida" }),
  deployUrl: z.string().url({ message: "URL de deploy inválida" }),
  status: z.enum(["IN_PROGRESS", "IN_UPDATE", "IN_PRODUCTION"], {
    message: "Selecione um status válido",
  }),
  technologies: z
    .array(z.string().min(1, { message: "O nome da tecnologia é obrigatório" }))
    .min(1, { message: "Selecione pelo menos uma tecnologia" }),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
