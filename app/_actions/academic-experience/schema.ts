import { z } from "zod";
import { fileOrUrl } from "@/app/lib/utils";
import { ModuleStatus } from "@prisma/client";

// Schema para conteúdo programático
export const programContentSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  certUrl: z
    .string()
    .url("URL do certificado deve ser válida")
    .optional()
    .or(z.literal("")),
});

// Schema para módulos
export const moduleSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  iconUrl: z.string().url("URL do ícone deve ser válida"),
  status: z.nativeEnum(ModuleStatus),
  programContent: z.array(programContentSchema).optional().default([]),
});

// Schema para conteúdo programático no formulário (aceita Files)
export const programContentFormSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  certUrl: fileOrUrl.optional(),
});

// Schema para módulos no formulário (aceita Files)
export const moduleFormSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  iconUrl: fileOrUrl.min(1, { message: "Ícone é obrigatório" }),
  status: z.nativeEnum(ModuleStatus),
  programContent: z.array(programContentFormSchema).optional().default([]),
});

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
  modules: z.array(moduleSchema).min(1, "Pelo menos um módulo é obrigatório"),
});

// Schema para o formulário que aceita Files ou URLs
export const upsertAcademicExperienceFormSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  dateDuration: z.string().min(1, "Duração é obrigatória"),
  institution: z.string().min(1, "Instituição é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  imageUrl: fileOrUrl.min(1, { message: "Imagem é obrigatória" }),
  institutionUrl: z.string().url("URL da instituição deve ser válida"),
  certificateUrl: fileOrUrl.optional(),
  declarationUrl: fileOrUrl.optional(),
  modules: z
    .array(moduleFormSchema)
    .min(1, "Pelo menos um módulo é obrigatório"),
});

export const deleteAcademicExperienceSchema = z.object({
  id: z.string().cuid(),
});

export type ProgramContentSchema = z.infer<typeof programContentSchema>;
export type ModuleSchema = z.infer<typeof moduleSchema>;
export type ProgramContentFormSchema = z.infer<typeof programContentFormSchema>;
export type ModuleFormSchema = z.infer<typeof moduleFormSchema>;

export type UpsertAcademicExperienceSchema = z.infer<
  typeof upsertAcademicExperienceSchema
>;

export type UpsertAcademicExperienceFormSchema = z.infer<
  typeof upsertAcademicExperienceFormSchema
>;

export type DeleteAcademicExperienceSchema = z.infer<
  typeof deleteAcademicExperienceSchema
>;
