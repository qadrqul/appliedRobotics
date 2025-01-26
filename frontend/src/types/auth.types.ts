import type { Role, User } from '@/types/api';

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface LoginResponse {
  token: string;
}

export interface JwtPayload {
  userId: number;
  role: Role;
  iat?: number;
  exp?: number;
}