import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import { account } from "@/lib/appwrite-client";

import { api } from "@/core/api";
import { ApiResponse } from "@/core/api/types";

import { UserPostsSchemaT } from "@/schema/user";
import { UserPosts } from "@/types/user";

export function useGetUserPosts({
  params,
  queryOptions,
}: {
  params: UserPostsSchemaT;
  queryOptions?: Partial<UseQueryOptions>;
}) {
  return useQuery({
    queryKey: ["user-posts"],
    queryFn: async () => {
      const jwt = await account.createJWT();

      const response = await api.get<ApiResponse<UserPosts>>({
        entity: "user/posts",
        options: {
          headers: { Authorization: `Bearer ${jwt.jwt}` },
          params
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
