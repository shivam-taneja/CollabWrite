export interface KnowledgePost {
  id: string
  title: string
  content: string
  summary?: string
  category: PostCategory
  authorId: string
  authorName: string
  createdAt: Date
  updatedAt: Date
  collaborators?: string[]
}

export type PostCategory = "Tech" | "Life" | "Food" | "Health" | "Other"

export const POST_CATEGORIES: PostCategory[] = ["Tech", "Life", "Food", "Health", "Other"]

export interface CreatePostData {
  title: string
  content: string
  category: PostCategory
}

export interface User {
  id: string
  name: string
  email: string
}

export type CreatePostInput = {
  title: string;
};

export type CreatePostResult = {
  $id: string;
};