import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { api } from "@/core/api";
import { useAuthActions } from "@/core/auth";
import { PostIdSchemaT } from "@/schema/post";

import { ApiResponse } from "@/core/api/types";

export function useStopPostSharing() {
  const queryClient = useQueryClient();
  const { getValidJwt } = useAuthActions();

  return useMutation({
    mutationKey: ["stop-post-sharing"],
    mutationFn: async ({ postId }: PostIdSchemaT) => {
      const jwt = await getValidJwt();

      const response = await api.delete<ApiResponse<{ stoppedSharing: true }>>({
        entity: "post/sharing",
        options: {
          headers: { Authorization: `Bearer ${jwt}` },
          params: { postId }
        },
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  }) as UseMutationResult<ApiResponse<{ stoppedSharing: true }>, Error, PostIdSchemaT>;
}
