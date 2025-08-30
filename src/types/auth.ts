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
    logout: () => void;
  }
}

export interface AuthResult extends AuthUser {
  requiresVerification?: boolean;
}

export interface AuthFormProps {
  mode: 'login' | 'signup';
}