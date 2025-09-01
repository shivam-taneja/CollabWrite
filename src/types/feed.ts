import { PostDB } from "./post";

export interface FeedCollaborators {
  count: number;
  owner: string;
}

export type FeedRow = Pick<
  PostDB,
  "$id" | "title" | "summary" | "$createdAt" | "category"
> & {
  postCollaborators: FeedCollaborators;
};

export type FeedData = {
  rows: FeedRow[];
  total: number;
  page: number;
  totalPages: number;
};