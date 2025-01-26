import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { authApi } from '@/lib/api';
import type { User } from '@/types/api';
import type { AuthContextType } from '@/types/auth.types';
import { 
  createUserFromToken, 
  validateLoginResponse, 
  persistUserData, 
  clearUserData,
  loadStoredUser 
} from '@/utils/auth.utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = loadStoredUser();
      if (storedUser) {
        setUser(storedUser);
        if (window.location.pathname === '/login') {
          navigate('/dashboard');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login({ username, password });
      console.log('Login response:', response);

      if (!validateLoginResponse(response)) {
        throw new Error('Invalid response structure from server');
      }

      const userData = createUserFromToken(response.token, username);
      if (!userData) {
        throw new Error('Invalid token structure');
      }

      persistUserData(userData, response.token);
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    clearUserData();
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}