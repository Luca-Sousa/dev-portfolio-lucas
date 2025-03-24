import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  subject: z.string().optional(),
  message: z.string().min(1, "Mensagem é obrigatório"),
});

export type ContactMessageSchema = z.infer<typeof contactMessageSchema>;
