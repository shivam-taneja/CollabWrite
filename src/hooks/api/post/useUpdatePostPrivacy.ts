import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { api } from "@/core/api";
import { useAuthActions } from "@/core/auth";

import { ApiResponse } from "@/core/api/types";
import { UpdatePostPrivacySchemaT } from "@/schema/post";

export function useUpdatePostPrivacy() {
  const queryClient = useQueryClient();
  const { getValidJwt } = useAuthActions();

  return useMutation({
    mutationKey: ["update-post-privacy"],
    mutationFn: async ({ postId, privacySetting }: UpdatePostPrivacySchemaT) => {
      const jwt = await getValidJwt();

      const response = await api.patch<ApiResponse<{ updated: true }>>({
        entity: "post/privacy",
        data: { postId, privacySetting },
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
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  }) as UseMutationResult<ApiResponse<{ updated: true }>, Error, UpdatePostPrivacySchemaT>;
}
