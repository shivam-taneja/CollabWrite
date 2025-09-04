import { z } from "zod";

const basePostFields = {
  title: z.string().min(3, "Title must be at least 3 characters").max(50, "Title must be at most 50 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters").max(100, "Summary must be at most 100 characters"),
  category: z.enum(["Tech", "Life", "Food", "Health", "Other"]),
  content: z.string(),
};

export const createPostSchema = z.object({
  title: basePostFields.title,
});
export type CreatePostSchemaT = z.infer<typeof createPostSchema>;

export const postIdSchema = z.object({
  postId: z.string()
})
export type PostIdSchemaT = z.infer<typeof deletePostSchema>;

export const deletePostSchema = postIdSchema.extend({})
export type DeletePostSchemaT = z.infer<typeof deletePostSchema>;

export const updatePostSchema = postIdSchema
  .extend({
    title: basePostFields.title.optional(),
    summary: basePostFields.summary.optional(),
    category: basePostFields.category.optional(),
    content: basePostFields.content.optional()
  });
export type UpdatePostSchemaT = z.infer<typeof updatePostSchema>;

export const addPostCollaboratorSchema = postIdSchema.extend({
  email: z.email("Please enter a valid email"),
});
export type AddPostCollaboratorSchemaT = z.infer<typeof addPostCollaboratorSchema>;

export const removePostCollaboratorSchema = postIdSchema.extend({
  collaboratorId: z.string(),
});
export type RemovePostCollaboratorSchemaT = z.infer<typeof removePostCollaboratorSchema>;

export const updatePostPrivacySchema = postIdSchema.extend({
  privacySetting: z.boolean(),
});
export type UpdatePostPrivacySchemaT = z.infer<typeof updatePostPrivacySchema>;