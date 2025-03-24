import { z } from "zod";

export const deleteProjectSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteProjectSchema = z.infer<typeof deleteProjectSchema>;
