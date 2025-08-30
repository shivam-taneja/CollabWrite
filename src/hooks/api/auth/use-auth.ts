import { api } from '@/core/api';

import { useMutation } from '@tanstack/react-query';

import { LoginFormData, SignupFormData } from '@/schema/auth';
import { AuthFormProps, AuthResult } from '@/types/auth';

export function useAuth(mode: AuthFormProps['mode']) {
  return useMutation({
    mutationKey: [`auth-${mode}`],
    mutationFn: async (payload: SignupFormData | LoginFormData) =>
      await api.post<AuthResult>({
        entity: mode === 'login' ? '/auth/login' : '/auth/signup',
        data: payload
      }),
  });
}
