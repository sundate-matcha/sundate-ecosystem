'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('admin_token');
      if (storedToken) {
        apiClient.setToken(storedToken);
        const response = await apiClient.verifyToken();
        if (response.data?.valid && response.data.user) {
          setUser(response.data.user);
          setToken(storedToken);
        } else {
          apiClient.clearToken();
          localStorage.removeItem('admin_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(identifier, password);
      if (response.data) {
        const { user, token } = response.data;
        if (user.role === 'admin') {
          setUser(user);
          setToken(token);
          apiClient.setToken(token);
          return true;
        } else {
          throw new Error('Access denied. Admin privileges required.');
        }
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiClient.clearToken();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
