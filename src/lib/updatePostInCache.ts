import { QueryClient } from "@tanstack/react-query";

import { PostDB, PostDetails } from "@/types/post";

export function updatePostInCache(queryClient: QueryClient, updatedPost: PostDB) {
  queryClient.setQueryData(["post-details", updatedPost.$id], (old: PostDetails | undefined) => {
    if (!old) {
      return {
        $id: updatedPost.$id,
        title: updatedPost.title,
        summary: updatedPost.summary,
        content: updatedPost.content,
        category: updatedPost.category,
        $createdAt: updatedPost.$createdAt,
        $updatedAt: updatedPost.$updatedAt,
        postCollaborators: { owner: "", collaborators: [] },
      }
    };

    return {
      ...old,
      title: updatedPost.title,
      summary: updatedPost.summary,
      content: updatedPost.content,
      category: updatedPost.category,
      $updatedAt: updatedPost.$updatedAt,
    };
  });
}
