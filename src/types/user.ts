import { PostDB } from "./post"

export interface UserPostsSection {
  posts: Pick<PostDB, "$id" | "$createdAt" | "title" | "summary" | "category" | "isPrivate">[];
  total: number;
}

export interface UserPosts {
  owner: UserPostsSection;
  editor: UserPostsSection;
  totalPosts: number
}
