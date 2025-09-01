import { PostDB } from "./post"

export type UserPost = PostDB & {
  isPrivate: boolean
}

export interface UserPostsSection {
  posts: Pick<UserPost, "$id" | "$createdAt" | "title" | "summary" | "category" | "isPrivate">[];
  total: number;
}

export interface UserPosts {
  owner: UserPostsSection;
  editor: UserPostsSection;
  totalPosts: number
}
