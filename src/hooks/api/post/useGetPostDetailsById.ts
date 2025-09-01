import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import { api } from "@/core/api";
import { ApiResponse } from "@/core/api/types";

import { PostDetails } from "@/types/post";

export function useGetPostDetailsById({ postId, queryOptions }: { postId: string, queryOptions?: Partial<UseQueryOptions> }) {
  return useQuery({
    queryKey: ["post-details", postId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PostDetails>>({
        entity: `post/${postId}`,
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
    refetchOnWindowFocus: false,
    retry: false,
    ...queryOptions,
  }) as UseQueryResult<PostDetails, Error>;
}
