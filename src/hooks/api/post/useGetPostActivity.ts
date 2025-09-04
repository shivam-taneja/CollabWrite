'use client';

import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import { api } from "@/core/api";
import { useAuthActions } from "@/core/auth";

import { ApiResponse } from "@/core/api/types";
import { PostActivityDB } from "@/types/post";

export function useGetPostActivity({
  postId,
  queryOptions,
}: {
  postId: string,
  queryOptions?: Partial<UseQueryOptions>;
}) {
  const { getValidJwt } = useAuthActions();

  return useQuery({
    queryKey: ["post-activity", postId],
    queryFn: async () => {
      const jwt = await getValidJwt();

      const response = await api.get<ApiResponse<PostActivityDB>>({
        entity: "post/post-activity",
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
    retry: false,
    refetchOnWindowFocus: false,
    ...queryOptions
  }) as UseQueryResult<PostActivityDB, Error>;
}
