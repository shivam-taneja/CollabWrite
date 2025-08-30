import { useMutation } from "@tanstack/react-query";

import { account } from "@/lib/appwrite-client";
import { ID } from "appwrite";

import { ApiResponse } from "@/core/api/types";
import { useAuthActions } from "@/core/auth";

import { LoginFormData, SignupFormData } from "@/schema/auth";
import { AuthFormProps, AuthResult } from "@/types/auth";

export function useAuth(mode: AuthFormProps["mode"]) {
  const { setUser } = useAuthActions()

  return useMutation<ApiResponse<AuthResult>, Error, SignupFormData | LoginFormData>({
    mutationKey: [`auth-${mode}`],
    mutationFn: async (payload) => {
      if (mode === "login") {
        const { email, password } = payload as LoginFormData;
        await account.createEmailPasswordSession(email, password);
        const user = await account.get();

        return {
          success: true,
          data: {
            $id: user.$id,
            email: user.email,
            name: user.name,
            requiresVerification: !user.emailVerification
          }
        };
      } else {
        const { email, password, name } = payload as SignupFormData;
        // Create account
        await account.create(ID.unique(), email, password, name);

        // Log them in immediately after signup
        await account.createEmailPasswordSession(email, password);

        // TODO: Send verification email
        // await account.createVerification(`${process.env.NEXT_PUBLIC_APP_URL}/verify`);

        const user = await account.get();

        return {
          success: true,
          data: {
            $id: user.$id,
            email: user.email,
            name: user.name,
            requiresVerification: !user.emailVerification
          }
        };
      }
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        setUser({
          $id: response.data.$id,
          name: response.data.name,
          email: response.data.email,
        });
      }
    },
  });
}
