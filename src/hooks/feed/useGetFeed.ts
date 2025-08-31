import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import { api } from "@/core/api";
import { ApiResponse } from "@/core/api/types";

import { FeedSearchFormT } from "@/schema/feed";

import { FeedData } from "@/types/feed";

export function useGetFeed({ params, queryOptions }: { params: FeedSearchFormT, queryOptions?: Partial<UseQueryOptions> }) {
  return useQuery({
    queryKey: ["feed", params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<FeedData>>({
        entity: "feed",
        options: { params },
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
    refetchOnWindowFocus: false,
    retry: false,
    ...queryOptions,
  }) as UseQueryResult<FeedData, Error>;
}
