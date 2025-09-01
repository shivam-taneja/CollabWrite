import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { api } from "@/core/api";
import { useAuthActions } from "@/core/auth";

import { ApiResponse } from "@/core/api/types";
import { RemovePostCollaboratorSchemaT } from "@/schema/post";

export function useRemovePostCollaborator() {
  const queryClient = useQueryClient();
  const { getValidJwt } = useAuthActions();

  return useMutation({
    mutationKey: ["remove-post-collaborator"],
    mutationFn: async ({ postId, collaboratorId }: RemovePostCollaboratorSchemaT) => {
      const jwt = await getValidJwt();

      const response = await api.delete<ApiResponse<{ removed: boolean }>>({
        entity: "post/collaborators",
        options: {
          headers: { Authorization: `Bearer ${jwt}` },
          params: { postId, collaboratorId }
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
  }) as UseMutationResult<ApiResponse<{ removed: boolean }>, Error, RemovePostCollaboratorSchemaT>;
}
