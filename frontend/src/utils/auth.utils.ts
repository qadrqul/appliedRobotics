import type { User } from '@/types/api';
import type { LoginResponse } from '@/types/auth.types';
import { parseJwt } from './jwt';

export function createUserFromToken(token: string, username: string): User | null {
  const decodedToken = parseJwt(token);
  
  if (!decodedToken || !decodedToken.userId || !decodedToken.role) {
    console.error('Invalid token structure');
    return null;
  }

  return {
    id: decodedToken.userId.toString(),
    username: username,
    role: decodedToken.role,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function validateLoginResponse(response: any): response is LoginResponse {
  return response && typeof response.token === 'string';
}

export function persistUserData(user: User, token: string): void {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
}

export function clearUserData(): void {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

export function loadStoredUser(): User | null {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && typeof parsedUser === 'object' && 'username' in parsedUser) {
        return parsedUser;
      }
    }
    return null;
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    clearUserData();
    return null;
  }
}