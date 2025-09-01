import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import { api } from "@/core/api";
import { useAuthActions } from "@/core/auth";

import { ApiResponse } from "@/core/api/types";
import { UserPosts } from "@/types/user";

export function useGetUserPosts({
  queryOptions,
}: {
  queryOptions?: Partial<UseQueryOptions>;
}) {
  const { getValidJwt } = useAuthActions();

  return useQuery({
    queryKey: ["user-posts"],
    queryFn: async () => {
      const jwt = await getValidJwt();

      const response = await api.get<ApiResponse<UserPosts>>({
        entity: "post/my-posts",
        options: {
          headers: { Authorization: `Bearer ${jwt}` },
        },
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
    refetchOnWindowFocus: false,
    retry: false,
    ...queryOptions,
  }) as UseQueryResult<UserPosts, Error>;
}
