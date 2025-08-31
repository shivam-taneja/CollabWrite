import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import { api } from "@/core/api";
import { account } from "@/lib/appwrite-client";

import { ApiResponse } from "@/core/api/types";
import { UserPosts } from "@/types/user";

export function useGetUserPosts({
  queryOptions,
}: {
  queryOptions?: Partial<UseQueryOptions>;
}) {
  return useQuery({
    queryKey: ["user-posts"],
    queryFn: async () => {
      const jwt = await account.createJWT();

      const response = await api.get<ApiResponse<UserPosts>>({
        entity: "post/my-posts",
        options: {
          headers: { Authorization: `Bearer ${jwt.jwt}` },
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
