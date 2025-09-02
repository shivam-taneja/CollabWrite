import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { api } from "@/core/api";
import { account } from "@/lib/appwrite-client";
import { DeletePostSchemaT } from "@/schema/post";

import { ApiResponse } from "@/core/api/types";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-post"],
    mutationFn: async ({ postId }: DeletePostSchemaT) => {
      const jwt = await account.createJWT();

      const response = await api.delete<ApiResponse<{ deleted: true }>>({
        entity: `post/${postId}`,
        options: {
          headers: { Authorization: `Bearer ${jwt.jwt}` },
        },
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
    },
  }) as UseMutationResult<ApiResponse<{ deleted: true }>, Error, DeletePostSchemaT>;
}
