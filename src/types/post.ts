import { Models } from "node-appwrite";

export interface PostDB extends Models.Row {
  $id: string,
  title: string,
  content: string,
  summary: string,
  category: PostCategory,
  $createdAt: string,
  $updatedAt: string,
  isPrivate: boolean
}

export interface PostCollaboratorDB extends Models.Row {
  userId: string;
  displayName: string,
  role: PostCollaboratorsRole;
}

export type PostCollaboratorsRole = 'owner' | 'editor'

export interface PostCollaboratorsEditorDetails
  extends Pick<PostCollaboratorDB, "role" | "displayName"> {
  $id: string,
  email: string,
}

export interface PostDetails
  extends Pick<PostDB, "$id" | "title" | "content" | "summary" | "category" | '$createdAt' | '$updatedAt'> {
  postCollaborators: {
    owner: string;
    collaborators: string[];
  };
}

export type UpdatePostDetails = Pick<PostDB, 'title' | 'content' | 'summary' | 'category'>

export type PostCategory = "Tech" | "Life" | "Food" | "Health" | "Other"

export const POST_CATEGORIES: PostCategory[] = ["Tech", "Life", "Food", "Health", "Other"]

export type CreatePostResult = {
  $id: string;
};