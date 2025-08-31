import { Models } from "node-appwrite"

export interface Post extends Models.Row {
  $id: string,
  title: string,
  content: string,
  summary: string,
  category: PostCategory,
  $createdAt: string,
  $updatedAt: string,
  isPrivate: boolean
}

export type PostCollaboratorsRole = 'owner' | 'editor'

export interface PostCollaborators {
  role: PostCollaboratorsRole,
  $id: string,
  userId: string
}

export interface CollaboratorsDetails {
  $id: string,
  name: string,
  email: string,
  role: PostCollaboratorsRole
}

export type PostWithCollab = Post & {
  postCollaborators: PostCollaborators[]
}

export type PostCategory = "Tech" | "Life" | "Food" | "Health" | "Other"

export const POST_CATEGORIES: PostCategory[] = ["Tech", "Life", "Food", "Health", "Other"]

export type CreatePostResult = {
  $id: string;
};