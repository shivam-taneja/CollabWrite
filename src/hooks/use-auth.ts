import { useCallback } from 'react';

import { useAuthActions } from '@/core/auth';
import { account } from '@/lib/appwrite';

import { AuthResult } from '@/types/auth';
import { ID } from 'appwrite';

const useAuth = () => {
  const { setUser, logout: logoutStore } = useAuthActions()

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();

      setUser({
        $id: user.$id,
        name: user.name,
        email: user.email,
      });

      return {
        success: true,
        requiresVerification: !user.emailVerification
      };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Login failed'
      return {
        success: false,
        error: errMsg
      };
    }
  }, [setUser])

  const signup = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    try {
      // Create account
      await account.create(ID.unique(), email, password, name);

      // Log them in immediately after signup
      await account.createEmailPasswordSession(email, password);

      // TODO: Send verification email
      // await account.createVerification(`${window.location.origin}/verify-email`);

      const user = await account.get();

      setUser({
        $id: user.$id,
        name: user.name,
        email: user.email,
      });

      return {
        success: true,
        requiresVerification: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Signup failed'
      };
    }
  }, [setUser]);


  const logout = useCallback(async (): Promise<AuthResult> => {
    try {
      await account.deleteSession('current');
      logoutStore();
      return { success: true };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Login failed'
      return {
        success: false,
        error: errMsg
      };
    }
  }, [logoutStore]);

  return {
    login,
    signup,
    logout
  }
}

export default useAuth 