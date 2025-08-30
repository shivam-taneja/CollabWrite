import { api } from '@/core/api';

import { useMutation } from '@tanstack/react-query';

export function useLogout() {
  return useMutation({
    mutationKey: ['auth-logout'],
    mutationFn: async () =>
      await api.post<{}>({
        entity: '/auth/logout',
        data: {}
      }),
  });
}
