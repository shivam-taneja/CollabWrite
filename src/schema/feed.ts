import { z } from 'zod';

import { POST_CATEGORIES } from '@/types/post';

const baseFeedSearchSchema = z.object({
  search: z.string().optional(),
  offset: z.number().min(0).default(0),
});

// frontend: allow "All"
export const feedSearchSchema = baseFeedSearchSchema.extend({
  category: z.enum(["All", ...POST_CATEGORIES]),
});

// backend: category is optional
export const backendFeedSearchSchema = baseFeedSearchSchema.extend({
  category: z.enum(POST_CATEGORIES).optional(),
});

export type FeedSearchFormT = z.input<typeof feedSearchSchema>;