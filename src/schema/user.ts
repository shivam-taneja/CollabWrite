import { z } from 'zod';

export const userPostsSchema = z.object({
  page: z.number().optional(),
});

export type UserPostsSchemaT = z.input<typeof userPostsSchema>;