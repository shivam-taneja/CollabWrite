import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { api } from "@/core/api";
import { useAuthActions } from "@/core/auth";

import { ApiResponse } from "@/core/api/types";
import { AddPostCollaboratorSchemaT } from "@/schema/post";

export function useAddCollaborator() {
  const queryClient = useQueryClient();
  const { getValidJwt } = useAuthActions();

  return useMutation({
    mutationKey: ["add-post-collaborator"],
    mutationFn: async ({ postId, email }: AddPostCollaboratorSchemaT) => {
      const jwt = await getValidJwt();

      const response = await api.post<ApiResponse<{ added: boolean }>>({
        entity: "post/collaborators",
        data: { postId, email },
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
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
    },
  }) as UseMutationResult<ApiResponse<{ added: boolean }>, Error, AddPostCollaboratorSchemaT>;
}
