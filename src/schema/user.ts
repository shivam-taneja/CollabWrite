import { z } from 'zod';

export const userPostsSchema = z.object({
  ownerPage: z.number().optional(),
  editorPage: z.number().optional(),
});

export type UserPostsSchemaT = z.input<typeof userPostsSchema>;