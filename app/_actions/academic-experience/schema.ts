import { z } from "zod";

export const upsertAcademicExperienceSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  dateDuration: z.string().min(1, "Duração é obrigatória"),
  institution: z.string().min(1, "Instituição é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  imageUrl: z.string().url("URL da imagem deve ser válida"),
  institutionUrl: z.string().url("URL da instituição deve ser válida"),
  certificateUrl: z
    .string()
    .url("URL do certificado deve ser válida")
    .optional()
    .or(z.literal("")),
  declarationUrl: z
    .string()
    .url("URL da declaração deve ser válida")
    .optional()
    .or(z.literal("")),
});

export const deleteAcademicExperienceSchema = z.object({
  id: z.string().cuid(),
});

export type UpsertAcademicExperienceSchema = z.infer<
  typeof upsertAcademicExperienceSchema
>;
export type DeleteAcademicExperienceSchema = z.infer<
  typeof deleteAcademicExperienceSchema
>;
