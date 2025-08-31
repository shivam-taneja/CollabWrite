import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
});

export type CreatePostSchemaT = z.infer<typeof createPostSchema>

export const updatePostSchema = createPostSchema.extend({
  summary: z.string().min(10, "Summary must be at least 10 characters").optional(),
  postId: z.string()
});

export type UpdatePostSchemaT = z.infer<typeof updatePostSchema>;