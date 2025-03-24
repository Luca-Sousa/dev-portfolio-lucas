import { z } from "zod";

export const deleteContactMessage = z.object({
  id: z.string().uuid(),
});

export type DeleteContactMessage = z.infer<typeof deleteContactMessage>;
