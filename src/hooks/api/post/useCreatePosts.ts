import { useMutation, UseMutationResult } from "@tanstack/react-query";

import { account } from "@/lib/appwrite-client";

import { api } from "@/core/api";
import { CreatePostSchemaT } from "@/schema/post";

import { ApiResponse } from "@/core/api/types";
import { CreatePostResult, } from "@/types/post";

export function useCreatePost() {
  return useMutation({
    mutationKey: ["create-post"],
    mutationFn: async ({ title }) => {
      try {
        const jwt = await account.createJWT();

        const response = await api.post<ApiResponse<CreatePostResult>>({
          entity: "post/create",
          data: { title },
          options: {
            headers: { Authorization: `Bearer ${jwt.jwt}` },
          },
        });

        if (!response.success) {
          throw new Error(response.error);
        }

        return response;
      } catch (err) {
        throw err;
      }
    },
  }) as UseMutationResult<ApiResponse<CreatePostResult>, ApiResponse, CreatePostSchemaT>;
}
