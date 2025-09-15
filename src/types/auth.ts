export type UserRole = 'user' | 'administrator';

export interface LoginFormData {
  role: UserRole;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    role: UserRole;
  } | null;
  loading: boolean;
  error: string | null;
}