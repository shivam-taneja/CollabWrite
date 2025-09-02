import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { api } from "@/core/api";
import { useAuthActions } from "@/core/auth";

import { ApiResponse } from "@/core/api/types";
import { UpdatePostDetails } from "@/types/post";

export function useUpdatePostDetailsById() {
  const queryClient = useQueryClient();
  const { getValidJwt } = useAuthActions();

  return useMutation({
    mutationKey: ["update-post-details"],
    mutationFn: async ({ postId, updatedDetails }: { postId: string, updatedDetails: Partial<UpdatePostDetails> }) => {
      const jwt = await getValidJwt();

      const response = await api.patch<ApiResponse<{ updated: boolean }>>({
        entity: `post/${postId}/edit`,
        data: updatedDetails,
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
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      // queryClient.invalidateQueries({ queryKey: ["post-details"] });
    },
  }) as UseMutationResult<ApiResponse<{ updated: boolean }>, Error, { postId: string, updatedDetails: Partial<UpdatePostDetails> }>;
}
