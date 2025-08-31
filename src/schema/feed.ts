import { z } from 'zod';

export const feedSearchSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  offset: z.number().min(0).default(0),
});

export type FeedSearchFormT = z.input<typeof feedSearchSchema>;