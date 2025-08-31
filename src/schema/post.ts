import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
});

export type CreatePostSchemaT = z.infer<typeof createPostSchema>