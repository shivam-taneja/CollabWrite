import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import { api } from "@/core/api";
import { ApiResponse } from "@/core/api/types";
import { useAuthActions, useIsAuthenticated } from "@/core/auth";

import { PostDetails } from "@/types/post";

export function useGetPostDetails({
  postId,
  requireAuth = false,
  queryOptions
}: {
  postId: string,
  requireAuth?: boolean,
  queryOptions?: Partial<UseQueryOptions>
}) {
  const { getValidJwt, getJwtIfValid } = useAuthActions();
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: ["post-details", postId],
    queryFn: async () => {
      let headers: Record<string, string> = {};

      if (requireAuth || isAuthenticated) {
        const jwt = await getValidJwt();

        headers = { Authorization: `Bearer ${jwt}` };
      } else {
        const jwt = getJwtIfValid()

        if (jwt) {
          headers = { Authorization: `Bearer ${jwt}` };
        }
      }

      const response = await api.get<ApiResponse<PostDetails>>({
        entity: `post/${postId}`,
        options: { headers },
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
