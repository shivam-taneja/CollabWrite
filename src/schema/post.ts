import { z } from "zod";

export const startPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
});

export type StartPostSchemaT = z.infer<typeof startPostSchema>