import { CollaboratorsDetails, Post } from "./post";

export interface FeedCollaborators {
  count: number;
  owner: string;
}

export type FeedRow = Pick<
  Post,
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