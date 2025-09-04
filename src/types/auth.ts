interface AuthUser {
  $id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;

  jwt: string | null;
  jwtExpiry: number | null; // epoch ms

  actions: {
    setUser: (user: AuthUser | null) => void;
    logout: () => void;
    getValidJwt: () => Promise<string>;
    getJwtIfValid: () => string | null;
  }
}

export interface AuthResult extends AuthUser {
  requiresVerification?: boolean;
}

export interface AuthFormProps {
  mode: 'login' | 'signup';
}