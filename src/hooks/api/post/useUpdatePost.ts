import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { api } from "@/core/api";
import { useAuthActions } from "@/core/auth";

import { UpdatePostSchemaT } from "@/schema/post";

import { ApiResponse } from "@/core/api/types";
import { UserPost } from "@/types/user";

export function useUpdatePost() {
  const queryClient = useQueryClient()
  const { getValidJwt } = useAuthActions();

  return useMutation({
    mutationKey: ["update-post"],
    mutationFn: async ({ postId, ...updatedData }) => {
      const jwt = await getValidJwt();

      const response = await api.patch<ApiResponse<UserPost>>({
        entity: `post/${postId}`,
        data: updatedData,
        options: {
          headers: { Authorization: `Bearer ${jwt}` },
        },
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
    }
  }) as UseMutationResult<ApiResponse<UserPost>, Error, UpdatePostSchemaT>;
}
