import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import { api } from "@/core/api";
import { account } from "@/lib/appwrite-client";
import { UpdatePostSchemaT } from "@/schema/post";

import { ApiResponse } from "@/core/api/types";
import { UserPost } from "@/types/user";

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-post"],
    mutationFn: async (data) => {
      const jwt = await account.createJWT();

      const response = await api.patch<ApiResponse<UserPost>>({
        entity: "post",
        data: data,
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
    }
  }) as UseMutationResult<ApiResponse<UserPost>, Error, UpdatePostSchemaT>;
}
