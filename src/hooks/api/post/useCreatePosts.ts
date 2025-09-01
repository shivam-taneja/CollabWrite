import { useMutation, UseMutationResult } from "@tanstack/react-query";

import { api } from "@/core/api";
import { useAuthActions } from "@/core/auth";

import { CreatePostSchemaT } from "@/schema/post";

import { ApiResponse } from "@/core/api/types";
import { CreatePostResult, } from "@/types/post";

export function useCreatePost() {
  const { getValidJwt } = useAuthActions();

  return useMutation({
    mutationKey: ["create-post"],
    mutationFn: async ({ title }) => {
      try {
        const jwt = await getValidJwt();

        const response = await api.post<ApiResponse<CreatePostResult>>({
          entity: "post",
          data: { title },
          options: {
            headers: { Authorization: `Bearer ${jwt}` },
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
