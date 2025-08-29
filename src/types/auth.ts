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