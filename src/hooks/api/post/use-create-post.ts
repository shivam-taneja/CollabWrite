import { useMutation } from "@tanstack/react-query";

import { ApiResponse } from "@/core/api/types";
import { account, databases } from "@/lib/appwrite-client";
import { ID, Permission, Role } from "appwrite";

import { CreatePostInput, CreatePostResult } from "@/types/post";

export function useCreatePost() {
  return useMutation<ApiResponse<CreatePostResult>, Error, CreatePostInput>({
    mutationKey: ["create-post"],
    mutationFn: async ({ title }) => {
      const user = await account.get();
      const userId = user.$id;

      const post = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID!,
        ID.unique(),
        {
          title,
          content: "",
          ownerId: userId,
          isShared: false,
          isPrivate: true,
        },
        [
          Permission.read(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ]
      );

      return {
        success: true,
        data: {
          $id: post.$id,
        },
      };
    },
  });
}
