interface AuthUser {
  $id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;

  actions: {
    setUser: (user: AuthUser | null) => void;
    setAuthenticated: (authenticated: boolean) => void;
    logout: () => void;
  }
}

export interface AuthResult {
  $id: string,
  name: string,
  email: string,
  requiresVerification?: boolean;
}

export interface AuthFormProps {
  mode: 'login' | 'signup';
}